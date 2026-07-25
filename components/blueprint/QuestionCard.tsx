"use client";

import { useEffect, useState } from "react";
import type { QuizAnswer, QuizQuestion } from "@/lib/archetypes";
import StreetProgress from "./StreetProgress";

type Props = {
  question: QuizQuestion;
  /** This question's position on the whole walk (1–8 across both gates). */
  blockNumber: number;
  /** Called with the chosen answer(s). Single-select questions submit one;
   * multi-select questions submit everything picked when Next is tapped. */
  onSubmit: (answers: QuizAnswer[]) => void;
  accent?: string; // Optional archetype accent, used post-gate
  subtle?: boolean; // Subtler heading for post-gate personalization questions
};

// One question per screen. The quiz is a walk up Good Street (see
// StreetProgress): answering advances you a block, and the dot visibly
// walks before the next screen arrives. Three interaction styles keep
// eight screens from feeling like the same test page:
//   cards — tall tap targets for the emotional questions (the big three)
//   scale — one connected row of brackets (income)
//   chips — compact two-column grid (life stage, goals)
//   multi — pick-all-that-fit cards + Next (coach fit, trust)

export default function QuestionCard({
  question,
  blockNumber,
  onSubmit,
  accent,
  subtle = false,
}: Props) {
  const [mounted, setMounted] = useState(false);
  const [picking, setPicking] = useState<string | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  useEffect(() => {
    setMounted(false);
    setSelected(new Set());
    setPicking(null);
    const t = setTimeout(() => setMounted(true), 20);
    return () => clearTimeout(t);
  }, [question.id]);

  const isMulti = Boolean(question.multi);
  const ui = question.ui ?? "cards";
  const accentColor = accent ?? "var(--accent)";

  // Standing at block-1; answering walks you to blockNumber.
  const position = picking !== null ? blockNumber : blockNumber - 1;

  function advance(answers: QuizAnswer[]) {
    // Let the dot walk the block before the screen changes.
    setPicking(answers[answers.length - 1]?.id ?? "multi");
    setTimeout(() => onSubmit(answers), 420);
  }

  function handlePick(answer: QuizAnswer) {
    if (isMulti) {
      setSelected((prev) => {
        const next = new Set(prev);
        if (next.has(answer.id)) next.delete(answer.id);
        else next.add(answer.id);
        return next;
      });
      return;
    }
    if (picking) return;
    advance([answer]);
  }

  function handleNext() {
    if (picking) return;
    const picked = question.answers.filter((a) => selected.has(a.id));
    if (picked.length === 0) return;
    advance(picked);
  }

  return (
    <div className="flex min-h-screen flex-col px-6 pb-8 pt-6">
      <div className="mx-auto w-full max-w-[760px]">
        <StreetProgress position={position} accent={accent} />
      </div>

      {/* Question */}
      <div
        className={`mx-auto mt-12 w-full max-w-[760px] flex-1 transition-all duration-500 ${
          mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
        }`}
      >
        <h2
          className={`font-display font-medium leading-[1.15] tracking-[-0.02em] text-ink ${
            subtle ? "text-[24px] md:text-[28px]" : "text-[28px] md:text-[34px]"
          }`}
        >
          {question.prompt}
        </h2>
        {isMulti && (
          <p className="mt-3 text-[14px] font-medium text-ink-2">
            Pick all that fit.
          </p>
        )}

        {/* ---- SCALE: one connected row of brackets ---- */}
        {ui === "scale" && (
          <div className="mt-9">
            <div className="flex flex-col gap-[6px] sm:flex-row sm:gap-0 sm:overflow-hidden sm:rounded-[13px] sm:border sm:border-line sm:bg-surface">
              {question.answers.map((answer, i) => {
                const isPicked = picking === answer.id;
                return (
                  <button
                    key={answer.id}
                    type="button"
                    onClick={() => handlePick(answer)}
                    disabled={picking !== null}
                    className={`flex-1 px-3 py-[16px] text-center text-[14px] font-semibold transition-all duration-150 max-sm:rounded-[13px] max-sm:border max-sm:border-line max-sm:bg-surface ${
                      i > 0 ? "sm:border-l sm:border-line" : ""
                    }`}
                    style={{
                      background: isPicked ? accentColor : undefined,
                      color: isPicked ? "#fff" : "var(--ink)",
                      opacity: picking !== null && !isPicked ? 0.4 : 1,
                    }}
                  >
                    {answer.label}
                  </button>
                );
              })}
            </div>
            <div className="mt-[9px] flex justify-between text-[11px] uppercase tracking-[0.08em] text-muted">
              <span>Lower</span>
              <span>Just a ballpark — no receipts needed</span>
              <span>Higher</span>
            </div>
          </div>
        )}

        {/* ---- CHIPS: compact two-column grid ---- */}
        {ui === "chips" && (
          <div className="mt-9 grid grid-cols-1 gap-[10px] sm:grid-cols-2">
            {question.answers.map((answer, i) => {
              const isPicked = picking === answer.id;
              const isDimmed = picking !== null && !isPicked;
              return (
                <button
                  key={answer.id}
                  type="button"
                  onClick={() => handlePick(answer)}
                  disabled={picking !== null}
                  className={`rounded-full border px-[18px] py-[13px] text-left text-[14.5px] font-medium leading-[1.35] text-ink transition-all duration-200 ${
                    isPicked
                      ? "border-transparent text-white shadow-[0_8px_20px_-12px_rgba(0,0,0,0.5)]"
                      : isDimmed
                        ? "border-line/60 bg-surface opacity-40"
                        : "border-line bg-surface hover:border-ink/30 hover:-translate-y-[1px]"
                  }`}
                  style={{
                    background: isPicked ? accentColor : undefined,
                    transitionDelay: mounted && !picking ? `${i * 35}ms` : "0ms",
                    opacity: !mounted && !picking ? 0 : undefined,
                  }}
                >
                  {answer.label}
                </button>
              );
            })}
          </div>
        )}

        {/* ---- CARDS (default) + MULTI ---- */}
        {ui === "cards" && (
          <div className="mt-8 flex flex-col gap-3">
            {question.answers.map((answer, i) => {
              const isPicked = isMulti
                ? selected.has(answer.id)
                : picking === answer.id;
              const isDimmed = !isMulti && picking !== null && !isPicked;
              return (
                <button
                  key={answer.id}
                  onClick={() => handlePick(answer)}
                  disabled={!isMulti && picking !== null}
                  aria-pressed={isMulti ? isPicked : undefined}
                  className={`group relative w-full rounded-[13px] border bg-surface px-[18px] py-[15px] text-left text-[15px] leading-[1.4] text-ink transition-all duration-200 ${
                    isPicked
                      ? "border-accent bg-accent-tint text-ink shadow-[0_8px_20px_-12px_rgba(58,90,125,0.55)]"
                      : isDimmed
                        ? "border-line/60 opacity-45"
                        : "border-line hover:border-ink/25 hover:-translate-y-[1px] hover:shadow-[0_6px_16px_-12px_rgba(0,0,0,0.35)]"
                  }`}
                  style={{
                    transitionDelay:
                      mounted && !picking && selected.size === 0
                        ? `${i * 40}ms`
                        : "0ms",
                    transform:
                      !mounted && !picking ? "translateY(6px)" : undefined,
                    opacity: !mounted && !picking ? 0 : undefined,
                  }}
                >
                  <span className="flex items-start gap-3">
                    <span
                      className="mt-[6px] h-[7px] w-[7px] flex-none rounded-[2px] transition-colors duration-150"
                      style={{
                        background: isPicked ? accentColor : "rgba(0,0,0,0.25)",
                        transform: "rotate(45deg)",
                      }}
                    />
                    <span className="flex-1">{answer.label}</span>
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* Next button — multi-select only */}
        {isMulti && (
          <div className="mt-8 flex flex-col items-center gap-[8px] pb-2">
            <button
              onClick={handleNext}
              disabled={selected.size === 0 || picking !== null}
              className="w-full max-w-[420px] rounded-[11px] px-6 py-[15px] text-[15.5px] font-semibold text-white shadow-[0_10px_28px_-14px_rgba(0,0,0,0.55)] transition-all hover:-translate-y-px active:translate-y-0 disabled:opacity-40 disabled:shadow-none disabled:hover:translate-y-0"
              style={{ background: accentColor }}
            >
              Next block &rarr;
            </button>
            <p className="text-[12.5px] text-muted">
              {selected.size === 0
                ? "Tap everything that sounds like you"
                : `${selected.size} picked`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
