import { NextResponse } from "next/server";
import { z } from "zod";
import { format } from "date-fns";
import { getAvailabilitySlotById, getCoachBySlug, getSessionTypeById } from "@/lib/coach-data";
import { createClient, createServiceRoleClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getStripe, isStripeConfigured } from "@/lib/stripe";
import { createZoomMeeting } from "@/lib/zoom";
import {
  introBookedClientEmail,
  introBookedFounderEmail,
  notifyFounder,
  sendEmail,
} from "@/lib/email";

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

  // Resolve who's booking. Paid sessions require a signed-in client so the
  // booking lands in their account. The FREE intro call must never hit an
  // account wall — a first conversation gated behind "create an account"
  // loses the people the whole site exists for. Guests give name + email;
  // we create a passwordless auth user server-side (satisfies the
  // client_profiles FK) and they never see a login screen.
  let clientId: string | null = null;
  let clientEmail = email ?? null;
  const isFreeIntro = sessionType.price_cents === 0;

  if (isSupabaseConfigured) {
    const supabase = await createClient();
    const { data } = (await supabase?.auth.getUser()) ?? { data: { user: null } };

    if (data.user) {
      clientId = data.user.id;
      clientEmail = data.user.email ?? clientEmail;
      await supabase!
        .from("client_profiles")
        .upsert({ id: data.user.id, email: data.user.email, full_name: name }, { onConflict: "id" });
    } else if (isFreeIntro) {
      if (!clientEmail) {
        return NextResponse.json(
          { error: "Add your email so Tony can send you the video link." },
          { status: 400 }
        );
      }
      const admin = createServiceRoleClient();
      if (!admin) {
        return NextResponse.json({ error: "Booking isn't available right now." }, { status: 500 });
      }

      const normalized = clientEmail.toLowerCase().trim();
      const { data: created, error: createErr } = await admin.auth.admin.createUser({
        email: normalized,
        email_confirm: true,
        user_metadata: { full_name: name ?? null, source: "free_intro_guest" },
      });

      if (created?.user) {
        clientId = created.user.id;
      } else if (createErr) {
        // Email already has an auth user (returning visitor) — find them via
        // their profile row, falling back to the admin user list.
        const { data: profile } = await admin
          .from("client_profiles")
          .select("id")
          .eq("email", normalized)
          .maybeSingle();
        if (profile) {
          clientId = profile.id;
        } else {
          const { data: list } = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 });
          clientId = list?.users.find((u) => u.email?.toLowerCase() === normalized)?.id ?? null;
        }
        if (!clientId) {
          return NextResponse.json({ error: "Couldn't set up your booking. Try again." }, { status: 500 });
        }
      }

      await admin
        .from("client_profiles")
        .upsert({ id: clientId, email: normalized, full_name: name ?? null }, { onConflict: "id" });
      clientEmail = normalized;
    } else {
      return NextResponse.json({ error: "Sign in before booking so we can save this to your account." }, { status: 401 });
    }
  }
  // Demo mode (no Supabase) doesn't require an email up front — Stripe
  // Checkout collects it during payment, and a free intro call has no
  // payment step at all to attach it to.

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const serviceClient = createServiceRoleClient();

  // Free intro calls skip Stripe entirely — there's nothing to charge, and a
  // $0 line item isn't something Stripe Checkout will create a session for.
  // The booking goes straight to 'confirmed', same as a paid booking does
  // once the webhook fires, so both paths land in the same state machine.
  if (sessionType.price_cents === 0) {
    let freeBookingId: string | null = null;

    if (serviceClient && clientId) {
      const { data: booking, error } = await serviceClient
        .from("bookings")
        .insert({
          client_id: clientId,
          coach_id: coach.id,
          session_type_id: sessionType.id,
          slot_id: slot.id,
          status: "confirmed",
          starts_at: slot.starts_at,
          ends_at: slot.ends_at,
          price_cents: 0,
        })
        .select("id")
        .single();

      if (error) {
        return NextResponse.json({ error: "Couldn't create the booking. Try again." }, { status: 500 });
      }
      freeBookingId = booking.id;

      const zoom = await createZoomMeeting({
        topic: `Coaching session — ${booking.id}`,
        startTimeIso: slot.starts_at,
        durationMinutes: sessionType.duration_minutes,
      });

      await serviceClient
        .from("bookings")
        .update({
          zoom_join_url: zoom?.joinUrl ?? null,
          zoom_start_url: zoom?.startUrl ?? null,
        })
        .eq("id", freeBookingId);

      await serviceClient.from("availability_slots").update({ is_booked: true }).eq("id", slot.id);
    }

    // Confirmation emails — silent no-ops until RESEND_API_KEY is set.
    // emailSent tells the success page whether it may promise an email.
    let emailSent = false;
    if (clientEmail) {
      const whenText = format(new Date(slot.starts_at), "EEEE, MMMM d 'at' h:mm a");
      const clientMsg = introBookedClientEmail({
        firstName: name?.split(" ")[0] ?? null,
        whenText,
      });
      emailSent = await sendEmail({ to: clientEmail, ...clientMsg });
      const founderMsg = introBookedFounderEmail({ name: name ?? null, email: clientEmail, whenText });
      notifyFounder(founderMsg.subject, founderMsg.html);
    }

    return NextResponse.json({
      url: `${siteUrl}/book/success?free=1${emailSent ? "&mailed=1" : ""}`,
    });
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

  let bookingId: string | null = null;

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
