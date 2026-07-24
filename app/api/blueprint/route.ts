import { NextRequest, NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { ARCHETYPES, type ArchetypeId } from "@/lib/archetypes";

// POST /api/blueprint
//
// Called three times during the funnel:
//   stage=gate1     → email captured, archetype known, pre-gate answers stored
//   stage=gate2     → post-gate answers added, triggers Blueprint delivery email
//   stage=waitlist  → user opted into the coach-match waitlist
//
// In demo mode (no Supabase), everything goes to console + in-memory. When
// Supabase is wired we upsert into a `blueprint_leads` table keyed on email.

type BlueprintPayload = {
  email: string;
  firstName?: string | null;
  archetype?: ArchetypeId;
  preGateAnswers?: string[];
  postGateAnswers?: { id: string; label: string }[];
  stage: "gate1" | "gate2" | "waitlist";
};

// Demo store — resets on server restart, fine for dev
type DemoRecord = {
  email: string;
  firstName?: string | null;
  archetype?: ArchetypeId;
  preGateAnswers?: string[];
  postGateAnswers?: { id: string; label: string }[];
  waitlist?: boolean;
  gate1At?: string;
  gate2At?: string;
  waitlistAt?: string;
};
const demoStore = new Map<string, DemoRecord>();

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as BlueprintPayload;

    if (!body.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
      return NextResponse.json(
        { error: "Valid email required" },
        { status: 400 }
      );
    }
    if (!body.stage) {
      return NextResponse.json(
        { error: "Stage required" },
        { status: 400 }
      );
    }

    const email = body.email.toLowerCase().trim();
    const now = new Date().toISOString();

    if (isSupabaseConfigured) {
      const { createClient } = await import("@supabase/supabase-js");
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY ||
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );

      const payload: Record<string, unknown> = {
        email,
        updated_at: now,
      };
      if (body.firstName) payload.first_name = body.firstName;
      if (body.archetype) payload.archetype = body.archetype;
      if (body.preGateAnswers) {
        payload.pre_gate_answers = body.preGateAnswers;
        payload.gate1_at = now;
      }
      if (body.postGateAnswers) {
        payload.post_gate_answers = body.postGateAnswers;
        payload.gate2_at = now;
      }
      if (body.stage === "waitlist") {
        payload.waitlist = true;
        payload.waitlist_at = now;
      }

      const { error } = await supabase
        .from("blueprint_leads")
        .upsert(payload, { onConflict: "email" });

      if (error) {
        console.error("Supabase blueprint upsert error:", error);
        return NextResponse.json({ error: "Save failed" }, { status: 500 });
      }
    } else {
      const existing = demoStore.get(email) ?? { email };
      const record: DemoRecord = { ...existing };
      if (body.firstName) record.firstName = body.firstName;
      if (body.archetype) record.archetype = body.archetype;
      if (body.preGateAnswers) {
        record.preGateAnswers = body.preGateAnswers;
        record.gate1At = now;
      }
      if (body.postGateAnswers) {
        record.postGateAnswers = body.postGateAnswers;
        record.gate2At = now;
      }
      if (body.stage === "waitlist") {
        record.waitlist = true;
        record.waitlistAt = now;
      }
      demoStore.set(email, record);

      const archetypeName = record.archetype
        ? ARCHETYPES[record.archetype].name
        : "?";
      console.log(
        `[blueprint:demo] ${body.stage.padEnd(9)} ${email.padEnd(30)} ${archetypeName}`
      );
    }

    // At gate2 we would trigger the email sequence via HubSpot / ConvertKit /
    // Resend. For now, log the intended trigger so we know when it fires and
    // add a small acknowledgement in the response.
    let queuedEmail: string | null = null;
    if (body.stage === "gate2" && body.archetype) {
      queuedEmail = `blueprint:${body.archetype}`;
      console.log(
        `[blueprint:demo] queued email ${queuedEmail} to ${email}`
      );
    }
    if (body.stage === "waitlist") {
      console.log(`[blueprint:demo] waitlist notify → ${email}`);
    }

    return NextResponse.json({ ok: true, queuedEmail });
  } catch (err) {
    console.error("Blueprint API error:", err);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
