# "The Marketplace" — POC Build Brief
*Working title. Hand this to Cowork to build the proof of concept.*
*Scope is deliberately narrow. Build the transaction spine, not the full vision.*

---

## What We're Building (POC only)

A working proof of concept for a conflict-free financial coaching marketplace. For the POC, there is **one coach (Tony)**. A real person can find the site, book a session, pay, and meet Tony on an integrated video session — all through the platform. That's it. Prove the plumbing works end-to-end with real money before adding more coaches or features.

**Do NOT build for the POC:** multi-coach search/discovery, ratings across many coaches, employer/sponsor portals, AI note-taking, membership tiers. Those come later. Building them now is over-engineering before the core is proven.

---

## The Full Vision (context only — do not build all of this yet)

A conflict-free advice marketplace where regular people — with a strong focus on underserved communities — hire vetted, fee-only financial coaches for honest 1:1 sessions to build a budget, build a plan, and take action. Nobody sells products or earns commission. Dual access: employer-sponsored (like an employer paying UnitedHealth so employees get coverage) plus direct consumer pay. Mission-explicit, access-open. This context explains *why* the POC is built the way it is — but the POC itself is just the transaction spine with one coach.

---

## POC Scope — Build Exactly This

### 1. The transaction spine (the whole point of the POC)
- A landing page explaining what the platform does (conflict-free coaching, nothing to sell)
- Tony's coach profile: video intro, bio, credentials, session types offered, price
- Booking flow: client picks a session type + time
- Payment: client pays through the platform (Stripe) at time of booking
- Integrated video session (Zoom integration/embed) — the session happens on/through the platform
- Account for the client: their booking(s), session history, easy rebooking

### 2. Coach side (just Tony for now)
- Ability to set session types, availability, and prices
- View upcoming and past bookings
- Join the video session

### 3. Account-held continuity (lightweight — no AI)
- Client account holds session history and allows one-click rebooking
- Optional: a simple field where the coach can enter notes/a plan after a session, visible to the client in their account (manual, not AI)

---

## Critical Design Requirements

- **Own the transaction from day one.** Booking + payment run through the platform, even though there's only one coach. This is the non-negotiable foundation — it's how the business monetizes later and it's nearly impossible to retrofit.
- **Make rebooking effortless.** This is the primary "value-to-stay" mechanism. One-click rebook, saved payment.
- **Coaching, not advice.** All copy frames this as financial coaching and planning (budgets, debt, money behavior, general education) — NOT individualized investment advice. No language that implies securities recommendations or investment management.
- **Conflict-free is the brand.** "Nothing to sell. No products. No commission." should be front and center.
- **Mission-explicit, access-open.** Copy can name the focus on underserved communities and economic empowerment — framed as who it's built for and welcoming to all. (Consider getting civil-rights/public-accommodation-aware legal review of the exact mission language before public launch — target and serve, never exclude.)

---

## Monetization (context — build direct-pay first)

- **Direct consumer pay** — works with one coach, so this is what the POC supports: client pays per session via Stripe.
- **Employer-sponsored (later)** — the "UnitedHealth model": employer pays for employees to access the marketplace. Scales with coach supply, so it comes after the network grows. Not in the POC.

---

## Tech Stack
- Netlify (hosting)
- Supabase (accounts, bookings, session records)
- Stripe (payments — Tony has prior Stripe setup experience)
- Zoom (integrated/embedded video sessions)
- Make.com (automation — booking confirmations, reminders)
- One clean web app

---

## Legal To-Do (before real paid sessions with real clients)
- Confirm coaching-only scope with an attorney (coaching/planning, not investment advice)
- Rule: any IAR who joins later stays in the coaching lane on-platform (keeps scope clean)
- Coach agreement (for when other coaches join): fee-only, no product selling, light anti-solicitation clause, independent contractor, E&O requirement
- Platform terms of service + consumer terms
- Video session consent norms
- Civil-rights-aware review of mission language (target/serve, not exclude)

*Note: Tony launches as a COACH, not as an IAR. He has not taken on the advisor role. This keeps the platform in the unregulated coaching lane for v1.*

---

## Build Sequence
1. Landing page + Tony's coach profile (video, bio, credentials, session types, price)
2. Booking flow + Stripe payment (own the transaction)
3. Zoom integration for the session
4. Client account: booking history, one-click rebooking, optional manual coach notes
5. Automation: confirmations + reminders (Make.com)
6. Test end-to-end with real overflow clients and real money

---

## What Success Looks Like for the POC
A real person books Tony, pays through the platform, meets him on integrated video, and the session lives in their account with easy rebooking. The plumbing works with real money. Then — and only then — add coach #2 and the marketplace layer.

---

## Deferred to Phase 2 (do not build now)
- AI session capture + note-taking + action-item tracking + outcome follow-through (the eventual moat and membership engine — but a consent/privacy/data-security build that should wait until the core is proven)
- Multi-coach search, discovery, and cross-coach ratings
- Employer/sponsor portals and the "UnitedHealth" B2B access model
- Membership / recurring tiers
- Final name and brand

---
*Working title "The Marketplace." Standalone business, warm-started by Tony's overflow demand. Mission: conflict-free financial coaching for regular people, with a strong focus on economic empowerment in underserved communities. POC first — transaction spine, one coach, real money.*
