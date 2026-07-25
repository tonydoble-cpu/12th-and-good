"use client";

import { useEffect, useState } from "react";
import type { QuizAnswer, QuizQuestion } from "@/lib/archetypes";

type Props = {
  question: QuizQuestion;
  currentStep: number;
  totalSteps: number;
  /** Called with the chosen answer(s). Single-select questions submit one;
   * multi-select questions submit everything picked when Next is tapped. */
  onSubmit: (answers: QuizAnswer[]) => void;
  accent?: string; // Optional archetype accent, used post-gate
  subtle?: boolean; // Use a subtler style for post-gate personalization questions
};

// One question per screen, big touch targets, no forms, no radio buttons.
// Three-dot progress at the top so it feels short. Cards animate in for
// forward momentum — Instagram natives expect this.
//
// Two interaction modes:
//   single (default): tap an answer → brief acknowledge → auto-advance.
//   multi (question.multi): taps toggle; a Next button advances. Used for
//   the coach-fit and trust questions where forcing one choice loses truth
//   (people want a coach who gets them AND knows their stuff).

export default function QuestionCard({
  question,
  currentStep,
  totalSteps,
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
  const accentColor = accent ?? "var(--accent)";

  function handlePick(answer: QuizAnswer) {
    if (isMulti) {
      setSelected((prev) => {
        const next = new Set(prev);
        if (next.has(answer.id)) {
          next.delete(answer.id);
        } else {
          next.add(answer.id);
        }
        return next;
      });
      return;
    }
    if (picking) return;
    setPicking(answer.id);
    // Brief pause so the tap feels acknowledged before advancing
    setTimeout(() => onSubmit([answer]), 240);
  }

  function handleNext() {
    const picked = question.answers.filter((a) => selected.has(a.id));
    if (picked.length === 0) return;
    onSubmit(picked);
  }

  return (
    <div className="flex min-h-screen flex-col px-6 pb-8 pt-6">
      {/* Header: dots + step label */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-[7px]">
          {Array.from({ length: totalSteps }).map((_, i) => {
            const active = i < currentStep;
            return (
              <span
                key={i}
                className="h-[7px] rounded-full transition-all duration-300"
                style={{
                  width: active ? 22 : 7,
                  background: active ? accentColor : "rgba(0,0,0,0.12)",
                }}
              />
            );
          })}
        </div>
        <span className="text-[11.5px] font-medium uppercase tracking-[0.08em] text-muted">
          {currentStep} of {totalSteps}
        </span>
      </div>

      {/* Question */}
      <div
        className={`mt-14 flex-1 transition-all duration-500 ${
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

        {/* Next button — multi-select only */}
        {isMulti && (
          <div className="mt-8 flex flex-col items-center gap-[8px] pb-2">
            <button
              onClick={handleNext}
              disabled={selected.size === 0}
              className="w-full max-w-[420px] rounded-[11px] px-6 py-[15px] text-[15.5px] font-semibold text-white shadow-[0_10px_28px_-14px_rgba(0,0,0,0.55)] transition-all hover:-translate-y-px active:translate-y-0 disabled:opacity-40 disabled:shadow-none disabled:hover:translate-y-0"
              style={{ background: accentColor }}
            >
              Next →
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
