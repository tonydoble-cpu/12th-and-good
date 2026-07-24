import type { SessionType } from "./types";

/** Cheapest non-free session price, for "From $X / session" card copy. */
export function cheapestPaidPrice(sessionTypes: SessionType[]): number {
  const paid = sessionTypes.filter((s) => s.price_cents > 0);
  if (paid.length === 0) return 0;
  return Math.min(...paid.map((s) => s.price_cents));
}
