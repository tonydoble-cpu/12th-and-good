/**
 * Minimal in-memory rate limiter for public POST endpoints (employer
 * inquiry, leads). Not distributed — each Vercel serverless instance
 * keeps its own counters — but that's fine here: the goal is knocking
 * down scripted bot floods hitting a single instance repeatedly, not
 * building a precise global limiter. Cheap, no new infra, no env vars.
 *
 * If this ever needs to be exact across instances, swap the Map for
 * Supabase or Vercel KV — same isRateLimited(key) signature.
 */

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

// Periodic cleanup so this Map never grows unbounded on a long-lived
// instance — cheap, runs on access rather than a timer.
function sweep(now: number) {
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }
}

/**
 * Returns true if `key` (typically an IP address, optionally namespaced
 * per-route) has exceeded `limit` requests within `windowMs`.
 */
export function isRateLimited(
  key: string,
  limit = 5,
  windowMs = 60 * 60 * 1000 // 5 requests/hour by default
): boolean {
  const now = Date.now();
  if (buckets.size > 500) sweep(now);

  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return false;
  }

  bucket.count += 1;
  return bucket.count > limit;
}

/** Best-effort client IP from the headers Vercel/Next set on the edge. */
export function getClientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}
