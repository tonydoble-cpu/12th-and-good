-- ============================================================================
-- 12th & Good Street — POC schema
-- Run this in the Supabase SQL editor (or via `supabase db push`) on a fresh
-- project. Designed for ONE coach today, but every table is keyed by
-- coach_id so a second coach is a data problem, not a schema rewrite.
--
-- Write pattern: coaches / session_types / availability_slots / bookings are
-- only ever written by server code using the service-role key (see
-- lib/supabase/server.ts -> createServiceRoleClient). Anonymous/auth'd users
-- get read-only access via RLS below. This keeps "can this person actually
-- pay before a booking is marked confirmed" enforced server-side, not by
-- trusting the browser.
-- ============================================================================

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- blueprint_leads: quiz funnel captures. Written by /api/blueprint at gate1
-- (email + archetype), gate2 (full blueprint unlocked), and waitlist opt-in.
-- Upserts on email. RLS is enabled with NO public policies — only the
-- service-role key (server-side API routes) can read or write. Keep it that
-- way: this table is the lead list, it must never be browser-readable.
-- ---------------------------------------------------------------------------
create table if not exists blueprint_leads (
  email text primary key,
  first_name text,
  archetype text,
  pre_gate_answers jsonb,
  post_gate_answers jsonb,
  waitlist boolean not null default false,
  gate1_at timestamptz,
  gate2_at timestamptz,
  waitlist_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz
);
alter table blueprint_leads enable row level security;

-- ---------------------------------------------------------------------------
-- employer_inquiries: submissions from the /employers "Talk to us" contact
-- form — the primary conversion point for the annual-program business.
-- Written by /api/employer-inquiry using the service-role key. Same RLS
-- posture as blueprint_leads: enabled, no public policies, server-only
-- access. This table has no relationship to coaches/bookings — it's
-- pre-contract sales pipeline, not program delivery.
-- ---------------------------------------------------------------------------
create table if not exists employer_inquiries (
  id uuid primary key default gen_random_uuid(),
  name text,
  company text,
  email text not null,
  team_size text,
  message text,
  created_at timestamptz not null default now()
);
alter table employer_inquiries enable row level security;

-- ---------------------------------------------------------------------------
-- coaches: public profile. `user_id` links to the Supabase auth user that's
-- allowed to log into /coach for this row.
-- ---------------------------------------------------------------------------
create table if not exists coaches (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id),
  slug text unique not null,
  full_name text not null,
  -- Short sub-bio shown under the name on the profile header.
  headline text not null default '',
  -- "My approach" copy: two paragraphs joined by a blank line (\n\n),
  -- split on render rather than adding a separate paragraphs column.
  bio text not null default '',
  credentials text[] not null default '{}',
  -- Chip tags shown under the profile header (e.g. "Budgeting & cash flow").
  specialties text[] not null default '{}',
  -- Shows the "Founding coach" badge on cards and the profile header.
  founding boolean not null default false,
  video_intro_url text,
  photo_url text,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- session_types: what a client can book, and at what price.
-- ---------------------------------------------------------------------------
create table if not exists session_types (
  id uuid primary key default gen_random_uuid(),
  coach_id uuid not null references coaches (id) on delete cascade,
  name text not null,
  description text not null default '',
  duration_minutes int not null,
  price_cents int not null check (price_cents >= 0),
  active boolean not null default true,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- availability_slots: open times the coach has published. Booking a slot
-- flips is_booked to true; it does not get deleted, so history is intact.
-- ---------------------------------------------------------------------------
create table if not exists availability_slots (
  id uuid primary key default gen_random_uuid(),
  coach_id uuid not null references coaches (id) on delete cascade,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  is_booked boolean not null default false,
  created_at timestamptz not null default now(),
  constraint slot_time_order check (ends_at > starts_at)
);

-- ---------------------------------------------------------------------------
-- client_profiles: one row per client auth user. Created on first login.
-- ---------------------------------------------------------------------------
create table if not exists client_profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  email text not null,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- bookings: the transaction record. Created as 'pending_payment' the moment
-- checkout starts, flipped to 'confirmed' only by the Stripe webhook after
-- payment actually succeeds. This table IS the transaction spine.
-- ---------------------------------------------------------------------------
create table if not exists bookings (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references client_profiles (id),
  coach_id uuid not null references coaches (id),
  session_type_id uuid not null references session_types (id),
  slot_id uuid not null references availability_slots (id),
  status text not null default 'pending_payment'
    check (status in ('pending_payment', 'confirmed', 'completed', 'canceled')),
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  price_cents int not null,
  stripe_checkout_session_id text unique,
  stripe_payment_intent_id text,
  zoom_join_url text,
  zoom_start_url text,
  coach_notes text,
  created_at timestamptz not null default now()
);

create index if not exists bookings_client_id_idx on bookings (client_id);
create index if not exists bookings_coach_id_idx on bookings (coach_id);
create index if not exists bookings_stripe_checkout_session_id_idx
  on bookings (stripe_checkout_session_id);

-- ============================================================================
-- Row Level Security
-- ============================================================================

alter table coaches enable row level security;
alter table session_types enable row level security;
alter table availability_slots enable row level security;
alter table client_profiles enable row level security;
alter table bookings enable row level security;

-- Public can read coach profiles (it's a marketing/booking page).
create policy "coaches are publicly readable"
  on coaches for select
  using (true);

-- Public can read active session types (needed to render the booking flow
-- before a client is logged in).
create policy "active session types are publicly readable"
  on session_types for select
  using (active = true);

-- Public can read open availability (needed to render the time picker
-- before a client is logged in). Already-booked slots are still visible so
-- a coach's dashboard can show them; the booking flow filters is_booked.
create policy "availability is publicly readable"
  on availability_slots for select
  using (true);

-- Clients can read and update their own profile row only.
create policy "clients read own profile"
  on client_profiles for select
  using (auth.uid() = id);

create policy "clients update own profile"
  on client_profiles for update
  using (auth.uid() = id);

-- Needed so the auth callback (running as the signed-in user, not the
-- service role) can create the profile row on first login.
create policy "clients insert own profile"
  on client_profiles for insert
  with check (auth.uid() = id);

-- A client can read their own bookings. A coach can read bookings that
-- belong to them (matched via coaches.user_id = auth.uid()).
create policy "clients read own bookings"
  on bookings for select
  using (
    auth.uid() = client_id
    or coach_id in (select id from coaches where user_id = auth.uid())
  );

-- No insert/update/delete policies are defined for coaches, session_types,
-- availability_slots, or bookings — all writes go through the service-role
-- key from trusted server code (API routes), never directly from the
-- browser. This is intentional, not an oversight.

-- ============================================================================
-- Seed data for Tony (replace with real bio/credentials/prices before launch)
-- ============================================================================

insert into coaches (slug, full_name, headline, bio, credentials, specialties, founding, photo_url)
values (
  'tony',
  'Tony Doble',
  'Practical, plain-English money coaching — and the first coach on the marketplace. I''m taking these early calls myself, with no product behind me and nothing to sell you.',
  E'I started taking these calls myself because I believe honest money help shouldn''t be a luxury — and it definitely shouldn''t come with a product attached. Whatever you''re working on, we''ll talk it through like real people.\n\nWe''ll start where you actually are, not where a brochure assumes you should be. You bring the real numbers and the real questions; I bring a clear head and a plan you can act on the same week. No jargon, no judgment, no pitch.',
  array[
    '10+ years advising individuals and small business owners',
    'Fee-only — paid only by you, never by commission',
    'Fiduciary coaching standard: your interest, not a product''s'
  ],
  array[
    'Budgeting & cash flow',
    'Debt paydown strategies',
    'First-time home buying',
    'Investing basics',
    'Understanding 401(k)s'
  ],
  true,
  '/tony-doble.png'
)
on conflict (slug) do nothing;

insert into session_types (coach_id, name, description, duration_minutes, price_cents)
select id, 'Free intro call',
  'A no-pressure hello to see if we''re the right fit. No plan yet — just a conversation.',
  20, 0
from coaches where slug = 'tony'
on conflict do nothing;

insert into session_types (coach_id, name, description, duration_minutes, price_cents)
select id, 'Single session',
  'A focused deep-dive on one goal, with a written plan and next steps afterward.',
  60, 15000
from coaches where slug = 'tony'
on conflict do nothing;

insert into session_types (coach_id, name, description, duration_minutes, price_cents)
select id, '3-session action plan',
  'Build real momentum over a month — a plan, the work, and a check-in to keep it going.',
  180, 42000
from coaches where slug = 'tony'
on conflict do nothing;
