# Employer Program Backend — Scoping Spec

*12th & Good Street · drafted July 27, 2026 · for Tony to react to — nothing here is built yet*

## The honest framing first

You have zero signed employer contracts today. The most expensive mistake available right now is building a polished delivery platform for customers who don't exist yet. So this spec is deliberately staged: **Phase 0 requires no code at all** and can serve your first 2–3 contracts, and each later phase is triggered by a real operational pain, not by ambition. Build behind demand, not ahead of it.

What the site currently promises employers (and what the backend must eventually make true):

1. Employees book time with **their** dedicated coach, privately
2. The Money Blueprint for every employee
3. Group sessions / lunch-and-learns
4. Written plans after every session
5. AI Money Coach 24/7
6. **Aggregate** usage reporting — never an individual's numbers, notes, or plan

Items 2 and 5 already work with no employer backend. Items 1, 3, 4 are human workflows. Item 6 is the only real software promise — and it's the one with the sharpest privacy edge.

---

## Phase 0 — Concierge delivery (first 1–3 contracts, zero new code)

- **Booking:** a per-employer Calendly (or Cal.com) link for the assigned coach, shared in the employer's launch announcement. Employees book directly; nothing flows through the site.
- **Seat tracking:** a private spreadsheet per employer — roster size (a number, not names), sessions held, topics (categorized by the coach, no client detail).
- **Reporting:** a monthly one-page email to HR, written by the coach from the spreadsheet: sessions held, unique employees seen (as a count), top three topic categories, one anonymized signal ("several sessions touched on the 401(k) match — worth re-announcing it"). This *is* the aggregate reporting product, delivered by hand. It's also how you learn what HR actually wants in a report before you build a dashboard nobody reads.
- **Privacy rule from day one:** any metric derived from fewer than 5 employees gets suppressed or bucketed. Adopt this in the manual reports now so it's a policy, not a retrofit.

**Exit trigger for Phase 0:** 3+ active employers, or a coach spending >2 hrs/week on spreadsheet bookkeeping, or a prospect who won't sign without a live dashboard.

## Phase 1 — Seats and sessions become data (the first real build)

New tables (same RLS posture as everything else — service-role writes only, no public policies):

```
employers        id, name, slug, headcount_tier, contract_start, contract_end,
                 status (prospect|active|churned), assigned_coach_id,
                 hr_contact_name, hr_contact_email, created_at

employee_seats   id, employer_id → employers, email_hash (NOT the raw email — see below),
                 activated_at, last_active_at, created_at

program_sessions id, employer_id → employers, coach_id, kind (one_on_one|group|lunch_learn),
                 held_at, topic_category (budgeting|debt|home|retirement|investing|benefits|other),
                 -- "retirement" covers pre-tax vs Roth questions; split it into its own
                 -- category later only if the data shows it dominating
                 attendee_count int,  -- group/lunch_learn only (Tony: record headcount,
                                      -- zoom or in person); leave null on 1:1 rows
                 duration_minutes, created_at
                 -- deliberately NO seat_id/employee reference on 1:1 rows:
                 -- the system records THAT a session happened for this employer,
                 -- never WHO had it. The coach's private notes live outside this DB.
```

Design decisions worth arguing about:

- **`email_hash`, not email.** Seat activation checks membership (employee enters work email → hash → match against roster) without the database becoming a browsable list of who at Acme is getting money coaching. If the DB leaks, it leaks counts, not people. Trade-off: you can't email employees from the platform — in this phase, that's a feature.
- **Sessions don't link to seats.** This makes the "never an individual's data" promise *structural* rather than policy. The cost: you can't compute "repeat usage per employee" — you approximate engagement with `last_active_at` on seats. That's a real analytics sacrifice, made on purpose. If a future customer demands per-employee analytics, the answer is no — that's the product's spine.
- **Employer identification for employees:** a per-employer signup code / link (e.g. `12thandgood.com/join/acme`), not SSO. SSO is an enterprise sales checkbox; you're selling to 20–200-person companies. Revisit only when a deal dies over it. **Decided (Tony, Jul 27):** code-based access it is — and in Phase 0, usage gets logged as a count in the CRM, no seat table needed at all. The `employee_seats` table above only becomes necessary if a contract requires enforced seat counts.

Also in Phase 1: the coach gets a dead-simple logging form (employer, kind, topic category, date) — 30 seconds after each session. That form replaces the spreadsheet and *is* the input to all reporting.

## Phase 2 — HR reporting page (only when monthly emails stop scaling)

- A single page per employer at a signed URL (rotating token emailed to the HR contact — no accounts, no passwords, nothing for HR to lose): seats activated vs. headcount, sessions this quarter by kind, topic mix, and the coach's short written quarterly note.
- The n<5 suppression rule enforced in the query layer, not the UI.
- Still no employer admin login. An account system for HR is Phase 3 territory and may never be needed.

## Phase 3 — maybe never

Employee accounts, in-platform booking replacing Calendly, plan documents stored per-employee, employer self-serve. Each of these adds a category of breach risk and support load. None should exist until the coaching bench is >3 coaches or contracts demand it in writing.

---

## Decisions — answered by Tony, July 27, 2026

1. **Access model: per-employer code.** Employees get a code and they're in — no roster upload, no email-domain matching. Phase 0 usage tracking is a simple count logged in the CRM, which means Phase 0 stays genuinely zero-code. Seat *enforcement* only gets built if a contract demands it.
2. **Topic categories: seven.** Budgeting, debt, home, retirement (incl. pre-tax vs. Roth), investing, benefits, other. Investing added per Tony; retirement absorbs the pre-tax/Roth questions unless volume says otherwise.
3. **Group sessions: record headcount**, Zoom or in person. Added `attendee_count` to the data model.
4. **Written plans: not stored, not named.** The platform keeps nothing; plans carry no participant name. This is now a selling point in the privacy story, not just a policy — put it in the HR-facing one-pager when that gets written.
