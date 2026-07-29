"use client";

import { useState } from "react";

type Testimonial = { quote: string; name: string; role: string };

/** Real quotes from real clients and participants — not the illustrative
 * copy used in WhatPeopleBring/SessionExcerpt. Manual-only navigation (no
 * autoplay): auto-advancing testimonial carousels are a common
 * accessibility complaint, and there's no real benefit here to trading
 * that away for four quotes. */
export default function TestimonialCarousel({ items }: { items: Testimonial[] }) {
  const [i, setI] = useState(0);
  const t = items[i];

  return (
    <div className="mx-auto max-w-[720px] text-center">
      <p className="font-display text-[22px] md:text-[27px] italic leading-[1.5] text-ink">
        &ldquo;{t.quote}&rdquo;
      </p>
      <p className="mt-6 text-[14px] font-semibold text-ink">{t.name}</p>
      {t.role && <p className="text-[13px] text-muted">{t.role}</p>}

      <div className="mt-8 flex items-center justify-center gap-5">
        <button
          onClick={() => setI((v) => (v - 1 + items.length) % items.length)}
          aria-label="Previous testimonial"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink-2 transition-colors hover:border-ink hover:text-ink"
        >
          &larr;
        </button>
        <span className="text-[12px] text-muted">
          {i + 1} / {items.length}
        </span>
        <button
          onClick={() => setI((v) => (v + 1) % items.length)}
          aria-label="Next testimonial"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink-2 transition-colors hover:border-ink hover:text-ink"
        >
          &rarr;
        </button>
      </div>
    </div>
  );
}
