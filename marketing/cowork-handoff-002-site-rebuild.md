# Cowork Handoff — Site rebuild for the employer-program pivot
**July 27, 2026 · Read this before touching anything below**

## What happened and why

This session's copy of the repo (`/home/claude/repo`) has no GitHub connection
— no working token, no git remote. Everything below was built and verified
locally (`npm run build` succeeds, `npm run dev` was screenshot-tested) but
**nothing has been pushed.** Tony decided: go all-in on the employer
annual-program business, retire the consumer marketplace. This handoff is
how that decision gets from this local copy to production.

## How to get this live

1. Get this exact code onto your machine or into a session that has the repo
   attached via the Cowork repo picker (`TonyDoble/12th-and-good`).
2. Diff/copy the changed files listed below into that copy.
3. Commit and push to `main` — Vercel auto-deploys.
4. Sanity-check the live site: homepage, `/employers` (try the calculator),
   `/resources`, and confirm `/coaches` and `/tony` now redirect instead of
   showing the old marketplace pages.

## Files changed

**New:**
- `lib/program-pricing.ts` — the firm-tier pricing table (`priceForHeadcount`),
  ported line-for-line from `onepager/employer-plan-page.html`'s tested JS.
  Also exports `estimatedAnnualProgramCost` for the ROI calculator.
- `components/tools/ProgramPricingCalculator.tsx` — the interactive
  headcount → tier calculator, used on `/employers`.
- `marketing/cowork-handoff-002-site-rebuild.md` — this file.

**Rewritten:**
- `app/page.tsx` — the homepage. Was the consumer book-a-coach page
  (quiz funnel, per-session Stripe pricing). Now leads with the approved
  headline ("Everyone on your payroll has money questions they've never
  asked anyone"), the flat-annual-fee tagline, a pricing preview band, and
  routes into `/employers`.
- `components/Header.tsx` — nav. Removed "Browse coaches," "Become a coach,"
  "Money Coach." Added "Pricing," "About." Default CTA now "Talk to us."
- `components/Footer.tsx` — same cleanup, tagline changed from "the
  marketplace for better money conversations" to "financial wellness that
  people actually use."
- `components/homeb/HomeFaq.tsx` — same accordion component, new questions
  (cost, IT/data requirements, what HR sees) replacing the old per-session
  consumer FAQ.
- `app/employers/page.tsx` — pricing section replaced. Was "per-employee/mo"
  and a "flat per-employee rate, quoted in one call" pilot — both
  contradicted this session's firm-tier decision. Now uses
  `ProgramPricingCalculator` plus a firm pilot price ($9,500/90 days, $5,000
  credit). Rest of the page (stats, differentiators, program grid, privacy)
  was largely reusable and left mostly as-is.
- `components/tools/EmployerROI.tsx` — the ROI calculator's program-cost
  assumption was a flat "$10/employee/month" modeling guess. Now uses the
  real tier pricing from `lib/program-pricing.ts`. Everything else in that
  calculator (productivity/turnover/absenteeism/healthcare savings math,
  sourcing, the 25% realization haircut) was already solid and untouched.
- `app/resources/page.tsx` — fixed the bottom CTA (was `/coaches` → 404 now
  that it redirects; changed to `/employers`) and a copy typo.
- `next.config.ts` — added redirects for retired routes (see below).
- A dozen internal `href="/coaches"` / `/become-a-coach"` / `/book"` /
  `/tony"` / `/coach-ai"` / `/how-we-make-money"` links across `app/` and
  `components/tools/*` mechanically repointed to their replacements.

## Retired, not deleted

`/coaches`, `/coach`, `/become-a-coach`, `/book`, `/book/success`,
`/session/*`, `/account`, `/login`, `/tony`, `/how-we-make-money`,
`/coach-ai`, `/home-a`, `/home-b` still exist as files — deleting them
touches Supabase/Stripe/Zoom plumbing (`lib/coach-data.ts`, `lib/stripe.ts`,
`lib/zoom.ts`, the booking/session/account flow) that deserved more time
than tonight had. They're unlinked from every nav and footer, and
`next.config.ts` now redirects each one to its replacement, so nothing
404s and nothing dead-ends. **Full deletion of the consumer-marketplace
code is real, still-open follow-up work** — flag it for a future session if
you want the dead code gone rather than redirected.

## What I did NOT get to — genuinely open

- **`/resources` tool components.** `Calculator401k.tsx`, `BudgetBuilder.tsx`,
  `DebtPayoff.tsx`, `EmergencyFund.tsx`, `BenefitsCheckup.tsx`,
  `WellnessAssessment.tsx` already exist and looked reasonable at a glance,
  but I haven't audited their content or reading level, and haven't checked
  them against `retirement-savings-projector.html` /
  `budget-reality-check.html` (built earlier tonight as standalone HTML) for
  overlap. Right now there may be two different versions of a 401(k)
  calculator and a budget tool living in two different places. Needs a
  decision: keep the in-repo React versions, port tonight's HTML tools in to
  replace them, or merge the best of both.
- **"AI Money Coach — 24/7 access."** `app/coach-ai`, `CoachAIChat.tsx`, and
  `lib/coach-ai-prompt.ts` are a real, already-built feature, still listed
  on `/employers` in the "what your team gets access to" grid. I didn't
  audit what it actually says or whether it has persistent memory — given
  the DOL 96-1 education-vs-advice conversation from earlier tonight, this
  needs your read before it ships prominently. I left it in place rather
  than silently cutting a built feature, but it's not vetted.
- **`/about`, `/blog`, `/privacy`.** Not rewritten. `/about` read fine on a
  quick check (no marketplace language). Blog posts weren't reviewed for
  stale references.
- **Supabase schema / `lib/coach-data.ts`.** Still modeled around a
  `coaches` table (plural, many-coach-ready). Nothing broke it tonight, but
  it's still marketplace-shaped underneath — not urgent unless someone
  starts building against it assuming multi-coach is real.

## Verified tonight

- `npm run build` — compiles clean, zero TypeScript errors.
- `npm run dev` + Playwright: homepage, `/employers`, `/resources` all
  render correctly; the pricing calculator was exercised at headcounts
  10, 30, 40, 70, 300, 650 — every tier boundary (under-50 soft state, pilot,
  Starter/Core/Growth, 500+ enterprise soft state) matches
  `onepager/the-program.md` §3 exactly.
- `/coaches` confirmed redirecting (307) instead of serving the old page.
