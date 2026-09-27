import { NextRequest, NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createServiceRoleClient } from "@/lib/supabase/server";
import {
  employerInquiryFounderEmail,
  employerInquiryConfirmationEmail,
  notifyFounder,
  sendEmail,
  isEmailConfigured,
} from "@/lib/email";
import { isRateLimited, getClientIp } from "@/lib/rate-limit";

// Bot floor (Sept 2026): this endpoint was getting hit directly with
// scripted junk in every field ("New employer inquiry: Hxkghwx LLC" —
// random strings, throwaway email). Three independent, silent layers —
// each alone is beatable, together they knock out the unsophisticated
// bots actually hitting this form:
//   1. Honeypot field ("website") — real users never see or fill it
//      (visually hidden + aria-hidden + tabIndex -1); a browser-automation
//      bot that fills every input on the page fills it too.
//   2. Time trap — real people take more than a couple seconds to read
//      four fields and type; the client sends elapsed ms since the form
//      mounted (formLoadedAt) and anything under MIN_FILL_MS is rejected.
//   3. Per-IP rate limit — no legitimate visitor submits this form more
//      than a few times an hour.
// All three fail *silently* with { ok: true } and no persistence, no
// email — never tell an attacker which check tripped, and never let a
// bot's blocked submission still cost Tony an inbox notification.
const MIN_FILL_MS = 1500;

/**
 * POST /api/employer-inquiry
 * The primary conversion point for the annual-program business — every
 * "Talk to us" button on the site posts here. Two jobs, both best-effort
 * and independent of each other so a Supabase hiccup never eats an email
 * and vice versa:
 *   1. Persist the inquiry (Supabase if configured, else log it — see
 *      lib/supabase/config.ts's isSupabaseConfigured pattern, same one
 *      /api/leads uses).
 *   2. Notify Tony immediately, and confirm to the sender, via Resend
 *      (see lib/email.ts — both are silent no-ops if RESEND_API_KEY
 *      isn't set, by design; this route never claims an email sent
 *      unless it actually did).
 *
 * In demo mode (no Supabase, no Resend) this still returns { ok: true } —
 * the submission isn't lost, it's just visible only in Vercel's function
 * logs until real infra is wired in. That's a deliberate floor, not a bug:
 * see the note in lib/email.ts about promising sends that never happened.
 */

type InquiryPayload = {
  name?: string;
  company?: string;
  email: string;
  teamSize?: string;
  message?: string;
  /** Honeypot — must arrive empty. Any value means it's a bot. */
  website?: string;
  /** ms since the form mounted, per Date.now() on the client. */
  formLoadedAt?: number;
};

const demoInquiries: InquiryPayload[] = [];

function isValidEmail(email: unknown): email is string {
  return typeof email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req: NextRequest) {
  let body: InquiryPayload;
  try {
    body = (await req.json()) as InquiryPayload;
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  // --- Bot floor: fail silently, never reveal which check tripped ---
  if (body.website && body.website.trim() !== "") {
    return NextResponse.json({ ok: true });
  }
  if (
    typeof body.formLoadedAt === "number" &&
    Date.now() - body.formLoadedAt < MIN_FILL_MS
  ) {
    return NextResponse.json({ ok: true });
  }
  if (isRateLimited(`employer-inquiry:${getClientIp(req)}`)) {
    return NextResponse.json({ ok: true });
  }

  if (!isValidEmail(body.email)) {
    return NextResponse.json(
      { error: "Valid email required" },
      { status: 400 }
    );
  }
  if (!body.company || !body.company.trim()) {
    return NextResponse.json(
      { error: "Company name required" },
      { status: 400 }
    );
  }

  const clean: InquiryPayload = {
    name: body.name?.trim() || undefined,
    company: body.company.trim(),
    email: body.email.toLowerCase().trim(),
    teamSize: body.teamSize?.trim() || undefined,
    message: body.message?.trim() || undefined,
  };

  // --- 1. Persist ---
  let persisted = false;
  if (isSupabaseConfigured) {
    const supabase = createServiceRoleClient();
    if (supabase) {
      const { error } = await supabase.from("employer_inquiries").insert({
        name: clean.name ?? null,
        company: clean.company,
        email: clean.email,
        team_size: clean.teamSize ?? null,
        message: clean.message ?? null,
      });
      if (error) {
        console.error("employer_inquiries insert error:", error);
      } else {
        persisted = true;
      }
    }
  }
  if (!persisted) {
    demoInquiries.push(clean);
    console.log(
      `[demo] Employer inquiry captured: ${clean.company} · ${clean.email}` +
        (isSupabaseConfigured ? " (Supabase insert failed — see error above)" : " (Supabase not configured)")
    );
  }

  // --- 2. Notify + confirm (independent of persistence outcome) ---
  if (isEmailConfigured) {
    const founderNote = employerInquiryFounderEmail({
      name: clean.name ?? null,
      company: clean.company ?? null,
      email: clean.email,
      teamSize: clean.teamSize ?? null,
      message: clean.message ?? null,
    });
    // replyTo is what makes the email's "just reply to this" line true —
    // without it, Tony's reply would go to onboarding@resend.dev, not them.
    notifyFounder(founderNote.subject, founderNote.html, clean.email);

    const confirmation = employerInquiryConfirmationEmail({
      name: clean.name ?? null,
      company: clean.company ?? null,
    });
    void sendEmail({
      to: clean.email,
      subject: confirmation.subject,
      html: confirmation.html,
    });
  } else {
    console.log(
      `[demo] Would have emailed Tony + confirmed to ${clean.email} — RESEND_API_KEY not set`
    );
  }

  return NextResponse.json({ ok: true });
}
