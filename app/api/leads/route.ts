import { NextRequest, NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

/**
 * POST /api/leads
 * Captures an email + source for the nurture funnel.
 *
 * In demo mode (no Supabase), it accepts the request and logs it
 * so the front-end flow works seamlessly during development.
 */

type LeadPayload = {
  email: string;
  source: string;
};

// In-memory store for demo mode — resets on server restart, which is fine
const demoLeads: LeadPayload[] = [];

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as LeadPayload;

    if (!body.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
      return NextResponse.json(
        { error: "Valid email required" },
        { status: 400 }
      );
    }

    if (!body.source) {
      return NextResponse.json(
        { error: "Source required" },
        { status: 400 }
      );
    }

    if (isSupabaseConfigured) {
      // Real mode — insert into Supabase
      const { createClient } = await import("@supabase/supabase-js");
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );

      const { error } = await supabase.from("leads").upsert(
        {
          email: body.email.toLowerCase().trim(),
          source: body.source,
          captured_at: new Date().toISOString(),
        },
        { onConflict: "email" }
      );

      if (error) {
        console.error("Supabase lead insert error:", error);
        return NextResponse.json(
          { error: "Failed to save — try again" },
          { status: 500 }
        );
      }
    } else {
      // Demo mode — store in memory and log
      const lead = {
        email: body.email.toLowerCase().trim(),
        source: body.source,
      };
      demoLeads.push(lead);
      console.log(`[demo] Lead captured: ${lead.email} from ${lead.source}`);
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Invalid request" },
      { status: 400 }
    );
  }
}
