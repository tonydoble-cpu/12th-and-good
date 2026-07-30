"use client";

import { useState } from "react";

// The questions a benefits/HR buyer actually needs answered before they can
// bring this to procurement — contract length, continuity, differentiation
// from an existing EAP, what reporting really shows, the fee-only claim,
// and billing mechanics. Same honest, no-absolutes voice as the homepage
// FAQ — this just answers the B2B-specific version of "prove it."

const FAQS = [
  {
    q: "Do we have to sign a long-term contract?",
    a: "No. Programs run on an annual basis, and pricing is published up front — see the calculator above. There's no multi-year term required to get started.",
  },
  {
    q: "What happens if my coach becomes unavailable?",
    a: "Because there's no long-term contract, you're never locked into paying for a service that isn't running — you can pause or exit with no penalty. The coach bench grows alongside the program, and any transition would be handled directly with you, never silently.",
  },
  {
    q: "How is this different from our EAP?",
    a: "An EAP is usually a general-purpose hotline, capped at a handful of sessions, with money as one topic among many. This is a named coach whose only focus is money, without a session cap built around a crisis model. If you already offer an EAP, this runs alongside it rather than replacing it.",
  },
  {
    q: "What do we actually see on our end?",
    a: "Aggregate participation and themes, reported quarterly. Never a name, a number, or a situation — and no theme is reported unless at least five people raised it, so no individual is ever identifiable.",
  },
  {
    q: "If coaches don't earn commission, how do you make money?",
    a: "The flat annual fee is the entire business model. A coach is paid the same whether someone acts on their advice or not — that's what fee-only means. See exactly what's never sold above.",
  },
  {
    q: "How does billing work?",
    a: "One invoice, once a year, sized to your published tier. No per-session billing, no monthly reconciliation, and no per-user meter that grows as people use it.",
  },
];

export default function EmployerFaq() {
  const [open, setOpen] = useState(0);
  return (
    <div className="flex flex-col gap-3">
      {FAQS.map((f, i) => {
        const on = open === i;
        return (
          <button
            key={f.q}
            onClick={() => setOpen(on ? -1 : i)}
            className={`rounded-[14px] border px-[20px] py-[16px] text-left transition-colors ${
              on ? "border-line bg-white" : "border-line bg-surface hover:border-ink/25"
            }`}
          >
            <span className="flex items-center justify-between gap-4">
              <span className="text-[15.5px] font-semibold text-ink">{f.q}</span>
              <span
                className="text-[18px] text-muted transition-transform duration-200"
                style={{ transform: on ? "rotate(45deg)" : "none" }}
                aria-hidden
              >
                +
              </span>
            </span>
            {on && (
              <span className="mt-3 block text-[14.5px] leading-[1.65] text-ink-2">
                {f.a}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
