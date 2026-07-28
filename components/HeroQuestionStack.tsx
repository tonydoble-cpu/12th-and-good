"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Card = { question: string; slug: string };

/**
 * The hero's "kinds of questions we hear" stack — real questions from the
 * 401(k) library, each linking straight to its answer. Cycles by rotating
 * the array every few seconds rather than a full carousel library; five
 * cards visible at a time, oldest fades out the top as a new one settles
 * in at the bottom. Matches the homepage mockup's right-column pattern.
 */
export default function HeroQuestionStack({ cards }: { cards: Card[] }) {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    if (cards.length <= 5) return;
    const id = setInterval(() => {
      setOffset((o) => (o + 1) % cards.length);
    }, 3200);
    return () => clearInterval(id);
  }, [cards.length]);

  const visible = Array.from({ length: Math.min(5, cards.length) }, (_, i) => {
    const card = cards[(offset + i) % cards.length];
    return { ...card, key: `${offset}-${i}` };
  });

  return (
    <div>
      <p className="hero-eyebrow" style={{ color: "var(--hero-cream-muted)" }}>
        The kinds of questions we hear
      </p>
      <p
        className="mt-2 text-[15px] leading-[1.5]"
        style={{ color: "var(--hero-terra)" }}
      >
        Real questions, answered in plain English — free. Tap any one{" "}
        <span aria-hidden>&rarr;</span>
      </p>

      <div className="mt-5 flex flex-col gap-3">
        {visible.map((c) => (
          <Link
            key={c.key}
            href={`/401k-questions/${c.slug}`}
            className="hero-q-card"
          >
            <span
              className="italic"
              style={{ fontFamily: "var(--font-display), Georgia, serif" }}
            >
              &ldquo;{c.question}&rdquo;
            </span>
            <span aria-hidden style={{ color: "var(--hero-cream-muted)" }}>
              &rarr;
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
