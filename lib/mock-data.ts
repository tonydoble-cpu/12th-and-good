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
  headline:
    "I'm the first coach on 12th & Good Street, taking these early calls myself. Plain-English, fee-only coaching — no product behind me, no pitch inside the session.",
  bio:
    "I'm here because I think getting honest help with money shouldn't be this hard. There's no product I'm selling and no commission I'm earning — the session is the whole thing. Whatever you're working through, we'll talk about it the way two people would.\n\nWe'll start wherever you actually are. You bring the real numbers and the real questions; I'll bring a clear head and a plan you can act on the same week. If something is outside what I know, I'll say so.",
  credentials: [
    "10+ years advising individuals and small business owners",
    "Fee-only — paid by you, not by commission or product sales",
    "Fiduciary standard — advice is in your interest, period",
  ],
  specialties: [
    "Budgeting & cash flow",
    "Debt paydown strategies",
    "First-time home buying",
    "Investing basics",
    "Understanding 401(k)s",
  ],
  founding: true,
  video_intro_url: null,
  photo_url: "/tony-doble.png",
};

export const DEMO_SESSION_TYPES: SessionType[] = [
  {
    id: "session-free-intro",
    coach_id: DEMO_COACH.id,
    name: "Free intro call",
    description:
      "A quick hello to see if we're the right fit. No plan yet — just a conversation to figure out if this makes sense.",
    duration_minutes: 20,
    price_cents: 0,
    active: true,
  },
  {
    id: "session-single",
    coach_id: DEMO_COACH.id,
    name: "Single session",
    description:
      "One focused conversation on whatever's on your mind, with a written plan and next steps afterward.",
    duration_minutes: 60,
    price_cents: 15000,
    active: true,
  },
  {
    id: "session-action-plan",
    coach_id: DEMO_COACH.id,
    name: "3-session action plan",
    description:
      "Three sessions over a month — enough time to make a plan, start on it, and check in on how it's going.",
    duration_minutes: 180,
    price_cents: 42000,
    active: true,
  },
];

function isoAtHourOnFutureDay(
  daysFromNow: number,
  hour: number,
  minute = 0
): string {
  // Deterministic-enough demo slots; not used for any real scheduling logic.
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
}

// Four upcoming weekdays x four times each, mirroring the design's
// day-chip / time-chip booking card (9:00 / 11:30 / 2:00 / 4:30).
const DEMO_TIME_SLOTS: Array<[hour: number, minute: number]> = [
  [9, 0],
  [11, 30],
  [14, 0],
  [16, 30],
];

export const DEMO_AVAILABILITY: AvailabilitySlot[] = [1, 2, 3, 4].flatMap(
  (daysFromNow, dayIndex) =>
    DEMO_TIME_SLOTS.map(([hour, minute], timeIndex) => {
      const startsAt = isoAtHourOnFutureDay(daysFromNow, hour, minute);
      const endsAtDate = new Date(startsAt);
      endsAtDate.setMinutes(endsAtDate.getMinutes() + 60);
      return {
        id: `slot-${dayIndex}-${timeIndex}`,
        coach_id: DEMO_COACH.id,
        starts_at: startsAt,
        ends_at: endsAtDate.toISOString(),
        is_booked: false,
      };
    })
);
