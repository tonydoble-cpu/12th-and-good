"use client";

import { useState } from "react";
import type { Archetype, QuizAnswer } from "@/lib/archetypes";

// Gate 2 — the email trade. Framing is critical: they're not paying with
// their email to see their "score." They're paying to see the next
// chapter of a story they're already in.

export default function EmailGate({
  archetype,
  onCaptured,
  preGateAnswers,
}: {
  archetype: Archetype;
  onCaptured: (email: string) => void;
  preGateAnswers: QuizAnswer[];
}) {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Enter a valid email so we can send your Blueprint.");
      return;
    }

    setSubmitting(true);
    try {
      // Fire and forget lead capture — even if it fails we let the user
      // continue, because breaking the funnel loses more than a missed lead.
      const res = await fetch("/api/blueprint", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          firstName: firstName.trim() || null,
          archetype: archetype.id,
          preGateAnswers: preGateAnswers.map((a) => a.id),
          stage: "gate1",
        }),
      });
      if (!res.ok) {
        // Log but continue — the funnel matters more than the log
        console.warn("Lead capture non-ok:", res.status);
      }
    } catch (err) {
      console.warn("Lead capture threw:", err);
    }
    onCaptured(email.trim().toLowerCase());
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 pb-10 pt-8">
      <div className="w-full max-w-[500px]">
        {/* Archetype anchor */}
        <div className="mb-6 flex justify-center">
          <div
            className="flex items-center gap-2 rounded-full px-[13px] py-[6px] text-[12px] font-medium text-white"
            style={{ background: archetype.accent }}
          >
            <span
              className="h-[6px] w-[6px] rounded-[2px]"
              style={{
                background: "rgba(255,255,255,0.9)",
                transform: "rotate(45deg)",
              }}
            />
            <span>{archetype.name} — Blueprint pending</span>
          </div>
        </div>

        <h2 className="text-center font-display text-[30px] font-medium leading-[1.1] tracking-[-0.02em] text-ink md:text-[36px]">
          Your Blueprint is ready.
        </h2>
        <p className="mx-auto mt-4 max-w-[430px] text-center text-[15.5px] leading-[1.55] text-ink-2">
          You&rsquo;re at 7th &amp; Good — five blocks from your full
          Blueprint: what shaped your money style, what you need right now,
          and three moves for your next 90 days.
        </p>

        <form onSubmit={submit} className="mt-8 flex flex-col gap-3">
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="First name (optional)"
            className="w-full rounded-[11px] border border-line bg-surface px-[16px] py-[13px] text-[15px] text-ink outline-none transition-colors placeholder:text-muted focus:border-accent"
            autoComplete="given-name"
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
            required
            autoFocus
            className="w-full rounded-[11px] border border-line bg-surface px-[16px] py-[13px] text-[15px] text-ink outline-none transition-colors placeholder:text-muted focus:border-accent"
            autoComplete="email"
            inputMode="email"
          />
          {error && (
            <p className="text-[13px] text-rose-700">{error}</p>
          )}
          <button
            type="submit"
            disabled={submitting}
            className="mt-1 w-full rounded-[11px] px-6 py-[15px] text-[15.5px] font-semibold text-white shadow-[0_10px_28px_-14px_rgba(0,0,0,0.55)] transition-all hover:-translate-y-px active:translate-y-0 disabled:opacity-70"
            style={{ background: archetype.accent }}
          >
            {submitting ? "Sending…" : "Get my Blueprint →"}
          </button>
        </form>

        <div className="mt-6 flex flex-col items-center gap-[6px] text-[12px] text-muted">
          <p>Five short questions to personalize it, then it&rsquo;s yours.</p>
          <p>No spam. Unsubscribe any time.</p>
        </div>
      </div>
    </div>
  );
}
