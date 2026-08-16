"use client";

import { useState } from "react";
import Link from "next/link";

type Beat = { who: "them" | "coach" | "end"; text: string };
type Convo = { q: string; beats: Beat[] };

/**
 * An interactive, step-through example of what a session actually sounds
 * like. Explicitly illustrative — not a real transcript. That distinction
 * matters here specifically: the site's whole privacy pitch is "nothing is
 * ever recorded or kept," so a demo that could be mistaken for a real
 * session log would undercut the one thing this brand can't afford to
 * undercut. The label below says so directly, every time it's visible.
 */
export default function SessionExcerpt({ convos }: { convos: Convo[] }) {
  const [q, setQ] = useState(0);
  const [step, setStep] = useState(0);

  const convo = convos[q];
  const visible = convo.beats.slice(0, step + 1);
  const atEnd = step >= convo.beats.length - 1;

  function pick(i: number) {
    setQ(i);
    setStep(0);
  }

  return (
    <div>
      <div className="flex flex-wrap gap-[10px]">
        {convos.map((c, i) => (
          <button
            key={c.q}
            onClick={() => pick(i)}
            className={
              "rounded-full border px-4 py-2 text-left text-[13px] leading-[1.3] transition-colors " +
              (i === q
                ? "border-accent bg-accent-tint text-ink"
                : "border-line bg-white text-ink-2 hover:border-ink/25")
            }
          >
            {c.q}
          </button>
        ))}
      </div>

      <div className="mt-6 rounded-2xl border border-line bg-white p-6 md:p-8">
        <div className="flex flex-col gap-4">
          {visible.map((b, i) => {
            if (b.who === "end") {
              return (
                <p
                  key={i}
                  className="mt-2 text-center text-[13px] font-semibold uppercase tracking-[0.06em] text-accent"
                >
                  {b.text}
                </p>
              );
            }
            const isCoach = b.who === "coach";
            return (
              <div
                key={i}
                className={
                  "max-w-[86%] rounded-2xl px-5 py-3.5 text-[14.5px] leading-[1.55] " +
                  (isCoach
                    ? "self-start rounded-tl-sm bg-[#f5f4f1] text-ink"
                    : "self-end rounded-tr-sm bg-ink text-white")
                }
              >
                {b.text}
              </div>
            );
          })}
        </div>

        {!atEnd && (
          <button
            onClick={() => setStep((s) => Math.min(s + 1, convo.beats.length - 1))}
            className="mt-6 inline-flex items-center gap-[9px] rounded-full border border-line px-5 py-2.5 text-[13.5px] font-semibold text-ink transition-all hover:border-ink"
          >
            Continue the conversation <span aria-hidden>&rarr;</span>
          </button>
        )}
        {atEnd && (
          <div className="mt-6 flex flex-wrap items-center gap-[18px]">
            <Link
              href="/coach-ai"
              className="inline-flex items-center gap-[9px] rounded-full bg-ink px-5 py-2.5 text-[13.5px] font-semibold text-white transition-all hover:-translate-y-px"
            >
              Try it with your own question <span aria-hidden>&rarr;</span>
            </Link>
            <button
              onClick={() => setStep(0)}
              className="text-[13.5px] font-semibold text-accent hover:text-accent-hover"
            >
              Replay this one <span aria-hidden>&#8635;</span>
            </button>
          </div>
        )}
      </div>

      <p className="mt-4 text-[12px] italic leading-[1.5] text-muted">
        This example is illustrative, written in the voice we actually use —
        not a real transcript. Real sessions are never recorded, and nothing
        said in one ever leaves the conversation. &ldquo;Try it with your own
        question&rdquo; opens our AI money coach, a separate live tool — not
        a substitute for a real session, but a real, unscripted way to see
        how it thinks.
      </p>
    </div>
  );
}
