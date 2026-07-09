import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { createZoomMeeting } from "@/lib/zoom";

/**
 * This is where "own the transaction from day one" actually gets enforced.
 * A booking only ever becomes 'confirmed' here, after Stripe tells us the
 * charge succeeded — never from anything the browser claims.
 *
 * Local dev: `stripe listen --forward-to localhost:3000/api/webhook/stripe`
 */
export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    return NextResponse.json({ error: "Webhook not configured." }, { status: 400 });
  }

  const rawBody = await request.text();
  let event: Stripe.Event;

  try {
    event = getStripe().webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    console.error("Stripe webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const bookingId = session.metadata?.booking_id;
    const slotId = session.metadata?.slot_id;

    if (!bookingId) {
      // No booking row to reconcile against (e.g. demo-mode checkout with
      // no Supabase configured). Nothing further to do.
      return NextResponse.json({ received: true });
    }

    const supabase = createServiceRoleClient();
    if (!supabase) {
      console.error("Webhook received but service role client isn't configured.");
      return NextResponse.json({ received: true });
    }

    const { data: booking } = await supabase
      .from("bookings")
      .select("*")
      .eq("id", bookingId)
      .single();

    if (!booking) {
      console.error(`Webhook: booking ${bookingId} not found.`);
      return NextResponse.json({ received: true });
    }

    // Best-effort Zoom meeting. Confirmation must not depend on this.
    const zoom = await createZoomMeeting({
      topic: `Coaching session — ${booking.id}`,
      startTimeIso: booking.starts_at,
      durationMinutes: Math.round(
        (new Date(booking.ends_at).getTime() - new Date(booking.starts_at).getTime()) / 60000
      ),
    });

    await supabase
      .from("bookings")
      .update({
        status: "confirmed",
        stripe_payment_intent_id:
          typeof session.payment_intent === "string" ? session.payment_intent : null,
        zoom_join_url: zoom?.joinUrl ?? null,
        zoom_start_url: zoom?.startUrl ?? null,
      })
      .eq("id", bookingId);

    if (slotId) {
      await supabase.from("availability_slots").update({ is_booked: true }).eq("id", slotId);
    }
  }

  return NextResponse.json({ received: true });
}
