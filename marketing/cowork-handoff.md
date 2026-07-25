# Cowork Handoff — 12th & Good Street
**July 26, 2026 · Everything the next session (and you) need**

## Your first Cowork message (copy-paste this)

> 12th & Good Street — you're my project lead. Read the project memory
> (MEMORY.md and its linked files) and the repo at
> github.com/TonyDoble/12th-and-good, then give me a status check and
> today's priorities. Same rules as before: build without checking in
> first, flag business decisions for my override, never ask me to paste
> keys into chat.

That's it. The memory files carry the state, the rules, and the open list.

## Where everything lives (nothing is trapped in the old chat)
- **The product:** 12thandgood.com — live, verified, book-first homepage
- **The code:** github.com/TonyDoble/12th-and-good (`main` deploys to production via Vercel)
- **The brain:** Cowork project memory — project-state.md, working-rules.md, open-items.md
- **The paper trail:** `marketing/` in the repo — persona audit, both build reports, coach recruitment kit, Corner Letter #1 draft, this handoff

## Current state in one paragraph
Book-first homepage with your live availability above the fold (quiz-first
variant preserved at /home-a). The quiz is the "walk up Good Street" with
share cards that unfurl per money style. Free intro is retired — paid
sessions with required intake write-ups, reserve mode until Stripe, the
first-session guarantee doing the trust work. Non-bookers join the Corner.
24 windowed slots on your calendar (Tue/Wed/Thu eve + Sat morning,
Central assumed). Email templates built but dark until Resend. AI reads
every booking's write-up via the ops channel and preps you per session.

## YOUR list — the only things blocking full power (~30 min total)
1. **Resend key** (5 min, biggest unlock): resend.com → verify domain (2 DNS
   records at GoDaddy) → API key → Vercel env `RESEND_API_KEY` → Redeploy.
   Turns on: booking alerts to you, confirmations to clients, Blueprint
   delivery, Corner Letter sends.
2. **Until then:** check Supabase → `bookings` daily. Reserve bookings need
   YOU to email a payment link (pick your rail: PayPal/Zelle/invoice).
3. **Confirm or veto (one word each):** the first-session guarantee ·
   Tue/Wed/Thu 5:30+6:30pm + Sat 9+10am Central · $10/employee/month pilot ·
   "$0 platform fee during founding phase"
4. **Send me:** your LinkedIn URL (goes on your profile)
5. **When ready:** Stripe live keys in Vercel (reserve mode switches itself off)
6. **Domains, 5 min in Vercel → Domains:** add `www.12thandgood.com`
   (follow the DNS record it shows, same GoDaddy table as before), then add
   `12thandgoodstreet.com` as a redirect to 12thandgood.com — the redirect
   dropdown works once the main domain shows "Valid Configuration."
7. **Corner Letter #1:** your edit pass on `marketing/corner-letter-001.md`
8. **Check:** is the GitHub repo Private? (Settings → General → bottom).
   Internal strategy docs live in `marketing/` — fine if private, tell the
   next session to relocate them if public.

## The week ahead (lead's queue, no action from you)
Coach recruitment support once you lock the fee split → wire Corner Letter
sending when Resend lands → session-prep briefs for every real booking →
employer-page calendar link once you pick a scheduling tool → watch the
funnel and report.
