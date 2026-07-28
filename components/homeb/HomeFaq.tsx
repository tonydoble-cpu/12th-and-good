"use client";

import { useState } from "react";

// Grow closes with a plain FAQ accordion — the questions a skeptic is
// already asking. Ours answer the four we hear most, in our voice.

const FAQS = [
  {
    q: "Is this financial advice?",
    a: "It's coaching and education — plain-language guidance and a written plan your people act on themselves. We never take control of anyone's money, never sell an investment, and never earn a commission from anything they decide. That's the whole point.",
  },
  {
    q: "What does it cost us, exactly?",
    a: "One flat annual fee, sized to your headcount — not a per-employee meter that grows as people use it. Pricing is published, not quoted behind a form: see the calculator on our employers page.",
  },
  {
    q: "What do you need from our HR or IT team to start?",
    a: "Nothing to integrate, no employee data file, no system connection, no IT review. We reach out directly — by phone, email, and Zoom — and keep reaching out.",
  },
  {
    q: "What do we see on our end?",
    a: "Aggregate participation and themes, reported quarterly. Never a name, a number, or a situation — and no theme is reported unless at least five people raised it.",
  },
];

export default function HomeFaq() {
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
              on ? "border-line bg-surface" : "border-line bg-white hover:border-ink/25"
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
