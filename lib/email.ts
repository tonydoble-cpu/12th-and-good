// Transactional email via Resend's REST API — deliberately dependency-free.
//
// DARK BY DEFAULT: without RESEND_API_KEY in the environment, every send is
// a silent no-op that returns false. UI copy that promises an email must
// check the return value (or isEmailConfigured) and only make the promise
// when it's true. We got burned once by promising an email that never
// sent — never again.
//
// To go live (5 minutes):
//   1. resend.com → create account → verify the 12thandgood.com domain
//      (two DNS records at GoDaddy).
//   2. Create an API key → add RESEND_API_KEY in Vercel env vars.
//   3. Optionally set EMAIL_FROM ("12th & Good Street <hello@12thandgood.com>").
//   4. Redeploy.

export const isEmailConfigured = Boolean(process.env.RESEND_API_KEY);

const FROM =
  process.env.EMAIL_FROM ?? "12th & Good Street <onboarding@resend.dev>";

// Where operational notifications (new booking, new waitlist join) go.
const NOTIFY_TO = process.env.NOTIFY_EMAIL ?? "tonydoble@gmail.com";

type Attachment = {
  filename: string;
  /** Base64-encoded file content — Resend's attachment format. */
  content: string;
};

type SendArgs = {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
  attachments?: Attachment[];
};

export async function sendEmail({
  to,
  subject,
  html,
  replyTo,
  attachments,
}: SendArgs): Promise<boolean> {
  if (!isEmailConfigured) return false;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM,
        to: [to],
        subject,
        html,
        ...(replyTo ? { reply_to: replyTo } : {}),
        ...(attachments && attachments.length ? { attachments } : {}),
      }),
    });
    if (!res.ok) {
      console.error("Resend error:", res.status, await res.text());
      return false;
    }
    return true;
  } catch (err) {
    console.error("Resend threw:", err);
    return false;
  }
}

/** Fire-and-forget note to the founder. Never blocks the caller's response.
 * Pass replyTo when the notification promises "just reply to this email" —
 * e.g. employerInquiryFounderEmail's copy claims exactly that, so its caller
 * must pass the submitter's address here or the promise is a lie. */
export function notifyFounder(subject: string, html: string, replyTo?: string) {
  if (!isEmailConfigured) return;
  void sendEmail({ to: NOTIFY_TO, subject, html, replyTo });
}

// ---------------------------------------------------------------------------
// Templates — plain, warm, no tracking pixels, no images.
// ---------------------------------------------------------------------------

export function sessionBookedClientEmail(opts: {
  firstName: string | null;
  whenText: string;
  sessionName: string;
  reserveMode: boolean;
  priceText: string;
}) {
  const name = opts.firstName ? `Hi ${opts.firstName}` : "Hi";
  const payLine = opts.reserveMode
    ? `<p><b>Payment:</b> nothing was charged today. Tony will send you a secure
payment link (${opts.priceText}) before the session — your spot is held in
the meantime.</p>`
    : "";
  return {
    subject: `Your session with Tony is booked — ${opts.whenText}`,
    html: `
<p>${name},</p>
<p>Your <b>${opts.sessionName}</b> is booked for <b>${opts.whenText}</b>.</p>
<p>Tony read what you wrote when you booked — he'll come prepared for
exactly that. The video link arrives from this address before the call.</p>
${payLine}
<p>One promise, in writing: if your first session isn't worth every dollar,
say so and you don't pay.</p>
<p>— 12th &amp; Good Street</p>
<p style="color:#888;font-size:12px">Need to reschedule? Just reply to this email.</p>`,
  };
}

export function sessionBookedFounderEmail(opts: {
  name: string | null;
  email: string;
  whenText: string;
  sessionName: string;
  intake: string | null;
  reserveMode: boolean;
}) {
  return {
    subject: `New booking: ${opts.sessionName} — ${opts.whenText}`,
    html: `
<p><b>${opts.name ?? "(no name given)"}</b> · ${opts.email}<br/>
<b>${opts.sessionName}</b> · <b>${opts.whenText}</b></p>
${opts.intake ? `<p><b>Their write-up:</b><br/>${opts.intake.replace(/\n/g, "<br/>")}</p>` : ""}
${
  opts.reserveMode
    ? "<p><b>To do:</b> send their payment link, then the video link before the call.</p>"
    : "<p><b>To do:</b> send the video link before the call.</p>"
}
<p>Your AI prep brief for this session will follow.</p>`,
  };
}

/** Notifies Tony the moment an employer submits the /employers contact form.
 * This is the top of the entire B2B sales funnel — send it plainly, with
 * everything needed to reply without opening a dashboard. */
export function employerInquiryFounderEmail(opts: {
  name: string | null;
  company: string | null;
  email: string;
  teamSize: string | null;
  message: string | null;
}) {
  return {
    subject: `New employer inquiry${opts.company ? `: ${opts.company}` : ""}`,
    html: `
<p><b>${opts.name ?? "(no name given)"}</b>${opts.company ? ` · ${opts.company}` : ""}<br/>
${opts.email}${opts.teamSize ? ` · team size: ${opts.teamSize}` : ""}</p>
${opts.message ? `<p><b>What they're hoping to offer:</b><br/>${opts.message.replace(/\n/g, "<br/>")}</p>` : "<p>(No message — just the basics.)</p>"}
<p><b>Reply directly to this email</b> — it's set to reply-to their address.</p>`,
  };
}

/** Sent back to the employer contact immediately, so "we'll be in touch"
 * is a promise that's actually kept the moment they submit, not just UI copy. */
export function employerInquiryConfirmationEmail(opts: {
  name: string | null;
  company: string | null;
}) {
  const name = opts.name ? `Hi ${opts.name}` : "Hi";
  return {
    subject: "Got it — we'll be in touch",
    html: `
<p>${name},</p>
<p>Thanks for reaching out${opts.company ? ` about ${opts.company}` : ""} — this
went straight to Tony, and a real person will reply, not a sequence.</p>
<p>No pitch deck queued up on our end — just expect a note back to set up a
real conversation about your team.</p>
<p>— 12th &amp; Good Street</p>`,
  };
}

export function blueprintEmail(opts: {
  firstName: string | null;
  archetypeName: string;
  tagline: string;
  strength: string;
  blindSpot: string;
  needNow: string;
  nextSteps: readonly [string, string, string];
}) {
  const name = opts.firstName ? `Hi ${opts.firstName}` : "Hi";
  const steps = opts.nextSteps
    .map((s, i) => `<p><b>${i + 1}.</b> ${s}</p>`)
    .join("");
  return {
    subject: `Your Money Blueprint — ${opts.archetypeName}`,
    html: `
<p>${name},</p>
<p>Here's your full Money Blueprint. Your money style right now:</p>
<h2 style="margin:16px 0 4px">${opts.archetypeName}</h2>
<p><i>${opts.tagline}</i></p>
<p><b>Your natural strength.</b> ${opts.strength}</p>
<p><b>The pattern to watch.</b> ${opts.blindSpot}</p>
<p><b>What you likely need right now.</b> ${opts.needNow}</p>
<h3 style="margin:18px 0 4px">Your three moves for the next 90 days</h3>
${steps}
<p style="margin-top:18px">When you're ready to work these moves with someone
who has nothing to sell you, book a session with Tony:<br/>
<a href="https://12thandgood.com/tony">12thandgood.com/tony</a> — if your
first session isn't worth every dollar, you don't pay.</p>
<p>— 12th &amp; Good Street. You live here now.</p>`,
  };
}

/** Sent the moment a verbal/email "yes" gets turned into paperwork — the
 * onboarding kickoff for a new employer client. Deliberately restates the
 * commercial terms as plain text in the email body (tier, fee, headcount,
 * effective date), not just inside the attached PDF, so there's a second,
 * independently-readable record of what was agreed even if a mail client
 * mangles the attachment. See app/api/ops/route.ts's send-onboarding
 * action — this is not wired to any public form; it only fires when Tony
 * (or whoever holds OPS_TOKEN) explicitly triggers it after a real deal. */
export function onboardingAgreementEmail(opts: {
  name: string | null;
  company: string;
  tierLabel: string;
  annualFeeText: string;
  headcountText: string;
  effectiveDateText: string;
  isPilot: boolean;
}) {
  const name = opts.name ? `Hi ${opts.name}` : "Hi";
  return {
    subject: `Welcome to 12th & Good Street — ${opts.company}'s agreement is attached`,
    html: `
<p>${name},</p>
<p>Glad this is happening. Here's what we're setting up for ${opts.company}, and the agreement is attached so you can read the whole thing before anyone signs anything.</p>
<p>
  <b>Plan:</b> ${opts.tierLabel}${opts.isPilot ? " (90-day Founding Partner Pilot)" : ""}<br/>
  <b>${opts.isPilot ? "Pilot fee" : "Annual fee"}:</b> ${opts.annualFeeText}<br/>
  <b>Employees covered:</b> ${opts.headcountText}<br/>
  <b>Start date:</b> ${opts.effectiveDateText}
</p>
<p><b>Next steps:</b></p>
<p>
  1. Read the attached agreement — the commercial terms above are filled into Exhibit A at the back.<br/>
  2. Sign and send it back (reply to this email with a scan or a photo, or countersign electronically if that's easier on your end — whatever's simplest for you).<br/>
  3. Once we have it back, we'll set up a short kickoff call and get your coach started.
</p>
<p>No long-term lock-in, and no penalty if you ever need to pause or exit — that's in the agreement itself, not just on our website.</p>
<p>Questions on anything in it — just reply here, it comes straight to Tony.</p>
<p>— 12th &amp; Good Street</p>`,
  };
}

/** Confirmation copy to the founder every time onboarding paperwork goes
 * out — a lightweight paper trail without needing a CRM. */
export function onboardingSentFounderEmail(opts: {
  company: string;
  email: string;
  tierLabel: string;
  annualFeeText: string;
}) {
  return {
    subject: `Sent: onboarding agreement to ${opts.company}`,
    html: `
<p>Onboarding email + agreement PDF just went out to <b>${opts.email}</b> at <b>${opts.company}</b>.</p>
<p><b>Plan:</b> ${opts.tierLabel} · ${opts.annualFeeText}</p>
<p>Waiting on a signed copy back. Nothing else to do right now.</p>`,
  };
}

/** The weekly outbound-prospecting digest — sent to the founder only, never
 * to a prospect. Lists every outreach_targets row that's overdue for a
 * follow-up (sent 5+ business days ago, no reply logged yet) so nothing
 * quietly drops. Deliberately does NOT send anything to the prospect itself
 * — Tony reviews and sends the follow-up himself from his own inbox, same
 * boundary as the initial outreach. See app/api/cron/outreach-digest/route.ts. */
export function outreachFollowUpDigestEmail(opts: {
  overdue: Array<{
    organization: string;
    contactName: string | null;
    contactEmail: string | null;
    sentAt: string | null;
    followUpDraft: string;
  }>;
}) {
  const count = opts.overdue.length;
  const items = opts.overdue
    .map(
      (o) => `
<div style="margin:0 0 20px;padding:14px 16px;border:1px solid #e4e2dc;border-radius:8px;">
  <p style="margin:0 0 6px"><b>${o.organization}</b>${o.contactName ? ` — ${o.contactName}` : ""}${o.contactEmail ? ` (${o.contactEmail})` : ""}</p>
  <p style="margin:0 0 8px;color:#888;font-size:12px">Sent ${o.sentAt ? new Date(o.sentAt).toLocaleDateString() : "an unknown date"} — no reply logged yet.</p>
  <p style="margin:0;white-space:pre-wrap;font-size:13.5px;background:#f7f6f3;padding:10px;border-radius:6px">${o.followUpDraft}</p>
</div>`
    )
    .join("");
  return {
    subject: count
      ? `${count} follow-up${count === 1 ? "" : "s"} due this week`
      : "No follow-ups due this week",
    html: count
      ? `
<p>${count} target${count === 1 ? "" : "s"} from your outreach tracker ${count === 1 ? "hasn't" : "haven't"} heard back in 5+ business days. A follow-up draft is below each one — review, tweak, and send from your own inbox. Nothing here has been sent automatically.</p>
${items}
<p style="color:#888;font-size:12px">Once you've followed up (or decided not to), update the status in the outreach dashboard so this stops resurfacing.</p>`
      : `<p>Nothing overdue this week — every sent target has either replied, been marked resolved, or isn't due for a follow-up yet.</p>`,
  };
}

/** A short, low-pressure second-touch draft — genuinely just a bump, not a
 * repeat of the full pitch. Used to seed the follow-up draft shown in the
 * weekly digest; Tony can and should edit before sending. */
export function genericFollowUpDraft(organization: string, contactFirstName: string | null) {
  const name = contactFirstName ? contactFirstName : "there";
  return `Hi ${name},\n\nJust floating this back up in case it got buried — no worries if now's not the right time. Happy to talk whenever it's useful, or let me know if this isn't a fit and I won't follow up again.\n\nTony`;
}

/** Every draft_email in outreach_targets is generated as a "Subject: ..."
 * line, a blank line, then the body (see the prospecting seed scripts).
 * Splits it back into the two pieces so the send-queue digest can put the
 * subject in a mailto link and the body in a copy-paste box. Falls back
 * gracefully if a row was ever hand-edited into a different shape. */
function parseDraftSubjectBody(draftEmail: string): { subject: string; body: string } {
  const idx = draftEmail.indexOf("\n\n");
  const firstLine = idx === -1 ? draftEmail : draftEmail.slice(0, idx);
  const subjectMatch = firstLine.match(/^Subject:\s*(.+)$/i);
  if (!subjectMatch || idx === -1) {
    return { subject: "", body: draftEmail };
  }
  return { subject: subjectMatch[1].trim(), body: draftEmail.slice(idx + 2) };
}

/** The daily "send these today" digest — the actual fix for "I haven't had
 * time to send any of these." Instead of Tony having to remember to open
 * /ops/outreach, paste the token, and hunt for what's next, a fixed-size
 * batch of the oldest not-yet-sent targets lands in his inbox every weekday
 * morning, fully drafted, with a one-click "open in Mail" link for the
 * subject/to line and the full body ready to copy underneath. Still never
 * sends anything itself — same boundary as every other email in this file.
 * See app/api/cron/outreach-digest/route.ts. */
export function sendQueueDigestEmail(opts: {
  queue: Array<{
    id: string;
    organization: string;
    contactName: string | null;
    contactEmail: string | null;
    draftEmail: string;
  }>;
  heldForVerification: Array<{ organization: string; notes: string | null }>;
  opsUrl: string;
}) {
  const count = opts.queue.length;
  const items = opts.queue
    .map((t) => {
      const { subject, body } = parseDraftSubjectBody(t.draftEmail);
      const mailtoParams = new URLSearchParams();
      if (subject) mailtoParams.set("subject", subject);
      const mailto = t.contactEmail
        ? `mailto:${encodeURIComponent(t.contactEmail)}${mailtoParams.toString() ? `?${mailtoParams.toString()}` : ""}`
        : null;
      return `
<div style="margin:0 0 20px;padding:14px 16px;border:1px solid #e4e2dc;border-radius:8px;">
  <p style="margin:0 0 6px"><b>${t.organization}</b>${t.contactName ? ` — ${t.contactName}` : ""}${t.contactEmail ? ` (${t.contactEmail})` : ""}</p>
  ${subject ? `<p style="margin:0 0 6px;font-size:13px"><b>Subject:</b> ${subject}</p>` : ""}
  <p style="margin:0;white-space:pre-wrap;font-size:13.5px;background:#f7f6f3;padding:10px;border-radius:6px">${body}</p>
  ${
    mailto
      ? `<p style="margin:10px 0 0"><a href="${mailto}" style="display:inline-block;background:#b8502b;color:#fff;text-decoration:none;font-size:13px;font-weight:600;padding:8px 14px;border-radius:6px">Open in Mail →</a></p>`
      : ""
  }
</div>`;
    })
    .join("");

  const held = opts.heldForVerification;
  const heldBlock = held.length
    ? `
<p style="margin:24px 0 4px;color:#888;font-size:12px">Held — need a quick verify before these can go (see notes in the dashboard), not counted above:</p>
<ul style="margin:0;padding-left:18px;font-size:13px;color:#3d4147">
${held.map((h) => `<li>${h.organization}${h.notes ? ` — ${h.notes}` : ""}</li>`).join("")}
</ul>`
    : "";

  return {
    subject: count
      ? `Send these ${count} today`
      : "Nothing queued to send today",
    html: `
<p>${
      count
        ? `${count} ready to go — subject and body are below each one, or tap "Open in Mail" to start a draft in your own mail app with the subject and address filled in. Paste the body in, review, send it yourself. Nothing here has been sent automatically.`
        : "Nothing left in the ready-to-send queue right now — everything's either sent or waiting on verification."
    }</p>
${items}
${heldBlock}
<p style="margin-top:20px;color:#888;font-size:12px">After you send one, mark it <b>Sent</b> at <a href="${opts.opsUrl}">${opts.opsUrl}</a> so it drops out of tomorrow's batch and the follow-up timer starts.</p>`,
  };
}
