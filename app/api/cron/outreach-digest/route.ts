import { NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { notifyFounder, outreachFollowUpDigestEmail, genericFollowUpDraft } from "@/lib/email";

// Weekly reminder for the outbound-prospecting pipeline (see supabase/schema.sql
// -> outreach_targets, and app/ops/outreach for the dashboard this table backs).
//
// Triggered by Vercel Cron (see vercel.json — "0 15 * * 1", every Monday
// ~7-8am Pacific depending on DST) via a GET request carrying Vercel's own
// `Authorization: Bearer $CRON_SECRET` header. Runs from Vercel's
// infrastructure, not from a Cowork/Claude session — this keeps firing every
// week whether or not anyone is actively chatting with an assistant that day.
//
// What it does NOT do: send anything to a prospect. This only reads
// outreach_targets, drafts a follow-up per overdue row, and emails Tony
// (NOTIFY_EMAIL) the digest. Every actual send to a prospect still goes out
// from Tony's own inbox, by hand — same boundary as the initial outreach.
//
// Security: verifies the Vercel Cron secret. If CRON_SECRET isn't set, this
// endpoint refuses to run rather than firing unauthenticated — set
// CRON_SECRET in Vercel env vars (Vercel sets the header automatically for
// its own scheduled invocations once the env var exists).
function authorizedCronRequest(request: Request): boolean {
  const expected = process.env.CRON_SECRET;
  if (!expected) return false;
  const header = request.headers.get("authorization");
  return header === `Bearer ${expected}`;
}

export async function GET(request: Request) {
  if (!authorizedCronRequest(request)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Defensive day-of-week check: the vercel.json schedule already targets
  // Mondays only, but if that ever changes (or a manual trigger fires this
  // on another day) this keeps the digest from spamming Tony daily.
  const today = new Date().getDay(); // 0 = Sunday, 1 = Monday
  if (today !== 1) {
    return NextResponse.json({ ok: true, skipped: "Not Monday — no digest sent." });
  }

  const supabase = createServiceRoleClient();
  if (!supabase) {
    // Nothing to query without Supabase configured — no-op, not an error,
    // since this fires unattended and shouldn't page anyone.
    return NextResponse.json({ ok: true, skipped: "Supabase not configured." });
  }

  const { data: overdue, error } = await supabase
    .from("outreach_targets")
    .select("id, organization, contact_name, contact_email, sent_at")
    .eq("status", "sent")
    .lte("follow_up_due_at", new Date().toISOString())
    .is("follow_up_sent_at", null);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const rows = (overdue ?? []).map((o) => {
    const firstName = o.contact_name ? o.contact_name.split(" ")[0] : null;
    return {
      organization: o.organization as string,
      contactName: (o.contact_name as string) ?? null,
      contactEmail: (o.contact_email as string) ?? null,
      sentAt: (o.sent_at as string) ?? null,
      followUpDraft: genericFollowUpDraft(o.organization as string, firstName),
    };
  });

  const digest = outreachFollowUpDigestEmail({ overdue: rows });
  notifyFounder(digest.subject, digest.html);

  return NextResponse.json({ ok: true, overdueCount: rows.length });
}
