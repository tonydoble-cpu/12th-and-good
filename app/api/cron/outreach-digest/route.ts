import { NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";
import {
  notifyFounder,
  outreachFollowUpDigestEmail,
  sendQueueDigestEmail,
  genericFollowUpDraft,
} from "@/lib/email";

// Daily outbound-prospecting digest (see supabase/schema.sql ->
// outreach_targets, and app/ops/outreach for the dashboard this table
// backs). Two jobs in one email:
//
//   1. Send queue — the next BATCH_SIZE not-yet-sent targets, oldest first,
//      fully drafted, so Tony never has to open the dashboard just to find
//      out what's next. This is the actual fix for "I haven't had time to
//      send any of these" — the friction wasn't the writing, it was
//      remembering to go look.
//   2. Follow-ups — targets sent 5+ business days ago with no reply logged.
//
// Triggered by Vercel Cron (see vercel.json — "0 15 * * 1-5", every weekday
// ~7-8am Pacific depending on DST) via a GET request carrying Vercel's own
// `Authorization: Bearer $CRON_SECRET` header. Runs from Vercel's
// infrastructure, not from a Cowork/Claude session — this keeps firing
// every weekday whether or not anyone is actively chatting with an
// assistant that day.
//
// What it does NOT do: send anything to a prospect. This only reads
// outreach_targets and emails Tony (NOTIFY_EMAIL) what to send today. Every
// actual send to a prospect still goes out from Tony's own inbox, by hand —
// same boundary as the initial outreach, and deliberate: cold outreach sent
// from a personal inbox one at a time protects deliverability and matches
// the "no conflict of interest, this is really me" positioning the whole
// campaign is built on. Auto-sending would undercut both.
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

// Matches the pace in prospecting/sending-schedule.md — ~4/day keeps this
// reading as personal outreach, not a blast. Change here if the target pace
// ever changes; nothing else needs to know about it.
const BATCH_SIZE = 4;

const OPS_URL = `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://12thandgood.com"}/ops/outreach`;

export async function GET(request: Request) {
  if (!authorizedCronRequest(request)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Defensive weekday check: the vercel.json schedule already targets
  // Mon-Fri only, but if that ever changes (or a manual trigger fires this
  // on a weekend) this keeps the digest from landing on a Saturday.
  const today = new Date().getDay(); // 0 = Sunday, 6 = Saturday
  if (today === 0 || today === 6) {
    return NextResponse.json({ ok: true, skipped: "Weekend — no digest sent." });
  }

  const supabase = createServiceRoleClient();
  if (!supabase) {
    // Nothing to query without Supabase configured — no-op, not an error,
    // since this fires unattended and shouldn't page anyone.
    return NextResponse.json({ ok: true, skipped: "Supabase not configured." });
  }

  // ---- 1. Today's send queue: oldest ready targets first ----
  const { data: queueRows, error: queueError } = await supabase
    .from("outreach_targets")
    .select("id, organization, contact_name, contact_email, draft_email")
    .eq("status", "researched")
    .not("draft_email", "is", null)
    .order("created_at", { ascending: true })
    .limit(BATCH_SIZE);

  if (queueError) {
    return NextResponse.json({ error: queueError.message }, { status: 500 });
  }

  // ---- Held-for-verification callout (not counted toward the batch) ----
  const { data: heldRows, error: heldError } = await supabase
    .from("outreach_targets")
    .select("organization, notes")
    .eq("status", "needs_verification")
    .order("organization", { ascending: true });

  if (heldError) {
    return NextResponse.json({ error: heldError.message }, { status: 500 });
  }

  // ---- 2. Follow-ups due on already-sent targets ----
  const { data: overdue, error: overdueError } = await supabase
    .from("outreach_targets")
    .select("id, organization, contact_name, contact_email, sent_at")
    .eq("status", "sent")
    .lte("follow_up_due_at", new Date().toISOString())
    .is("follow_up_sent_at", null);

  if (overdueError) {
    return NextResponse.json({ error: overdueError.message }, { status: 500 });
  }

  const queue = (queueRows ?? []).map((t) => ({
    id: t.id as string,
    organization: t.organization as string,
    contactName: (t.contact_name as string) ?? null,
    contactEmail: (t.contact_email as string) ?? null,
    draftEmail: t.draft_email as string,
  }));

  const held = (heldRows ?? []).map((h) => ({
    organization: h.organization as string,
    notes: (h.notes as string) ?? null,
  }));

  const overdueRows = (overdue ?? []).map((o) => {
    const firstName = o.contact_name ? o.contact_name.split(" ")[0] : null;
    return {
      organization: o.organization as string,
      contactName: (o.contact_name as string) ?? null,
      contactEmail: (o.contact_email as string) ?? null,
      sentAt: (o.sent_at as string) ?? null,
      followUpDraft: genericFollowUpDraft(o.organization as string, firstName),
    };
  });

  // Nothing to do today — everything's sent and nothing's overdue. Skip
  // rather than send an empty-feeling email every weekday forever.
  if (queue.length === 0 && overdueRows.length === 0) {
    return NextResponse.json({ ok: true, skipped: "Nothing queued and nothing overdue." });
  }

  if (queue.length > 0) {
    const digest = sendQueueDigestEmail({ queue, heldForVerification: held, opsUrl: OPS_URL });
    notifyFounder(digest.subject, digest.html);
  }

  if (overdueRows.length > 0) {
    const followUp = outreachFollowUpDigestEmail({ overdue: overdueRows });
    notifyFounder(followUp.subject, followUp.html);
  }

  return NextResponse.json({
    ok: true,
    queued: queue.length,
    heldForVerification: held.length,
    overdueCount: overdueRows.length,
  });
}
