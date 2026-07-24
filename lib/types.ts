// Core domain types for the marketplace POC.
// One coach (Tony) for now, but modeled so a `coaches` table scales to many.

export type SessionType = {
  id: string;
  coach_id: string;
  name: string;
  description: string;
  duration_minutes: number;
  price_cents: number;
  active: boolean;
};

export type Coach = {
  id: string;
  slug: string;
  full_name: string;
  /** Short one-line sub-bio shown under the name on the profile header. */
  headline: string;
  /**
   * "My approach" copy — two paragraphs joined by a blank line (`\n\n`).
   * Split on render rather than adding a separate array column.
   */
  bio: string;
  credentials: string[];
  /** Chip tags shown under the profile header (e.g. "Budgeting & cash flow"). */
  specialties: string[];
  /** Shows the "Founding coach" badge on cards and the profile header. */
  founding: boolean;
  video_intro_url: string | null;
  photo_url: string | null;
};

export type AvailabilitySlot = {
  id: string;
  coach_id: string;
  starts_at: string; // ISO timestamp
  ends_at: string; // ISO timestamp
  is_booked: boolean;
};

export type BookingStatus =
  | "pending_payment"
  | "confirmed"
  | "completed"
  | "canceled";

export type Booking = {
  id: string;
  client_id: string;
  coach_id: string;
  session_type_id: string;
  slot_id: string;
  status: BookingStatus;
  starts_at: string;
  ends_at: string;
  price_cents: number;
  stripe_checkout_session_id: string | null;
  stripe_payment_intent_id: string | null;
  zoom_join_url: string | null;
  zoom_start_url: string | null;
  coach_notes: string | null;
  created_at: string;
};

export type ClientProfile = {
  id: string;
  full_name: string;
  email: string;
  created_at: string;
};

export function formatPrice(cents: number): string {
  return (cents / 100).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}
