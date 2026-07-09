"use server";

import { revalidatePath } from "next/cache";
import { createClient, createServiceRoleClient } from "@/lib/supabase/server";

/**
 * Confirms the signed-in user actually owns a coach row before letting them
 * write anything. Every action below calls this first — Server Actions are
 * public endpoints, so "the button isn't shown to the wrong person" is not
 * enough on its own.
 */
async function requireCoachId(): Promise<string> {
  const supabase = await createClient();
  if (!supabase) throw new Error("Supabase isn't configured.");

  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) throw new Error("Not signed in.");

  const { data: coach } = await supabase
    .from("coaches")
    .select("id")
    .eq("user_id", userData.user.id)
    .maybeSingle();

  if (!coach) throw new Error("This account isn't linked to a coach profile.");
  return coach.id;
}

export async function addSessionType(formData: FormData) {
  const coachId = await requireCoachId();
  const service = createServiceRoleClient();
  if (!service) throw new Error("Service role client isn't configured.");

  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const durationMinutes = Number(formData.get("duration_minutes"));
  const priceDollars = Number(formData.get("price_dollars"));

  if (!name || !durationMinutes || !priceDollars) {
    throw new Error("Fill in name, duration, and price.");
  }

  await service.from("session_types").insert({
    coach_id: coachId,
    name,
    description,
    duration_minutes: durationMinutes,
    price_cents: Math.round(priceDollars * 100),
  });

  revalidatePath("/coach");
  revalidatePath("/tony");
}

export async function addAvailabilitySlot(formData: FormData) {
  const coachId = await requireCoachId();
  const service = createServiceRoleClient();
  if (!service) throw new Error("Service role client isn't configured.");

  const startsAt = String(formData.get("starts_at") ?? "");
  const durationMinutes = Number(formData.get("duration_minutes") ?? 60);
  if (!startsAt) throw new Error("Pick a start time.");

  const start = new Date(startsAt);
  const end = new Date(start.getTime() + durationMinutes * 60000);

  await service.from("availability_slots").insert({
    coach_id: coachId,
    starts_at: start.toISOString(),
    ends_at: end.toISOString(),
  });

  revalidatePath("/coach");
  revalidatePath("/book");
}

export async function updateBookingNotes(bookingId: string, notes: string) {
  await requireCoachId();
  const service = createServiceRoleClient();
  if (!service) throw new Error("Service role client isn't configured.");

  await service.from("bookings").update({ coach_notes: notes }).eq("id", bookingId);
  revalidatePath("/coach");
  revalidatePath(`/session/${bookingId}`);
}

export async function updateBookingZoomLink(bookingId: string, zoomJoinUrl: string) {
  await requireCoachId();
  const service = createServiceRoleClient();
  if (!service) throw new Error("Service role client isn't configured.");

  await service.from("bookings").update({ zoom_join_url: zoomJoinUrl }).eq("id", bookingId);
  revalidatePath("/coach");
  revalidatePath(`/session/${bookingId}`);
}
