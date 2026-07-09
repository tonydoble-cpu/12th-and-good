-- ============================================================================
-- The Marketplace — POC schema
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
-- coaches: public profile. `user_id` links to the Supabase auth user that's
-- allowed to log into /coach for this row.
-- ---------------------------------------------------------------------------
create table if not exists coaches (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id),
  slug text unique not null,
  full_name text not null,
  headline text not null default '',
  bio text not null default '',
  credentials text[] not null default '{}',
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

insert into coaches (slug, full_name, headline, bio, credentials)
values (
  'tony',
  'Tony Doble',
  'Fee-only financial coach. Nothing to sell, ever.',
  'I help people build a budget that actually works, get out from under debt, and make a plan they can stick to. I don''t sell investments, insurance, or any financial product.',
  array[
    '10+ years advising individuals and small business owners',
    'Fee-only — paid only by you, never by commission',
    'Fiduciary coaching standard: your interest, not a product''s'
  ]
)
on conflict (slug) do nothing;

insert into session_types (coach_id, name, description, duration_minutes, price_cents)
select id, 'First Session: Get Clear',
  'We look at everything together and build one page you can actually understand.',
  45, 9500
from coaches where slug = 'tony'
on conflict do nothing;

insert into session_types (coach_id, name, description, duration_minutes, price_cents)
select id, 'Build the Plan',
  'We turn what we found in your first session into a concrete plan.',
  45, 9500
from coaches where slug = 'tony'
on conflict do nothing;

insert into session_types (coach_id, name, description, duration_minutes, price_cents)
select id, 'Check-In Session',
  'A shorter follow-up to review progress and adjust the plan.',
  25, 6000
from coaches where slug = 'tony'
on conflict do nothing;
