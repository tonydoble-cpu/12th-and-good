import { NextRequest, NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createServiceRoleClient } from "@/lib/supabase/server";

/**
 * POST /api/question-view — instrumentation for the 401(k) Q&A tool
 * (funnel build brief §3). Every row is a signal: after 60–90 days this
 * is the raw material for the HR dashboard product and the SEO/content
 * strategy. No PII: slug + referrer + a random per-session id only.
 *
 * Demo mode (no Supabase): logs to the function console so nothing is
 * silently swallowed during development.
 */

type ViewPayload = {
  slug?: string;
  referrer?: string | null;
  sessionId?: string | null;
};

export async function POST(req: NextRequest) {
  let body: ViewPayload;
  try {
    body = (await req.json()) as ViewPayload;
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const slug = typeof body.slug === "string" ? body.slug.slice(0, 200) : null;
  if (!slug) {
    return NextResponse.json({ error: "slug required" }, { status: 400 });
  }
  const referrer =
    typeof body.referrer === "string" ? body.referrer.slice(0, 500) : null;
  const sessionId =
    typeof body.sessionId === "string" ? body.sessionId.slice(0, 64) : null;

  if (isSupabaseConfigured) {
    const supabase = createServiceRoleClient();
    if (supabase) {
      const { error } = await supabase.from("question_views").insert({
        question_slug: slug,
        referrer,
        session_id: sessionId,
      });
      if (error) console.error("question_views insert error:", error);
      return NextResponse.json({ ok: true });
    }
  }

  console.log(`[demo] question view: ${slug} (referrer: ${referrer ?? "—"})`);
  return NextResponse.json({ ok: true });
}
