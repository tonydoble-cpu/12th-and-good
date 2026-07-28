# Go-Live Checklist & Standing Decisions

*12th & Good Street · July 27, 2026*

## Vercel environment variables — the 10-minute list

The site is built to degrade gracefully: with nothing configured it still renders, but leads vanish into function logs and no emails send. These flip it fully on:

| Variable | What it does | Without it |
|---|---|---|
| `RESEND_API_KEY` | All transactional email (employer-inquiry alerts to you, confirmations to them, blueprint emails) | Every send silently no-ops |
| `EMAIL_FROM` | e.g. `12th & Good Street <hello@12thandgood.com>` (verify domain at resend.com first — two DNS records at GoDaddy) | Sends from `onboarding@resend.dev` (looks like a test) |
| `NOTIFY_EMAIL` | Where inquiry alerts go | Defaults to tonydoble@gmail.com (fine) |
| `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY` + `SUPABASE_SERVICE_ROLE_KEY` | Lead persistence (blueprint quiz + employer inquiries) | Submissions log to Vercel function logs only — recoverable but easy to miss |
| `ANTHROPIC_API_KEY` (or the configured LLM key) | Live AI Money Coach | Canned demo responses (coherent, but not a real conversation) |
| `OPS_TOKEN` | **Leave unset.** Gates `/api/ops`, which only serves the retired booking flow. Unset = endpoint fails closed = correct. | Nothing you need |

**Priority order if doing one thing at a time:** Resend first (a lead email you never see is a lost contract), Supabase second, LLM key third.

## Supabase SQL to run (once, when Supabase is configured)

The `employer_inquiries` table from `supabase/schema.sql` must exist in the live database or inquiry persistence silently falls back to demo logging. Dashboard → SQL editor → run the `employer_inquiries` block (it's `create table if not exists`, safe to run repeatedly).

## Stripe — decision recorded

**Recommendation: keep the code, remove nothing, spend zero time on it.**

Reasoning: the per-session checkout (`/api/checkout`, `/api/webhook/stripe`, the `stripe` dependency) served the retired consumer flow. Every route that could reach it is already redirected, so it's unreachable dead code — but it's also the skeleton you'll want when employer contracts move from invoice-by-email to online payment (annual ACH/card via Stripe Invoicing is the natural v2). Deleting it buys nothing; rewriting it now is premature. Revisit at the first signed contract, where the real question is "invoice or Stripe Invoicing?" — not checkout at all.

One hygiene item: if `STRIPE_SECRET_KEY` / `STRIPE_WEBHOOK_SECRET` are set in Vercel from the old flow, they can stay (unreachable code), but if you'd rather run clean, delete them — nothing live uses them.

## Security posture — where things stand after this pass

- Hardcoded ops-token fallback: **removed** (endpoint fails closed). If that string was ever the live gate, it's burned — the fix already treats it that way.
- npm: production-facing high-severity vulns **cleared** (Next 16.2.12, postcss ≥8.5.23, sharp ≥0.35 via overrides). Remaining audit noise is the eslint dev-toolchain only — never ships to users, no patched version exists without a breaking eslint major. Accepted; revisit at next eslint major bump.
- All lead tables RLS-enabled with no public policies; writes via service-role key server-side only.
- Standing rule worth keeping: any secret that ever appears in source or chat is burned — rotate, never reuse.
