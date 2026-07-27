"use client";

import { useState, useMemo } from "react";
import EmailCapture from "@/components/EmailCapture";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */
type Answer = "agree" | "neutral" | "disagree" | null;

type Question = {
  id: string;
  text: string;
  category: "stress" | "planning" | "benefits" | "debt" | "savings";
  /** Which answer direction indicates a pain point */
  painDirection: "agree" | "disagree";
};

type CategoryMeta = {
  label: string;
  color: string;
  bgColor: string;
  painLabel: string;
  nudge: string;
};

/* ------------------------------------------------------------------ */
/* Data                                                                */
/* ------------------------------------------------------------------ */
const CATEGORIES: Record<string, CategoryMeta> = {
  stress: {
    label: "Financial stress",
    color: "text-rose-700",
    bgColor: "bg-rose-50",
    painLabel: "High financial stress",
    nudge:
      "Financial stress affects everything — sleep, focus, relationships. A coach can help you figure out which piece to tackle first, without judgment.",
  },
  planning: {
    label: "Future planning",
    color: "text-amber-700",
    bgColor: "bg-amber-50",
    painLabel: "No clear financial plan",
    nudge:
      "Most people don't have a financial plan — not because they don't care, but because nobody showed them how. One conversation can change that.",
  },
  benefits: {
    label: "Benefits usage",
    color: "text-blue-700",
    bgColor: "bg-blue-50",
    painLabel: "Underusing employer benefits",
    nudge:
      "You might be leaving money on the table — 401(k) match, HSA, FSA, tuition reimbursement. A coach can walk through what you have and what you're missing.",
  },
  debt: {
    label: "Debt & cash flow",
    color: "text-purple-700",
    bgColor: "bg-purple-50",
    painLabel: "Debt or cash flow pressure",
    nudge:
      "Debt isn't a character flaw — it's a math problem with a human side. A coach can help you build a payoff plan that actually fits your life.",
  },
  savings: {
    label: "Emergency savings",
    color: "text-teal-700",
    bgColor: "bg-teal-50",
    painLabel: "Thin safety net",
    nudge:
      "If an unexpected $1,000 expense would throw things off, you're not alone — 53% of workers are in the same spot. Building a cushion is more doable than most people think.",
  },
};

const QUESTIONS: Question[] = [
  {
    id: "q1",
    text: "I think about money worries during the workday.",
    category: "stress",
    painDirection: "agree",
  },
  {
    id: "q2",
    text: "I have a clear picture of where my money goes each month.",
    category: "planning",
    painDirection: "disagree",
  },
  {
    id: "q3",
    text: "I'm confident I'm getting the full employer match on my 401(k) or retirement plan.",
    category: "benefits",
    painDirection: "disagree",
  },
  {
    id: "q4",
    text: "I sometimes use credit cards for expenses I can't cover with cash.",
    category: "debt",
    painDirection: "agree",
  },
  {
    id: "q5",
    text: "I could handle a $1,000 unexpected expense without borrowing.",
    category: "savings",
    painDirection: "disagree",
  },
  {
    id: "q6",
    text: "I feel confident about my plan for retirement — even if it's far off.",
    category: "planning",
    painDirection: "disagree",
  },
  {
    id: "q7",
    text: "I understand most of the benefits my employer offers (HSA, FSA, EAP, etc.).",
    category: "benefits",
    painDirection: "disagree",
  },
  {
    id: "q8",
    text: "Financial stress has affected my sleep, relationships, or focus at work.",
    category: "stress",
    painDirection: "agree",
  },
  {
    id: "q9",
    text: "I have debt that feels hard to get ahead of.",
    category: "debt",
    painDirection: "agree",
  },
  {
    id: "q10",
    text: "I have at least three months of expenses saved for emergencies.",
    category: "savings",
    painDirection: "disagree",
  },
];

const ANSWER_OPTIONS: { value: Answer; label: string }[] = [
  { value: "agree", label: "That's me" },
  { value: "neutral", label: "Somewhere in between" },
  { value: "disagree", label: "Not really" },
];

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */
export default function WellnessAssessment() {
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [submitted, setSubmitted] = useState(false);
  const [emailCaptured, setEmailCaptured] = useState(false);

  const answeredCount = Object.values(answers).filter((a) => a !== null).length;
  const allAnswered = answeredCount === QUESTIONS.length;

  const results = useMemo(() => {
    if (!allAnswered) return null;

    const categoryScores: Record<string, number> = {};
    const categoryCounts: Record<string, number> = {};

    for (const q of QUESTIONS) {
      const answer = answers[q.id];
      if (!answer) continue;

      if (!categoryCounts[q.category]) {
        categoryCounts[q.category] = 0;
        categoryScores[q.category] = 0;
      }
      categoryCounts[q.category]++;

      // Score: 0 = no pain, 1 = some, 2 = pain
      let score = 0;
      if (q.painDirection === "agree") {
        if (answer === "agree") score = 2;
        else if (answer === "neutral") score = 1;
      } else {
        if (answer === "disagree") score = 2;
        else if (answer === "neutral") score = 1;
      }
      categoryScores[q.category] += score;
    }

    // Normalize to 0-100
    const normalized: { category: string; score: number; meta: CategoryMeta }[] = [];
    for (const cat of Object.keys(categoryScores)) {
      const maxScore = categoryCounts[cat] * 2;
      const pct = maxScore > 0 ? (categoryScores[cat] / maxScore) * 100 : 0;
      normalized.push({ category: cat, score: pct, meta: CATEGORIES[cat] });
    }

    normalized.sort((a, b) => b.score - a.score);

    const overallScore = Math.round(
      100 -
        normalized.reduce((sum, n) => sum + n.score, 0) / normalized.length
    );

    return { categories: normalized, overallScore };
  }, [answers, allAnswered]);

  const handleAnswer = (questionId: string, value: Answer) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = () => {
    if (allAnswered) setSubmitted(true);
  };

  const handleReset = () => {
    setAnswers({});
    setSubmitted(false);
  };

  /* ── Results view ── */
  if (submitted && results) {
    const topPain = results.categories.filter((c) => c.score >= 50);
    const strengths = results.categories.filter((c) => c.score < 50);

    return (
      <div>
        <div className="mb-10">
          <h1 className="font-display text-[32px] font-medium leading-tight text-ink md:text-[38px]">
            <span className="dot" /> Your financial wellness snapshot
          </h1>
        </div>

        {/* Overall score */}
        <div className="mb-8 rounded-2xl border-2 border-accent/30 bg-accent-tint p-8 text-center">
          <p className="text-[14px] font-medium uppercase tracking-[0.12em] text-ink-2">
            Overall wellness score
          </p>
          <p className="mt-2 font-display text-[56px] font-medium text-ink tabular-nums">
            {results.overallScore}
            <span className="text-[24px] text-ink-2">/100</span>
          </p>
          <p className="mt-2 text-[15px] text-ink-2">
            {results.overallScore >= 75
              ? "You're in a solid spot. A coach can help you optimize what's already working."
              : results.overallScore >= 50
              ? "You've got a foundation — there are a few areas where a conversation could make a real difference."
              : "There's a lot going on. The good news: you don't have to figure it all out at once. Start with one thing."}
          </p>
        </div>

        {/* Email gate — show teaser, unlock full breakdown */}
        {!emailCaptured ? (
          <div className="mb-8">
            {/* Teaser: show category names but blur the details */}
            <div className="mb-6 rounded-xl border border-line bg-surface p-6">
              <p className="text-[14px] text-ink-2 mb-3">
                Your results cover {results.categories.length} areas:
              </p>
              <div className="flex flex-wrap gap-2">
                {results.categories.map((c) => (
                  <span
                    key={c.category}
                    className={`rounded-full px-3 py-1 text-[12px] font-medium ${c.meta.bgColor} ${c.meta.color}`}
                  >
                    {c.meta.label}
                  </span>
                ))}
              </div>
            </div>

            <EmailCapture
              heading="See your full breakdown"
              valueProp="Enter your email to unlock your detailed results — which areas need attention, where you're doing well, and what a coach would focus on first."
              source="wellness-assessment"
              onCapture={() => setEmailCaptured(true)}
            />
          </div>
        ) : (
          <>
            {/* Areas of opportunity */}
            {topPain.length > 0 && (
              <div className="mb-8">
                <h2 className="font-display text-[22px] font-medium text-ink mb-4">
                  Where a coach could help most
                </h2>
                <div className="flex flex-col gap-4">
                  {topPain.map((c) => (
                    <div
                      key={c.category}
                      className={`rounded-xl border border-line ${c.meta.bgColor} p-6`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className={`font-display text-[17px] font-medium ${c.meta.color}`}>
                          {c.meta.painLabel}
                        </h3>
                        <span className={`text-[13px] font-medium ${c.meta.color} tabular-nums`}>
                          {Math.round(c.score)}% concern
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-white/60 overflow-hidden mb-3">
                        <div
                          className="h-full rounded-full bg-current transition-all duration-700"
                          style={{
                            width: `${c.score}%`,
                            color:
                              c.category === "stress"
                                ? "#be123c"
                                : c.category === "planning"
                                ? "#b45309"
                                : c.category === "benefits"
                                ? "#1d4ed8"
                                : c.category === "debt"
                                ? "#7e22ce"
                                : "#0f766e",
                          }}
                        />
                      </div>
                      <p className="text-[14px] text-ink-2 leading-relaxed">
                        {c.meta.nudge}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Strengths */}
            {strengths.length > 0 && (
              <div className="mb-8">
                <h2 className="font-display text-[22px] font-medium text-ink mb-4">
                  Where you&rsquo;re doing well
                </h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  {strengths.map((c) => (
                    <div
                      key={c.category}
                      className="rounded-xl border border-line bg-surface p-5"
                    >
                      <div className="flex items-center gap-2">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 text-[11px]">
                          &#10003;
                        </span>
                        <h3 className="text-[15px] font-medium text-ink">
                          {c.meta.label}
                        </h3>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* CTA */}
        <section className="rounded-2xl border border-dashed border-[#ddd7cb] p-8 text-center">
          <h3 className="font-display text-[20px] font-medium text-ink">
            Want to talk through any of this?
          </h3>
          <p className="mt-2 max-w-[460px] mx-auto text-[15px] text-ink-2">
            A coach can help you turn this snapshot into a plan — starting
            with whatever feels most pressing. And the promise stands: if your first session isn't worth it, you don't pay.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <a
              href="/employers"
              className="inline-flex items-center gap-[9px] rounded-[9px] bg-accent px-[19px] py-[10px] text-sm font-semibold text-white shadow-[0_8px_22px_-12px_rgba(58,90,125,0.75)] transition-all hover:-translate-y-px hover:bg-accent-hover"
            >
              See the employer program <span aria-hidden="true">&rarr;</span>
            </a>
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-[9px] rounded-[9px] border border-line px-[19px] py-[10px] text-sm font-semibold text-ink transition-all hover:border-ink hover:bg-white"
            >
              Take it again
            </button>
          </div>
        </section>

        <p className="mt-6 text-[13px] leading-relaxed text-muted">
          This is a self-reflection tool, not a clinical assessment. It&rsquo;s
          meant to help you notice patterns — not diagnose anything. For
          specific advice about your situation, talk to a coach or a licensed
          financial advisor.
        </p>
      </div>
    );
  }

  /* ── Questions view ── */
  return (
    <div>
      <div className="mb-10">
        <h1 className="font-display text-[32px] font-medium leading-tight text-ink md:text-[38px]">
          <span className="dot" /> Financial wellness checkup
        </h1>
        <p className="mt-4 max-w-[640px] text-[16px] leading-relaxed text-ink-2">
          Ten questions, two minutes. This isn&rsquo;t a test — it&rsquo;s a
          way to notice where money feels manageable and where it
          doesn&rsquo;t. Your answers stay on this page and aren&rsquo;t
          stored anywhere.
        </p>
      </div>

      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[13px] font-medium text-ink-2">
            {answeredCount} of {QUESTIONS.length} answered
          </span>
          <span className="text-[13px] text-muted tabular-nums">
            {Math.round((answeredCount / QUESTIONS.length) * 100)}%
          </span>
        </div>
        <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
          <div
            className="h-full rounded-full bg-accent transition-all duration-300"
            style={{
              width: `${(answeredCount / QUESTIONS.length) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Questions */}
      <div className="flex flex-col gap-5">
        {QUESTIONS.map((q, idx) => (
          <div
            key={q.id}
            className={`rounded-xl border p-6 transition-all ${
              answers[q.id]
                ? "border-accent/30 bg-accent-tint/30"
                : "border-line bg-surface"
            }`}
          >
            <p className="text-[15px] font-medium text-ink mb-4">
              <span className="text-muted mr-2 tabular-nums">{idx + 1}.</span>
              {q.text}
            </p>
            <div className="flex flex-wrap gap-2">
              {ANSWER_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => handleAnswer(q.id, opt.value)}
                  className={`rounded-lg border px-4 py-2.5 text-[14px] font-medium transition-all ${
                    answers[q.id] === opt.value
                      ? "border-accent bg-accent text-white"
                      : "border-line bg-white text-ink-2 hover:border-accent/40 hover:text-ink"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Submit */}
      <div className="mt-8 text-center">
        <button
          onClick={handleSubmit}
          disabled={!allAnswered}
          className="inline-flex items-center gap-[9px] rounded-[9px] bg-accent px-[25px] py-[14px] text-[15px] font-semibold text-white shadow-[0_8px_22px_-12px_rgba(58,90,125,0.75)] transition-all hover:-translate-y-px hover:bg-accent-hover disabled:opacity-40 disabled:hover:translate-y-0"
        >
          See my results <span aria-hidden="true">&rarr;</span>
        </button>
        {!allAnswered && (
          <p className="mt-3 text-[13px] text-muted">
            Answer all {QUESTIONS.length} questions to see your results.
          </p>
        )}
      </div>
    </div>
  );
}
