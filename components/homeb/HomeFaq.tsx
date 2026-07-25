"use client";

import { useState } from "react";

// Grow closes with a plain FAQ accordion — the questions a skeptic is
// already asking. Ours answer the four we hear most, in our voice.

const FAQS = [
  {
    q: "Is this financial advice?",
    a: "It's coaching — guidance, education, and a written plan you act on yourself. Your coach never takes control of your money, never sells you an investment, and never earns a commission from anything you decide. That's the whole point.",
  },
  {
    q: "How does 12th & Good Street make money?",
    a: "You pay your coach for the session — that's 100% of how they're paid. Any platform fee is flat and disclosed, shown as its own line — never hidden in the price. We never earn from products, referrals, or your data. The full model is on our How We Make Money page.",
  },
  {
    q: "What actually happens in a session?",
    a: "You tell us what you're working on when you book, so Tony shows up prepared. Sixty minutes over video with your real numbers and real questions, and you leave with a short written plan in plain language — steps you can start the same week.",
  },
  {
    q: "What if it's not worth it?",
    a: "Then you don't pay. That's the 12th & Good promise, in writing: if your first session isn't worth every dollar, say so and we tear up the bill.",
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
