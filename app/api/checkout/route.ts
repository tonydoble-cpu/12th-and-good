import { NextResponse } from "next/server";
import { z } from "zod";
import { format } from "date-fns";
import { getAvailabilitySlotById, getCoachBySlug, getSessionTypeById } from "@/lib/coach-data";
import { createClient, createServiceRoleClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getStripe, isStripeConfigured } from "@/lib/stripe";
import { createZoomMeeting } from "@/lib/zoom";
import {
  sessionBookedClientEmail,
  sessionBookedFounderEmail,
  notifyFounder,
  sendEmail,
} from "@/lib/email";

const bodySchema = z.object({
  sessionTypeId: z.string().min(1),
  slotId: z.string().min(1),
  name: z.string().optional(),
  email: z.string().email().optional(),
  // The write-up: required by the UI for every booking. Tony walks into
  // each session already knowing what it's for.
  intakeGoal: z.string().max(2000).optional(),
  intakeWin: z.string().max(1000).optional(),
});

/**
 * Books a session. Design rules (persona-audit + founder direction, July 2026):
 *  - NO account wall, ever. Guests book with name + email; we create a
 *    passwordless auth user server-side to satisfy the schema.
 *  - Every booking carries an intake write-up -> coach_notes, so the coach
 *    (and the AI prep pass) knows the agenda before the call.
 *  - Stripe configured: paid sessions go through Checkout as designed.
 *    Stripe NOT configured (founding phase): "reserve mode" — the booking is
 *    created as pending_payment, the slot holds, and the client is told a
 *    secure payment link arrives before the session. The UI must say this
 *    plainly; no surprise invoices.
 */
export async function POST(request: Request) {
  const json = await request.json().catch(() => null);
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Missing or invalid booking details." }, { status: 400 });
  }
  const { sessionTypeId, slotId, name, email, intakeGoal, intakeWin } = parsed.data;

  const coach = await getCoachBySlug("tony");
  const sessionType = await getSessionTypeById(sessionTypeId);
  const slot = await getAvailabilitySlotById(slotId);

  if (!coach || !sessionType || !slot) {
    return NextResponse.json({ error: "That session or time isn't available anymore." }, { status: 404 });
  }
  if (slot.is_booked) {
    return NextResponse.json({ error: "That time was just booked by someone else. Pick another." }, { status: 409 });
  }

  // ---- Resolve who's booking (signed-in user OR guest by email) ----
  let clientId: string | null = null;
  let clientEmail = email ?? null;

  if (isSupabaseConfigured) {
    const supabase = await createClient();
    const { data } = (await supabase?.auth.getUser()) ?? { data: { user: null } };

    if (data.user) {
      clientId = data.user.id;
      clientEmail = data.user.email ?? clientEmail;
      await supabase!
        .from("client_profiles")
        .upsert({ id: data.user.id, email: data.user.email, full_name: name }, { onConflict: "id" });
    } else {
      if (!clientEmail) {
        return NextResponse.json(
          { error: "Add your email so we can confirm your session." },
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
        user_metadata: { full_name: name ?? null, source: "guest_booking" },
      });

      if (created?.user) {
        clientId = created.user.id;
      } else if (createErr) {
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
    }
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const serviceClient = createServiceRoleClient();
  const whenText = format(new Date(slot.starts_at), "EEEE, MMMM d 'at' h:mm a");

  // Intake -> coach_notes. NOTE: coach_notes is shown back to the client on
  // their session page as "notes", so only the client's own words go here —
  // never private coach-side commentary.
  const intakeNote = [
    `WHAT YOU TOLD US AT BOOKING`,
    intakeGoal ? `Working on: ${intakeGoal.trim()}` : null,
    intakeWin ? `A win would be: ${intakeWin.trim()}` : null,
  ]
    .filter(Boolean)
    .join("\n");

  const isFree = sessionType.price_cents === 0;
  const reserveMode = !isFree && !isStripeConfigured;

  // ---- Create the booking row ----
  let bookingId: string | null = null;
  if (serviceClient && clientId) {
    const { data: booking, error } = await serviceClient
      .from("bookings")
      .insert({
        client_id: clientId,
        coach_id: coach.id,
        session_type_id: sessionType.id,
        slot_id: slot.id,
        status: isFree ? "confirmed" : "pending_payment",
        starts_at: slot.starts_at,
        ends_at: slot.ends_at,
        price_cents: sessionType.price_cents,
        coach_notes: intakeNote || null,
      })
      .select("id")
      .single();

    if (error) {
      return NextResponse.json({ error: "Couldn't create the booking. Try again." }, { status: 500 });
    }
    bookingId = booking.id;
  }

  // ---- FREE session (legacy path; free intro is retired but harmless) ----
  if (isFree) {
    if (serviceClient && bookingId) {
      const zoom = await createZoomMeeting({
        topic: `Coaching session — ${bookingId}`,
        startTimeIso: slot.starts_at,
        durationMinutes: sessionType.duration_minutes,
      });
      await serviceClient
        .from("bookings")
        .update({ zoom_join_url: zoom?.joinUrl ?? null, zoom_start_url: zoom?.startUrl ?? null })
        .eq("id", bookingId);
      await serviceClient.from("availability_slots").update({ is_booked: true }).eq("id", slot.id);
    }
    let emailSent = false;
    if (clientEmail) {
      const msg = sessionBookedClientEmail({
        firstName: name?.split(" ")[0] ?? null,
        whenText,
        sessionName: sessionType.name,
        reserveMode: false,
        priceText: "Free",
      });
      emailSent = await sendEmail({ to: clientEmail, ...msg });
      const f = sessionBookedFounderEmail({
        name: name ?? null,
        email: clientEmail,
        whenText,
        sessionName: sessionType.name,
        intake: intakeNote || null,
        reserveMode: false,
      });
      notifyFounder(f.subject, f.html);
    }
    return NextResponse.json({
      url: `${siteUrl}/book/success?free=1${emailSent ? "&mailed=1" : ""}`,
    });
  }

  // ---- RESERVE MODE: paid session, Stripe not yet live ----
  if (reserveMode) {
    if (serviceClient && bookingId) {
      await serviceClient.from("availability_slots").update({ is_booked: true }).eq("id", slot.id);
    }
    let emailSent = false;
    if (clientEmail) {
      const msg = sessionBookedClientEmail({
        firstName: name?.split(" ")[0] ?? null,
        whenText,
        sessionName: sessionType.name,
        reserveMode: true,
        priceText: `$${(sessionType.price_cents / 100).toFixed(0)}`,
      });
      emailSent = await sendEmail({ to: clientEmail, ...msg });
      const f = sessionBookedFounderEmail({
        name: name ?? null,
        email: clientEmail,
        whenText,
        sessionName: sessionType.name,
        intake: intakeNote || null,
        reserveMode: true,
      });
      notifyFounder(f.subject, f.html);
    }
    return NextResponse.json({
      url: `${siteUrl}/book/success?reserved=1${emailSent ? "&mailed=1" : ""}`,
    });
  }

  // ---- STRIPE checkout (paid, live) ----
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
