import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/account";

  if (code) {
    const supabase = await createClient();
    if (supabase) {
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);

      if (!error && data.user) {
        // First sign-in: make sure a client_profiles row exists so the
        // account page and bookings.client_id foreign key have somewhere
        // to point. Coaches get their profile row seeded manually today
        // (single-coach POC) rather than through this path.
        await supabase.from("client_profiles").upsert(
          {
            id: data.user.id,
            email: data.user.email,
          },
          { onConflict: "id", ignoreDuplicates: true }
        );
      }
    }
  }

  return NextResponse.redirect(`${origin}${next}`);
}
