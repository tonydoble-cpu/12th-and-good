import { NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";

// Standing operations endpoint for the project's AI lead. Token-gated;
// used same-origin from an authenticated operator session to run the
// jobs a founding-stage platform needs daily:
//   - pending-briefs: new bookings + client write-ups + their quiz history,
//     so the AI can prep Tony before each session
//   - set-slots: replace future unbooked availability with a schedule
//   - set-session-active: turn a session type on/off (e.g. retire the
//     free intro)
//   - cleanup-e2e: remove e2e-*@example.com test data
//
// Security: requires OPS_TOKEN from the environment. No fallback — a
// hardcoded secret in source is a burned secret the moment it's committed,
// full stop. If OPS_TOKEN isn't set, this endpoint is unreachable (fails
// closed) rather than falling back to a known value. Set OPS_TOKEN in
// Vercel before relying on this endpoint again.
function authorized(token: unknown) {
  const expected = process.env.OPS_TOKEN;
  if (!expected) return false;
  return typeof token === "string" && token === expected;
}

type SlotSpec = { starts_at: string; minutes: number };

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body || !authorized(body.token)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  const supabase = createServiceRoleClient();
  if (!supabase) {
    return NextResponse.json({ error: "Service role not configured" }, { status: 500 });
  }

  // ---- New bookings with intake + quiz context, for AI session prep ----
  if (body.action === "pending-briefs") {
    const sinceIso =
      typeof body.since === "string"
        ? body.since
        : new Date(0).toISOString();

    const { data: bookings } = await supabase
      .from("bookings")
      .select("id, status, starts_at, price_cents, coach_notes, created_at, client_id, session_type_id")
      .gte("created_at", sinceIso)
      .order("created_at", { ascending: false })
      .limit(50);

    const out = [];
    for (const b of bookings ?? []) {
      const { data: profile } = await supabase
        .from("client_profiles")
        .select("email, full_name")
        .eq("id", b.client_id)
        .maybeSingle();
      const { data: st } = await supabase
        .from("session_types")
        .select("name, duration_minutes")
        .eq("id", b.session_type_id)
        .maybeSingle();
      let lead = null;
      if (profile?.email) {
        const { data } = await supabase
          .from("blueprint_leads")
          .select("archetype, pre_gate_answers, post_gate_answers, waitlist")
          .eq("email", profile.email)
          .maybeSingle();
        lead = data;
      }
      out.push({
        bookingId: b.id,
        status: b.status,
        startsAt: b.starts_at,
        createdAt: b.created_at,
        session: st?.name ?? null,
        client: { email: profile?.email ?? null, name: profile?.full_name ?? null },
        intake: b.coach_notes,
        quiz: lead,
      });
    }
    return NextResponse.json({ ok: true, bookings: out });
  }

  // ---- Replace future unbooked slots with a new schedule ----
  if (body.action === "set-slots" && Array.isArray(body.slots)) {
    const { data: coach } = await supabase
      .from("coaches")
      .select("id")
      .eq("slug", "tony")
      .single();
    if (!coach) return NextResponse.json({ error: "Coach not found" }, { status: 404 });

    const { data: removed } = await supabase
      .from("availability_slots")
      .delete()
      .eq("coach_id", coach.id)
      .eq("is_booked", false)
      .gte("starts_at", new Date().toISOString())
      .select("id");

    const rows = (body.slots as SlotSpec[]).map((s) => ({
      coach_id: coach.id,
      starts_at: s.starts_at,
      ends_at: new Date(new Date(s.starts_at).getTime() + s.minutes * 60000).toISOString(),
    }));
    const { error } = await supabase.from("availability_slots").insert(rows);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ ok: true, removed: removed?.length ?? 0, inserted: rows.length });
  }

  // ---- Toggle a session type ----
  if (body.action === "set-session-active" && typeof body.name === "string") {
    const { data, error } = await supabase
      .from("session_types")
      .update({ active: Boolean(body.active) })
      .ilike("name", body.name)
      .select("id, name, active");
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true, updated: data });
  }

  // ---- Remove e2e test data ----
  if (body.action === "cleanup-e2e") {
    const pattern = "e2e-%@example.com";
    const { data: profiles } = await supabase
      .from("client_profiles")
      .select("id, email")
      .like("email", pattern);

    let bookingsRemoved = 0;
    for (const p of profiles ?? []) {
      const { data: bookings } = await supabase
        .from("bookings")
        .select("id, slot_id")
        .eq("client_id", p.id);
      for (const b of bookings ?? []) {
        await supabase.from("availability_slots").update({ is_booked: false }).eq("id", b.slot_id);
        await supabase.from("bookings").delete().eq("id", b.id);
        bookingsRemoved++;
      }
      await supabase.from("client_profiles").delete().eq("id", p.id);
      await supabase.auth.admin.deleteUser(p.id).catch(() => {});
    }

    const { data: leads } = await supabase
      .from("blueprint_leads")
      .select("email")
      .like("email", pattern);
    for (const l of leads ?? []) {
      await supabase.from("blueprint_leads").delete().eq("email", l.email);
    }

    return NextResponse.json({
      ok: true,
      profilesRemoved: (profiles ?? []).length,
      bookingsRemoved,
      leadsRemoved: (leads ?? []).length,
    });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
