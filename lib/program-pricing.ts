/**
 * The Annual Program — firm-tier pricing.
 *
 * Decided July 2026: firm annual tiers, not ranges. A range invites a buyer
 * to anchor on the low number; a firm tier is the number for their size,
 * full stop. See onepager/the-program.md §3 for the source of truth this
 * mirrors — keep both in sync if a tier ever changes.
 */

export type TierResult =
  | {
      soft: false;
      isPilot?: boolean;
      price: number;
      label: string;
      pool: number;
      clinics: string;
      locations: number;
      reporting: string;
      comms: string;
      note: string;
    }
  | {
      soft: true;
      band: string;
      note: string;
    };

export function priceForHeadcount(n: number): TierResult {
  if (n < 50) {
    return {
      soft: true,
      band: "Let's talk first",
      note:
        "Under 50 people, the Annual Program likely isn't the right shape yet. Reach out anyway — we'll tell you honestly whether we can help, or point you toward the pilot instead.",
    };
  }
  if (n < 100) {
    return {
      soft: false,
      isPilot: true,
      price: 9500,
      label: "Founding Partner Pilot · 90 days",
      pool: 25,
      clinics: "1",
      locations: 1,
      reporting: "Day 45 & 90",
      comms: "—",
      note:
        "At this size, most teams start with the 90-day pilot rather than the full annual program. $5,000 of it credits toward your first year if you continue within 30 days. ($12,000 for a larger team or a second location.)",
    };
  }
  if (n <= 100) {
    return {
      soft: false,
      price: 18000,
      label: "Annual Program — Starter",
      pool: 25,
      clinics: "4/yr",
      locations: 1,
      reporting: "Quarterly",
      comms: "2/yr",
      note: "",
    };
  }
  if (n <= 200) {
    return {
      soft: false,
      price: 24000,
      label: "Annual Program — Core",
      pool: 50,
      clinics: "4/yr",
      locations: 1,
      reporting: "Quarterly",
      comms: "2/yr",
      note: "",
    };
  }
  if (n <= 350) {
    return {
      soft: false,
      price: 32000,
      label: "Annual Program — Growth",
      pool: 88,
      clinics: "4/yr",
      locations: 2,
      reporting: "Quarterly",
      comms: "4/yr",
      note: "",
    };
  }
  if (n <= 500) {
    return {
      soft: false,
      price: 40000,
      label: "Annual Program — Scale",
      pool: 125,
      clinics: "4/yr",
      locations: 3,
      reporting: "Quarterly",
      comms: "4/yr",
      note: "",
    };
  }
  if (n <= 1000) {
    return {
      soft: true,
      band: "Custom — Enterprise tier",
      note:
        "Programs above 500 people are scoped together, not banded — usually starting above $40,000/year depending on shifts, locations, and rollout logistics.",
    };
  }
  return {
    soft: true,
    band: "Let's talk directly",
    note:
      "That's above the size we're built for right now. Reach out anyway — we'll tell you honestly whether we're a fit or point you somewhere better.",
  };
}

/** For the ROI calculator: an annualized program cost estimate at a given
 * headcount, using the real tier table instead of a flat per-employee rate.
 * Falls back to the Scale tier's effective per-head rate for anything the
 * tier table treats as "custom" (500+), so the calculator still returns a
 * number rather than breaking above 500 employees. */
export function estimatedAnnualProgramCost(employees: number): number {
  const r = priceForHeadcount(employees);
  if (!r.soft) return r.price;
  if (employees > 500) {
    const scaleRate = 40000 / 500;
    return Math.round(employees * scaleRate);
  }
  // Under 50 — use the pilot price as the estimate (annualized pilots aren't
  // really "annual," but this keeps the calculator from showing $0).
  return 9500;
}
