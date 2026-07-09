import { createClient } from "@/lib/supabase/server";
import {
  DEMO_AVAILABILITY,
  DEMO_COACH,
  DEMO_SESSION_TYPES,
} from "@/lib/mock-data";
import type { AvailabilitySlot, Coach, SessionType } from "@/lib/types";

/**
 * Server-side reads for the coach/booking pages. Every function falls back
 * to lib/mock-data.ts when Supabase isn't configured yet, so the POC is
 * fully browsable before real infra exists.
 */

export async function getCoachBySlug(slug: string): Promise<Coach | null> {
  const supabase = await createClient();
  if (!supabase) {
    return slug === DEMO_COACH.slug ? DEMO_COACH : null;
  }

  const { data, error } = await supabase
    .from("coaches")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error || !data) return null;
  return data as Coach;
}

export async function getSessionTypes(coachId: string): Promise<SessionType[]> {
  const supabase = await createClient();
  if (!supabase) {
    return coachId === DEMO_COACH.id ? DEMO_SESSION_TYPES : [];
  }

  const { data, error } = await supabase
    .from("session_types")
    .select("*")
    .eq("coach_id", coachId)
    .eq("active", true)
    .order("price_cents", { ascending: true });

  if (error || !data) return [];
  return data as SessionType[];
}

export async function getOpenAvailability(
  coachId: string
): Promise<AvailabilitySlot[]> {
  const supabase = await createClient();
  if (!supabase) {
    return coachId === DEMO_COACH.id ? DEMO_AVAILABILITY : [];
  }

  const { data, error } = await supabase
    .from("availability_slots")
    .select("*")
    .eq("coach_id", coachId)
    .eq("is_booked", false)
    .gte("starts_at", new Date().toISOString())
    .order("starts_at", { ascending: true });

  if (error || !data) return [];
  return data as AvailabilitySlot[];
}

export async function getAllUpcomingAvailability(
  coachId: string
): Promise<AvailabilitySlot[]> {
  const supabase = await createClient();
  if (!supabase) {
    return coachId === DEMO_COACH.id ? DEMO_AVAILABILITY : [];
  }

  const { data, error } = await supabase
    .from("availability_slots")
    .select("*")
    .eq("coach_id", coachId)
    .gte("starts_at", new Date().toISOString())
    .order("starts_at", { ascending: true });

  if (error || !data) return [];
  return data as AvailabilitySlot[];
}

export async function getCoachForUser(userId: string): Promise<Coach | null> {
  const supabase = await createClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("coaches")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (error || !data) return null;
  return data as Coach;
}

export async function getSessionTypeById(
  id: string
): Promise<SessionType | null> {
  const supabase = await createClient();
  if (!supabase) {
    return DEMO_SESSION_TYPES.find((s) => s.id === id) ?? null;
  }

  const { data, error } = await supabase
    .from("session_types")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) return null;
  return data as SessionType;
}

export async function getAvailabilitySlotById(
  id: string
): Promise<AvailabilitySlot | null> {
  const supabase = await createClient();
  if (!supabase) {
    return DEMO_AVAILABILITY.find((s) => s.id === id) ?? null;
  }

  const { data, error } = await supabase
    .from("availability_slots")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) return null;
  return data as AvailabilitySlot;
}
