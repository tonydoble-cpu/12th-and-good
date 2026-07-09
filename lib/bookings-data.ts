import { createClient } from "@/lib/supabase/server";
import type { Booking } from "@/lib/types";

/**
 * All of these rely on Supabase RLS (see supabase/schema.sql) to scope
 * results to the signed-in user — a client only ever sees their own
 * bookings, a coach only ever sees bookings against their coach_id. There's
 * no demo-mode fallback here: booking history only exists once Supabase and
 * real accounts are wired up.
 */

export type BookingWithDetails = Booking & {
  session_types: { name: string; duration_minutes: number } | null;
  coaches: { full_name: string; slug: string } | null;
};

export async function getCurrentUserBookings(): Promise<BookingWithDetails[]> {
  const supabase = await createClient();
  if (!supabase) return [];

  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return [];

  const { data, error } = await supabase
    .from("bookings")
    .select("*, session_types(name, duration_minutes), coaches(full_name, slug)")
    .order("starts_at", { ascending: false });

  if (error || !data) return [];
  return data as unknown as BookingWithDetails[];
}

export async function getBookingById(id: string): Promise<BookingWithDetails | null> {
  const supabase = await createClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("bookings")
    .select("*, session_types(name, duration_minutes), coaches(full_name, slug)")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) return null;
  return data as unknown as BookingWithDetails;
}

export async function getCoachBookings(): Promise<BookingWithDetails[]> {
  const supabase = await createClient();
  if (!supabase) return [];

  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return [];

  const { data, error } = await supabase
    .from("bookings")
    .select("*, session_types(name, duration_minutes), coaches(full_name, slug, user_id)")
    .order("starts_at", { ascending: true });

  if (error || !data) return [];
  return data as unknown as BookingWithDetails[];
}
