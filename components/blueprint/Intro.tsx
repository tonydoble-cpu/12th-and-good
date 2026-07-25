"use client";

import { useEffect, useState } from "react";

// The first thing they see when the ad drops them here. Big serif headline,
// one supporting line, one big button. No nav. No footer. No distraction.

export default function Intro({ onStart }: { onStart: () => void }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 pb-10 pt-8">
      <div
        className={`max-w-[520px] transition-all duration-700 ${
          mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        {/* Small wordmark, no link — this page has one job */}
        <div className="mb-14 flex items-center justify-center gap-[9px]">
          <span className="flex h-[19px] w-[19px] items-center justify-center rounded-[5px] bg-ink">
            <span
              className="h-[7px] w-[7px] rounded-[2px]"
              style={{ background: "var(--accent)", transform: "rotate(45deg)" }}
            />
          </span>
          <span className="font-display text-[16px] font-medium tracking-[-0.01em] text-ink">
            12th & Good
          </span>
        </div>

        <h1 className="text-center font-display text-[36px] font-medium leading-[1.08] tracking-[-0.02em] text-ink md:text-[44px]">
          What&rsquo;s driving your money choices?
        </h1>

        <p className="mx-auto mt-6 max-w-[440px] text-center text-[16px] leading-[1.55] text-ink-2">
          Find your money style — the strength it gives you, and the habit
          that may be holding you back.
        </p>

        <div className="mt-10 flex flex-col items-center gap-3">
          <button
            onClick={onStart}
            className="w-full max-w-[340px] rounded-[11px] bg-accent px-6 py-[15px] text-[15.5px] font-semibold text-white shadow-[0_10px_28px_-14px_rgba(58,90,125,0.85)] transition-all hover:-translate-y-px hover:bg-accent-hover active:translate-y-0"
          >
            Take the quiz — 60 seconds
          </button>
          <p className="text-[12.5px] text-muted">
            8 quick questions. Your Blueprint at the end.
          </p>
        </div>

        {/* The three-line trust bar — earns the click on Instagram */}
        <div className="mt-14 flex flex-col items-center gap-[7px] text-[12.5px] text-muted">
          <div className="flex items-center gap-2">
            <span className="dot" />
            <span>No products sold. Ever.</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="dot" />
            <span>Fee-only, fiduciary coaches only.</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="dot" />
            <span>Coaches who reflect the people they serve.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
