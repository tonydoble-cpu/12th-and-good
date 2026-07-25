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

type SendArgs = {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
};

export async function sendEmail({
  to,
  subject,
  html,
  replyTo,
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

/** Fire-and-forget note to the founder. Never blocks the caller's response. */
export function notifyFounder(subject: string, html: string) {
  if (!isEmailConfigured) return;
  void sendEmail({ to: NOTIFY_TO, subject, html });
}

// ---------------------------------------------------------------------------
// Templates — plain, warm, no tracking pixels, no images.
// ---------------------------------------------------------------------------

export function introBookedClientEmail(opts: {
  firstName: string | null;
  whenText: string;
}) {
  const name = opts.firstName ? `Hi ${opts.firstName}` : "Hi";
  return {
    subject: "Your intro call with Tony is booked",
    html: `
<p>${name},</p>
<p>Your free 20-minute intro call is confirmed for <b>${opts.whenText}</b>.</p>
<p>Tony will send the video link from this address before the call. Bring one
money question that's been on your mind — that's the whole agenda.</p>
<p>Nothing to prepare, nothing to buy. See you there.</p>
<p>— 12th &amp; Good Street</p>
<p style="color:#888;font-size:12px">Need to reschedule? Just reply to this email.</p>`,
  };
}

export function introBookedFounderEmail(opts: {
  name: string | null;
  email: string;
  whenText: string;
}) {
  return {
    subject: `New intro call booked — ${opts.whenText}`,
    html: `
<p>New free intro call on the books:</p>
<p><b>${opts.name ?? "(no name given)"}</b> · ${opts.email}<br/>
<b>${opts.whenText}</b></p>
<p>To do: send them a video link from your email before the call.</p>`,
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
<p style="margin-top:18px">When you're ready to talk it through with someone
who has nothing to sell you, your free 20-minute intro call is here:<br/>
<a href="https://12thandgood.com/tony">12thandgood.com/tony</a></p>
<p>— 12th &amp; Good Street</p>`,
  };
}
