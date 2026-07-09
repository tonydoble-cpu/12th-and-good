// Demo-mode fallback data.
//
// The app works fully without Supabase/Stripe/Zoom credentials configured —
// it renders against this fixture data instead, so the POC is reviewable
// the moment `npm run dev` runs. Real data takes over automatically once
// the env vars in .env.example are set (see lib/supabase/*.ts).

import type { AvailabilitySlot, Coach, SessionType } from "./types";

export const DEMO_COACH: Coach = {
  id: "demo-coach-tony",
  slug: "tony",
  full_name: "Tony Doble",
  headline: "Fee-only financial coach. Nothing to sell, ever.",
  bio: "I help people build a budget that actually works, get out from under debt, and make a plan they can stick to. I don't sell investments, insurance, or any financial product — I'm not allowed to and I don't want to. My only job in the room is to help you see your money clearly and decide what to do next.",
  credentials: [
    "10+ years advising individuals and small business owners",
    "Fee-only — paid only by you, never by commission",
    "Fiduciary coaching standard: your interest, not a product's",
  ],
  video_intro_url: null,
  photo_url: null,
};

export const DEMO_SESSION_TYPES: SessionType[] = [
  {
    id: "session-intro",
    coach_id: DEMO_COACH.id,
    name: "First Session: Get Clear",
    description:
      "We look at everything together — income, bills, debt, savings — and build one page you can actually understand. You leave knowing exactly where you stand.",
    duration_minutes: 45,
    price_cents: 9500,
    active: true,
  },
  {
    id: "session-plan",
    coach_id: DEMO_COACH.id,
    name: "Build the Plan",
    description:
      "For after your first session. We turn what we found into a concrete plan: what to pay down first, what to save, what to automate.",
    duration_minutes: 45,
    price_cents: 9500,
    active: true,
  },
  {
    id: "session-checkin",
    coach_id: DEMO_COACH.id,
    name: "Check-In Session",
    description:
      "A shorter follow-up to review progress, adjust the plan, and answer whatever's come up since we last talked.",
    duration_minutes: 25,
    price_cents: 6000,
    active: true,
  },
];

function isoAtHourOnFutureDay(daysFromNow: number, hour: number): string {
  // Deterministic-enough demo slots; not used for any real scheduling logic.
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  d.setHours(hour, 0, 0, 0);
  return d.toISOString();
}

export const DEMO_AVAILABILITY: AvailabilitySlot[] = [
  { id: "slot-1", coach_id: DEMO_COACH.id, starts_at: isoAtHourOnFutureDay(1, 9), ends_at: isoAtHourOnFutureDay(1, 10), is_booked: false },
  { id: "slot-2", coach_id: DEMO_COACH.id, starts_at: isoAtHourOnFutureDay(1, 14), ends_at: isoAtHourOnFutureDay(1, 15), is_booked: false },
  { id: "slot-3", coach_id: DEMO_COACH.id, starts_at: isoAtHourOnFutureDay(2, 11), ends_at: isoAtHourOnFutureDay(2, 12), is_booked: false },
  { id: "slot-4", coach_id: DEMO_COACH.id, starts_at: isoAtHourOnFutureDay(3, 9), ends_at: isoAtHourOnFutureDay(3, 10), is_booked: false },
  { id: "slot-5", coach_id: DEMO_COACH.id, starts_at: isoAtHourOnFutureDay(3, 16), ends_at: isoAtHourOnFutureDay(3, 17), is_booked: false },
  { id: "slot-6", coach_id: DEMO_COACH.id, starts_at: isoAtHourOnFutureDay(5, 10), ends_at: isoAtHourOnFutureDay(5, 11), is_booked: false },
];
