"use client";

import Link from "next/link";

type Card = { question: string; slug: string };

/**
 * The hero's "kinds of questions we hear" stack — real questions from the
 * 401(k) library, each linking straight to its answer.
 *
 * Previous version swapped all 5 visible cards at once on a setInterval —
 * a hard jump-cut, no transition. This is a continuous CSS marquee instead:
 * the full list is rendered twice back-to-back and the track translates by
 * exactly one copy's height on an infinite linear loop, so it reads as one
 * smooth, unbroken scroll rather than a series of jumps. Pure CSS transform
 * — no JS timers, no layout thrash. Pauses on hover/focus so a question can
 * actually be read and clicked, and respects prefers-reduced-motion.
 */
export default function HeroQuestionStack({ cards }: { cards: Card[] }) {
  if (cards.length === 0) return null;

  // Duplicate the list so translating by -50% of the doubled track lands
  // exactly back on frame 1 — the loop point is invisible.
  const track = [...cards, ...cards];
  // Slower with more questions in the library, but never sluggish or rushed.
  const durationSeconds = Math.max(24, cards.length * 4.5);

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

      <div
        className="hero-q-scroll mt-5"
        style={{ ["--hero-q-duration" as string]: `${durationSeconds}s` }}
      >
        <div className="hero-q-track">
          {track.map((c, i) => (
            <Link
              key={`${c.slug}-${i}`}
              href={`/401k-questions/${c.slug}`}
              className="hero-q-card"
              tabIndex={i < cards.length ? 0 : -1}
              aria-hidden={i >= cards.length}
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
    </div>
  );
}
