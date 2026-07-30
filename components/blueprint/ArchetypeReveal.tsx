"use client";

import { useEffect, useState } from "react";
import type { Archetype } from "@/lib/archetypes";

// Gate 1 reveal — they've been seen. Strength + blind spot only. The rest
// of the five-component structure is held behind the email gate.
//
// This screen exists to earn one thing: enough emotional weight to make the
// email trade feel worth it. Big serif name. Tagline. Strength. One-line
// blind spot with a soft edge (not accusatory).

export default function ArchetypeReveal({
  archetype,
  onContinue,
}: {
  archetype: Archetype;
  onContinue: () => void;
}) {
  const [phase, setPhase] = useState<"reveal" | "content">("reveal");

  useEffect(() => {
    // Respect prefers-reduced-motion: skip the full-color flash entirely.
    // (Also: one tester read the sudden full-screen red as a "DECLINED"
    // alert — shorter flash softens that for everyone.)
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setPhase("content");
      return;
    }
    const t = setTimeout(() => setPhase("content"), 900);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className="flex min-h-screen flex-col items-center justify-between px-6 pb-8 pt-10 transition-colors duration-700"
      style={{
        background:
          phase === "reveal" ? archetype.accent : "var(--background)",
      }}
    >
      {phase === "reveal" ? (
        // Full-color flash — the moment they realize this is different
        <div className="flex flex-1 flex-col items-center justify-center text-center text-white">
          <span className="text-[12px] font-semibold uppercase tracking-[0.16em] text-white/60">
            {"7th & Good · three blocks in"}
          </span>
          <span className="mt-3 text-[13px] font-medium uppercase tracking-[0.14em] text-white/70">
            Right now, you&rsquo;re leading with
          </span>
          <h1
            className="mt-4 font-display text-[52px] font-medium leading-[1.05] tracking-[-0.02em] md:text-[64px]"
            style={{ animation: "fadeUp 0.9s cubic-bezier(0.2,0.6,0.2,1) both" }}
          >
            {archetype.name}
          </h1>
          <p
            className="mt-4 max-w-[380px] text-[16px] leading-[1.4] text-white/85"
            style={{
              animation:
                "fadeUp 0.9s cubic-bezier(0.2,0.6,0.2,1) 0.25s both",
            }}
          >
            {archetype.tagline}
          </p>
        </div>
      ) : (
        <div
          className="w-full max-w-[560px] flex-1 flex flex-col"
          style={{ animation: "fadeUp 0.6s cubic-bezier(0.2,0.6,0.2,1) both" }}
        >
          {/* Small chip that anchors the archetype */}
          <div
            className="mx-auto flex items-center gap-2 rounded-full px-[13px] py-[6px] text-[12px] font-medium text-white"
            style={{ background: archetype.accent }}
          >
            <span
              className="h-[6px] w-[6px] rounded-[2px]"
              style={{ background: "rgba(255,255,255,0.9)", transform: "rotate(45deg)" }}
            />
            <span>Your money style right now</span>
          </div>

          <h1 className="mt-6 text-center font-display text-[40px] font-medium leading-[1.05] tracking-[-0.02em] text-ink md:text-[48px]">
            {archetype.name}
          </h1>
          <p className="mt-3 text-center text-[16px] leading-[1.45] text-ink-2">
            {archetype.tagline}
          </p>

          {/* Strength */}
          <div className="mt-10 rounded-[16px] border border-line bg-surface p-[22px]">
            <div className="flex items-center gap-2">
              <span
                className="h-[8px] w-[8px] rounded-[2px]"
                style={{ background: archetype.accent, transform: "rotate(45deg)" }}
              />
              <span className="text-[11.5px] font-semibold uppercase tracking-[0.1em] text-ink-2">
                Your natural strength
              </span>
            </div>
            <p className="mt-3 text-[15px] leading-[1.55] text-ink">
              {archetype.strength}
            </p>
          </div>

          {/* Blind spot — soft edge, not accusatory */}
          <div className="mt-3 rounded-[16px] border border-line bg-surface p-[22px]">
            <div className="flex items-center gap-2">
              <span
                className="h-[8px] w-[8px] rounded-[2px]"
                style={{ background: "rgba(0,0,0,0.35)", transform: "rotate(45deg)" }}
              />
              <span className="text-[11.5px] font-semibold uppercase tracking-[0.1em] text-ink-2">
                The pattern to watch
              </span>
            </div>
            <p className="mt-3 text-[15px] leading-[1.55] text-ink-2">
              {archetype.blindSpot}
            </p>
          </div>

          {/* CTA */}
          <div className="mt-8 mb-2 flex flex-col items-center gap-[10px]">
            <button
              onClick={onContinue}
              className="w-full max-w-[420px] rounded-[11px] px-6 py-[15px] text-[15.5px] font-semibold text-white shadow-[0_10px_28px_-14px_rgba(0,0,0,0.55)] transition-all hover:-translate-y-px active:translate-y-0"
              style={{ background: archetype.accent }}
            >
              See your full Blueprint →
            </button>
            <p className="max-w-[340px] text-center text-[12px] leading-[1.45] text-muted">
              Five blocks left on the walk: what shaped it, what you need
              right now, and three moves made just for you.
            </p>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeUp {
          0% {
            opacity: 0;
            transform: translateY(12px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
