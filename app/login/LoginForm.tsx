"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { Button } from "@/components/Button";

export default function LoginForm() {
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/account";
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );
  const [errorMessage, setErrorMessage] = useState("");

  if (!isSupabaseConfigured) {
    return (
      <div className="rounded-2xl border border-border-subtle bg-surface p-6">
        <p className="font-display font-semibold text-foreground mb-2">
          Accounts aren&apos;t connected yet
        </p>
        <p className="text-sm text-foreground-secondary leading-relaxed">
          This POC is running without Supabase credentials, so sign-in is
          disabled for now. Add <code>NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
          <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> to <code>.env.local</code>{" "}
          to turn accounts on. See README.md.
        </p>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    const supabase = createClient();
    if (!supabase) return;

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(
          next
        )}`,
      },
    });

    if (error) {
      setErrorMessage(error.message);
      setStatus("error");
    } else {
      setStatus("sent");
    }
  }

  if (status === "sent") {
    return (
      <div className="rounded-2xl border border-border-subtle bg-surface p-6">
        <p className="font-display font-semibold text-foreground mb-2">
          Check your email
        </p>
        <p className="text-sm text-foreground-secondary">
          We sent a sign-in link to <strong>{email}</strong>. Click it to
          continue.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-border-subtle bg-surface p-6"
    >
      <label className="block text-sm font-medium text-foreground mb-2">
        Email address
      </label>
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        className="w-full rounded-lg border border-border-subtle px-4 py-2.5 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-primary/40"
      />
      <Button type="submit" disabled={status === "sending"} className="w-full">
        {status === "sending" ? "Sending link..." : "Email me a sign-in link"}
      </Button>
      {status === "error" && (
        <p className="text-sm text-red-600 mt-3">{errorMessage}</p>
      )}
      <p className="text-xs text-foreground-tertiary mt-4">
        No password needed. We&apos;ll email you a one-click link.
      </p>
    </form>
  );
}
