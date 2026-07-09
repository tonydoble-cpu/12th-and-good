# The Marketplace — POC

Working title. A conflict-free financial coaching marketplace. This POC
proves one thing: a real person can find the site, book a session with Tony,
pay through the platform, meet him on video, and have it all live in their
account — with real money, end to end.

Full vision (multi-coach, employer-sponsored access, AI session capture) is
intentionally **not** built here. See `Marketplace_POC_BuildBrief.md` for the
full scope decision.

## Status: runs with zero configuration

This app is fully browsable right now with no environment variables set —
every page renders against fixture data in `lib/mock-data.ts` (one coach,
three session types, six open time slots). That's on purpose: you should be
able to `npm install && npm run dev` and see the whole product before
touching a single API key.

As each integration below gets configured, that page automatically switches
from demo data to the real thing. Nothing needs to be "turned on" in code —
it's driven by which env vars are present (see `lib/supabase/config.ts` and
`lib/stripe.ts`).

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Wiring up real infrastructure

Copy `.env.example` to `.env.local` and fill things in **in this order** —
each step unlocks the next:

### 1. Supabase (accounts + bookings)

1. Create a project at supabase.com.
2. Project Settings → API → copy the URL and anon key into
   `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
3. Also copy the **service role** key into `SUPABASE_SERVICE_ROLE_KEY`
   (server-only — this is what lets the Stripe webhook and coach dashboard
   write bookings/availability without exposing write access to the
   browser).
4. Run `supabase/schema.sql` in the Supabase SQL editor. It creates the
   tables, RLS policies, and seeds Tony's coach profile + three session
   types.
5. In Supabase Auth, enable email OTP (magic link) sign-in (on by default).
6. Create a real auth user for Tony (Authentication → Users → Invite), then
   in the SQL editor run:
   ```sql
   update coaches set user_id = '<tony-auth-user-id>' where slug = 'tony';
   ```
   That's what unlocks `/coach`.

Once these are set, `/account`, `/coach`, sign-in, and booking history all
switch from "not connected" placeholders to the real thing.

### 2. Stripe (payments — the whole point of the POC)

1. Use **test mode** keys until you're ready for step 6 of the build
   sequence ("test end-to-end with real money").
2. Dashboard → Developers → API keys → `STRIPE_SECRET_KEY` and
   `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`.
3. Webhook: point an endpoint at `/api/webhook/stripe`.
   - Local dev: `stripe listen --forward-to localhost:3000/api/webhook/stripe`
     — it prints a webhook signing secret, put that in
     `STRIPE_WEBHOOK_SECRET`.
   - Production: Dashboard → Developers → Webhooks → Add endpoint →
     `checkout.session.completed`.

A booking is created as `pending_payment` the moment checkout starts
(`app/api/checkout/route.ts`) and only flips to `confirmed`
(`app/api/webhook/stripe/route.ts`) once Stripe confirms the charge. The
browser is never trusted to say a payment succeeded — that's the "own the
transaction" requirement from the build brief, enforced structurally.

### 3. Zoom (video sessions)

1. Zoom App Marketplace → Build App → **Server-to-Server OAuth** (not the
   deprecated JWT app type).
2. Grant the `meeting:write:meeting` scope.
3. `ZOOM_ACCOUNT_ID`, `ZOOM_CLIENT_ID`, `ZOOM_CLIENT_SECRET`.

This is best-effort by design (`lib/zoom.ts`): if Zoom isn't configured, a
paid booking still confirms — a Zoom link should never block a confirmed,
paid session. The coach can paste a manual Zoom link into a booking from
`/coach` as a fallback, which also doubles as the escape hatch if Zoom's API
is ever down.

### 4. Make.com (confirmations + reminders)

Not built into the app code — this is intentionally left as a Make.com
scenario triggered off the Stripe webhook or a Supabase `bookings` row
insert/update, per the build brief. Recommended trigger: Supabase's native
webhook feature (Database → Webhooks) on `bookings` insert/update, since
that only fires on real, server-validated state changes.

## Architecture notes

- **Single coach, multi-coach-shaped schema.** Every table is keyed by
  `coach_id`. Adding coach #2 is a data problem, not a schema rewrite — see
  `supabase/schema.sql`.
- **All writes are server-only.** `coaches`, `session_types`,
  `availability_slots`, and `bookings` have no client-writable RLS policies.
  Every mutation goes through a Route Handler or Server Action using the
  service-role key, after re-verifying who's asking (see
  `app/coach/actions.ts` → `requireCoachId()`). The browser can read public
  data and its own bookings; it can never write a "confirmed" booking
  directly.
- **Demo mode vs. live mode.** `lib/supabase/config.ts` and `lib/stripe.ts`
  export `isSupabaseConfigured` / `isStripeConfigured`. Server components and
  API routes check these and fall back to `lib/mock-data.ts` rather than
  crashing. This is why the app works before any infra exists.
- **Coaching, not investment advice.** All copy is framed as coaching,
  budgeting, and planning — never as a securities recommendation. See the
  disclaimer blocks on `/tony` and in the footer. Don't remove these when
  editing copy.

## Known gaps / next steps (by design — see build brief)

- **Rebooking is "one click to the booking flow with the session type
  pre-filled," not true one-click-charge-my-saved-card.** True one-click
  rebooking needs a Stripe Customer + saved payment method (SetupIntent) —
  a reasonable v1.1 addition once the base flow is proven with real money.
- **No availability conflict locking.** Two people could theoretically grab
  the same slot in the same instant (double-booking race). Low-risk for a
  single early-stage coach's volume; worth a `select ... for update` or a
  unique constraint trick before it matters.
- **No coach-side edit/delete for session types or availability**, only
  add. Extend `app/coach/actions.ts` when that friction shows up.
- Multi-coach discovery, employer/sponsor portals, AI session notes,
  membership tiers — explicitly deferred to Phase 2 per the build brief.

## Tech stack

Next.js 16 (App Router, Turbopack) · TypeScript · Tailwind CSS v4 ·
Supabase (Postgres, Auth, RLS) · Stripe Checkout · Zoom Server-to-Server
OAuth · deploys to Netlify.

`node_modules/next/dist/docs/` has the full docs for this exact installed
Next.js version if something in the framework behaves unfamiliarly — this
POC was built against Next 16, which changed several conventions (async
`params`/`searchParams`, `middleware.ts` → `proxy.ts`, Turbopack by
default) from earlier versions.
