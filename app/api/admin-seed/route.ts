import { NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";

// TEMPORARY one-time ops route. Used once to seed availability slots and to
// clean up e2e test data, then DELETED from the codebase. Protected by a
// long random token that exists only in this file and in the operator's
// session. If you are reading this in the repo history: the route no longer
// exists in production.
const OPS_TOKEN = "c25394bcd0060b6107636d95a100fbb84e6edc89e65936b5";

// Weekly schedule (assumed America/Chicago, UTC-5 in July):
//   Tue/Wed/Thu evenings — 30-min slots at 5:30 / 6:00 / 6:30 / 7:00 pm CT
//   Saturday mornings   — 60-min slots at 9:00 / 10:00 / 11:00 am CT
// Encoded here directly in UTC.
const EVENING_UTC_STARTS = ["22:30", "23:00", "23:30"]; // 5:30-7pm CT, 30-min
const EVENING_LAST = "00:00"; // 7:00pm CT lands on the NEXT UTC day
const SAT_UTC_STARTS = ["14:00", "15:00", "16:00"]; // 9-11am CT, 60-min

function addMinutes(iso: string, mins: number) {
  return new Date(new Date(iso).getTime() + mins * 60000).toISOString();
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body || body.token !== OPS_TOKEN) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const supabase = createServiceRoleClient();
  if (!supabase) {
    return NextResponse.json({ error: "Service role not configured" }, { status: 500 });
  }

  if (body.action === "seed") {
    const { data: coach } = await supabase
      .from("coaches")
      .select("id")
      .eq("slug", "tony")
      .single();
    if (!coach) {
      return NextResponse.json({ error: "Coach not found" }, { status: 404 });
    }

    const rows: { coach_id: string; starts_at: string; ends_at: string }[] = [];
    const now = new Date();

    for (let d = 3; d <= 24; d++) {
      const day = new Date(now.getTime() + d * 86400000);
      const dow = day.getUTCDay();
      const dateStr = day.toISOString().slice(0, 10);

      // Tue(2)/Wed(3)/Thu(4) evenings CT — note 7pm CT is next-day UTC
      if (dow === 2 || dow === 3 || dow === 4) {
        for (const t of EVENING_UTC_STARTS) {
          const starts = `${dateStr}T${t}:00.000Z`;
          rows.push({ coach_id: coach.id, starts_at: starts, ends_at: addMinutes(starts, 30) });
        }
        const nextDay = new Date(day.getTime() + 86400000).toISOString().slice(0, 10);
        const lastStart = `${nextDay}T${EVENING_LAST}:00.000Z`;
        rows.push({ coach_id: coach.id, starts_at: lastStart, ends_at: addMinutes(lastStart, 30) });
      }

      // Saturday mornings CT (Sat = 6 UTC dow for 14:00Z)
      if (dow === 6) {
        for (const t of SAT_UTC_STARTS) {
          const starts = `${dateStr}T${t}:00.000Z`;
          rows.push({ coach_id: coach.id, starts_at: starts, ends_at: addMinutes(starts, 60) });
        }
      }
    }

    // Idempotency: skip rows that already exist at the same start time
    const { data: existing } = await supabase
      .from("availability_slots")
      .select("starts_at")
      .eq("coach_id", coach.id);
    const have = new Set((existing ?? []).map((r) => new Date(r.starts_at).toISOString()));
    const fresh = rows.filter((r) => !have.has(r.starts_at));

    if (fresh.length > 0) {
      const { error } = await supabase.from("availability_slots").insert(fresh);
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
    }
    return NextResponse.json({ ok: true, inserted: fresh.length, skipped: rows.length - fresh.length });
  }

  if (body.action === "cleanup") {
    // Remove e2e test data: bookings, profiles, auth users, lead rows for
    // any email matching e2e-%@example.com; free their slots.
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
