import { NextResponse } from "next/server";
import { z } from "zod";
import { getAvailabilitySlotById, getCoachBySlug, getSessionTypeById } from "@/lib/coach-data";
import { createClient, createServiceRoleClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getStripe, isStripeConfigured } from "@/lib/stripe";

const bodySchema = z.object({
  sessionTypeId: z.string().min(1),
  slotId: z.string().min(1),
  name: z.string().optional(),
  email: z.string().email().optional(),
});

/**
 * Starts the transaction spine: validate the request, create a
 * 'pending_payment' booking row, and hand back a Stripe Checkout URL. The
 * booking only becomes 'confirmed' when the Stripe webhook fires — this
 * route never trusts the browser to say a payment succeeded.
 */
export async function POST(request: Request) {
  const json = await request.json().catch(() => null);
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Missing or invalid booking details." }, { status: 400 });
  }
  const { sessionTypeId, slotId, name, email } = parsed.data;

  const coach = await getCoachBySlug("tony");
  const sessionType = await getSessionTypeById(sessionTypeId);
  const slot = await getAvailabilitySlotById(slotId);

  if (!coach || !sessionType || !slot) {
    return NextResponse.json({ error: "That session or time isn't available anymore." }, { status: 404 });
  }
  if (slot.is_booked) {
    return NextResponse.json({ error: "That time was just booked by someone else. Pick another." }, { status: 409 });
  }

  // Resolve who's booking. Live mode requires a signed-in client so the
  // booking lands in their account; demo mode (no Supabase yet) accepts a
  // name/email so the flow is still previewable end-to-end.
  let clientId: string | null = null;
  let clientEmail = email ?? null;

  if (isSupabaseConfigured) {
    const supabase = await createClient();
    const { data } = (await supabase?.auth.getUser()) ?? { data: { user: null } };
    if (!data.user) {
      return NextResponse.json({ error: "Sign in before booking so we can save this to your account." }, { status: 401 });
    }
    clientId = data.user.id;
    clientEmail = data.user.email ?? clientEmail;

    await supabase!
      .from("client_profiles")
      .upsert({ id: data.user.id, email: data.user.email, full_name: name }, { onConflict: "id" });
  } else {
    if (!email) {
      return NextResponse.json({ error: "Email is required." }, { status: 400 });
    }
  }

  if (!isStripeConfigured) {
    return NextResponse.json(
      {
        error:
          "Stripe isn't connected yet. Add STRIPE_SECRET_KEY to .env.local to enable real checkout — see README.md.",
      },
      { status: 501 }
    );
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  let bookingId: string | null = null;
  const serviceClient = createServiceRoleClient();

  if (serviceClient && clientId) {
    const { data: booking, error } = await serviceClient
      .from("bookings")
      .insert({
        client_id: clientId,
        coach_id: coach.id,
        session_type_id: sessionType.id,
        slot_id: slot.id,
        status: "pending_payment",
        starts_at: slot.starts_at,
        ends_at: slot.ends_at,
        price_cents: sessionType.price_cents,
      })
      .select("id")
      .single();

    if (error) {
      return NextResponse.json({ error: "Couldn't create the booking. Try again." }, { status: 500 });
    }
    bookingId = booking.id;
  }

  const stripe = getStripe();
  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    customer_email: clientEmail ?? undefined,
    line_items: [
      {
        price_data: {
          currency: "usd",
          unit_amount: sessionType.price_cents,
          product_data: {
            name: `${sessionType.name} with ${coach.full_name}`,
            description: `${sessionType.duration_minutes}-minute financial coaching session`,
          },
        },
        quantity: 1,
      },
    ],
    success_url: `${siteUrl}/book/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${siteUrl}/book?session=${sessionType.id}`,
    metadata: {
      booking_id: bookingId ?? "",
      session_type_id: sessionType.id,
      slot_id: slot.id,
      coach_id: coach.id,
    },
  });

  if (serviceClient && bookingId) {
    await serviceClient
      .from("bookings")
      .update({ stripe_checkout_session_id: checkoutSession.id })
      .eq("id", bookingId);
  }

  return NextResponse.json({ url: checkoutSession.url });
}
