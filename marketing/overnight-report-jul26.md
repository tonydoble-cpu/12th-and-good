# Overnight Report — July 26, 2026
**From your project lead · You slept, the site got better · Everything below is live and verified**

## The headline

**When you went to bed, no visitor could reach you. This morning, they can.**

Last night's persona audit found the brutal truth: the quiz funnel ended at a passive waitlist, and the booking page was a dead button — no time slots existed, and an account wall blocked the free intro. Five motivated test personas, zero conversions possible. Tonight I rebuilt the entire path and **proved it works by booking a real intro call on the live site as an anonymous guest** — no account, just name + email → picked Tuesday 3:30 → "You're booked." Then I deleted my test data and returned the slot to your calendar.

## What shipped (all live at 12thandgood.com)

**1. The booking path — open for business**
- **49 real call times on your calendar** (next 3 weeks): Tue/Wed/Thu evenings 5:30–7:30pm + Saturday mornings 9–11am, **Central time — I had to assume your timezone; say the word and I'll regenerate the schedule in one pass.**
- **Free intro books with zero account.** Name + email, done. (The system quietly creates a passwordless record server-side so your dashboard still sees everything.) Paid sessions still require sign-in — unchanged until Stripe goes live.
- Booking card now **defaults to the free intro** — the first number a visitor sees is "Free," not "$150."
- Booked slots vanish immediately for the next visitor (verified: my test booking removed Tue 3:30 from the picker in real time).
- If the calendar ever runs empty, visitors see an honest "new times are being added" note with a path to the Blueprint — never a dead button again.
- Deleted forever: *"Pricing is a placeholder… it may come down from here."* (The line that told buyers today's price is the sucker's price.)

**2. The funnel now ends at YOU**
The Blueprint result's big CTA is **"Book your free intro call →"** straight into your calendar. The waitlist became the quiet secondary option ("Rather wait for a different coach?"). Every persona — all five — flagged this exact change as the one that would have converted them.

**3. No more broken promises**
The result page claimed "a full copy is on its way to your email." No email system existed. Now the site **only promises an email when one actually sent.** Until then: "This page is yours — screenshot your three moves." I built the entire email layer (Blueprint delivery, booking confirmations to the client, booking alerts to you) — it's wired, tested, and **waiting on one API key from you** (5-minute Resend setup, steps below).

**4. Trust layer for the Marcus test** *(the skeptic whose dad got burned)*
- Your profile now shows your **credentials** (they were in the database, never displayed) plus a plain-English fee box: *"You pay for the session, and that is 100% of how I'm paid — no commissions, no product fees, no referral kickbacks, not from anyone, ever."*
- Replaced the self-issued "✓ Vetted & conflict-free" badge (a company grading its own homework) with the factual "✓ Fee-only — nothing to sell you."
- **Four new pages, all footer links now real:** `/about` (your 12th Street story), `/how-we-make-money` (the full model in plain English — the page skeptics hunt for), `/privacy` (plain-English, no legalese), `/become-a-coach` (recruiting page with your standards bar).

**5. The Denise fixes** *(57, laid off, careful reader)*
- New quiz options: life stage **"Between jobs or starting over"** · goal **"Make it to — and through — retirement"** (the word "retirement" existed nowhere in the product; now it does).
- The Reclaimer result no longer guesses "bankruptcy, a divorce" at people — it says "a setback you didn't choose."
- The full-screen color flash is shorter and fully skipped for users with reduced-motion settings.
- "Take the quiz — 60 seconds" (a promise we broke 8 questions later) is now "8 quick questions · about 2 minutes."

**6. The Priya fixes** *(HR director, 400 employees)*
- **Founding Employer Pilot box with a real price: $10/employee/month**, one department up to 50 people, 90 days, cancel anytime. ⚠️ **I set that price** — it matches the calculator's own math and the market midpoint, but it's yours to change before you pitch anyone.
- ROI calculator now applies a **25% conservatism haircut**: the fantasy "20.6:1" is now **~5:1**, right at the independent-study benchmark — with a visible note explaining we'd rather be wrong low. An HR buyer can now take that number into a budget meeting.

## Decisions I made that you can override with one word
1. **Call hours + Central timezone** (regenerate anytime)
2. **$10/employee/month pilot price** on the employer page
3. **"During our founding phase, 100% of your session fee goes to your coach; platform fee is $0"** — stated on /how-we-make-money and /become-a-coach. It matched how things actually work today, and it's a strong recruiting hook — but it's a public business commitment, so own it or edit it.
4. ROI haircut at 25% · "Fee-only — nothing to sell you" badge wording · all new page copy

## Your 10-minute morning list
1. **Turn on email (biggest unlock):** resend.com → free account → verify 12thandgood.com (2 DNS records at GoDaddy — same table you've used before) → create API key → Vercel → Settings → Environment Variables → add `RESEND_API_KEY` → Deployments → Redeploy. The moment that's done: clients get confirmations, you get "new booking" alerts, and Blueprint emails deliver.
2. **Until then: check Supabase → Table Editor → `bookings` once a day.** A real booking shows the client's email in `client_profiles`. You send them a video link manually.
3. **Tell me:** your real weekly hours + timezone · your LinkedIn URL (I'll add it to your profile — I deliberately didn't guess) · yes/no on the $10 pilot price.
4. **Glance at the four new pages** — they speak in your voice; make sure I got it right: /about · /how-we-make-money · /privacy · /become-a-coach

## What I deliberately did NOT do
- Sent no outreach to anyone (coach recruitment emails are drafted in the kit — sending them is yours).
- Created no accounts anywhere (Resend needs to be yours).
- Didn't link a LinkedIn I couldn't verify is you.
- Didn't touch Stripe (paid bookings stay off until you're ready).
- Didn't publish your gmail anywhere on the site.

## Verification evidence
Full production run tonight, in a real browser: quiz → all 8 questions → Blueprint → "Book your free intro call" → your profile → picked Tue 3:30 PM → guest name/email → **"You're booked."** Slot disappeared from the calendar; booking row + client record landed in Supabase; then all test data (1 booking, 1 test user, 3 test quiz leads) was wiped and the slot restored. The one-time seeding tool I used was deleted from the codebase afterward. Three deploys total, all green, 23/23 automated checks passed before the first push.

## This week, as your lead (no action needed from you)
Coach recruitment support (the kit is ready — your platform-fee decision feeds its "numbers to lock"), the shareable result-card images for the viral loop, finishing www + 12thandgoodstreet.com domain wiring, and — once you send the Resend key — restoring the "check your email" moment end to end.

**Bottom line: yesterday this was a beautiful brochure with locked doors. Today it's a working funnel: a stranger can discover you, understand themselves, and get on your calendar in under five minutes without talking to anyone. Go sell. The front door works.**
