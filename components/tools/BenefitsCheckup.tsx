"use client";

import { useState, useMemo } from "react";

/* ------------------------------------------------------------------ */
/*  Types & data                                                       */
/* ------------------------------------------------------------------ */

type Response = "using" | "not-yet" | "not-sure" | null;

interface Benefit {
  id: string;
  title: string;
  why: string;
}

const benefits: Benefit[] = [
  {
    id: "401k-match",
    title: "401(k) or 403(b) employer match",
    why: "If your employer matches contributions and you’re not contributing enough to get the full match, that’s essentially part of your compensation you’re not collecting.",
  },
  {
    id: "health-plan-fit",
    title: "Health insurance plan fit",
    why: "It’s worth checking once a year whether your plan still fits how you actually use healthcare. A high-deductible plan with an HSA might save you money — or it might not. Depends on your situation.",
  },
  {
    id: "hsa",
    title: "HSA (Health Savings Account)",
    why: "If you’re on a high-deductible health plan, an HSA is one of the most tax-advantaged accounts available — contributions, growth, and qualified withdrawals are all tax-free. Some employers contribute to it, too.",
  },
  {
    id: "fsa",
    title: "FSA (Flexible Spending Account)",
    why: "A use-it-or-lose-it account for medical or dependent care expenses. If you have predictable costs — prescriptions, glasses, daycare — this can save you real money in taxes.",
  },
  {
    id: "life-insurance",
    title: "Life insurance",
    why: "Most employers offer a basic policy at no cost (often 1–2x your salary). You might also have the option to buy more at a group rate, which is usually cheaper than buying it on your own.",
  },
  {
    id: "disability",
    title: "Disability insurance",
    why: "Short-term and long-term disability protect your income if you can’t work. A lot of people don’t realize they have it — or what it actually covers.",
  },
  {
    id: "eap",
    title: "EAP (Employee Assistance Program)",
    why: "Free, confidential sessions — usually for counseling, legal questions, or financial guidance. Most people who have an EAP don’t know it exists.",
  },
  {
    id: "dental-vision",
    title: "Dental & vision preventive visits",
    why: "Most plans cover preventive visits — cleanings, eye exams — at 100%. If you’re not using them, you’re paying for coverage and not getting the value.",
  },
  {
    id: "tuition",
    title: "Tuition or education reimbursement",
    why: "Some employers will pay for courses, certifications, or degree programs. The amounts vary, but it’s worth checking — it’s one of the more underused benefits.",
  },
  {
    id: "commuter",
    title: "Commuter or transit benefits",
    why: "Pre-tax dollars for transit passes or parking. Small monthly savings, but it adds up over a year.",
  },
];

/* ------------------------------------------------------------------ */
/*  Progress ring                                                      */
/* ------------------------------------------------------------------ */

function ProgressRing({
  value,
  max,
  size = 80,
  stroke = 6,
}: {
  value: number;
  max: number;
  size?: number;
  stroke?: number;
}) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = max > 0 ? value / max : 0;
  const offset = circumference * (1 - pct);

  return (
    <svg
      width={size}
      height={size}
      className="shrink-0"
      aria-hidden="true"
    >
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth={stroke}
        className="text-line"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        className="text-accent transition-all duration-500"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
      <text
        x="50%"
        y="50%"
        dominantBaseline="central"
        textAnchor="middle"
        className="fill-ink text-[18px] font-semibold"
      >
        {value}/{max}
      </text>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Benefit card                                                       */
/* ------------------------------------------------------------------ */

function BenefitCard({
  benefit,
  response,
  onRespond,
  index,
}: {
  benefit: Benefit;
  response: Response;
  onRespond: (r: Response) => void;
  index: number;
}) {
  const buttons: { value: Response; label: string }[] = [
    { value: "using", label: "Using it" },
    { value: "not-yet", label: "Not yet" },
    { value: "not-sure", label: "Not sure" },
  ];

  const borderClass =
    response === "using"
      ? "border-accent bg-accent-tint/40"
      : response === "not-yet"
        ? "border-amber-400/60 bg-amber-50/30"
        : response === "not-sure"
          ? "border-line bg-surface"
          : "border-line bg-surface";

  return (
    <div
      className={`rounded-xl border p-5 transition-all duration-300 ${borderClass}`}
    >
      <div className="flex items-start gap-3">
        <span className="mt-px flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/10 text-[12px] font-semibold text-accent">
          {index + 1}
        </span>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-[16px] font-semibold text-ink">
              {benefit.title}
            </h3>
            {response === "using" && (
              <svg
                className="h-4 w-4 shrink-0 text-accent"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
                aria-label="Using this benefit"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            )}
          </div>

          <p className="mt-1.5 text-[14px] leading-relaxed text-ink-2">
            {benefit.why}
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            {buttons.map((btn) => {
              const isActive = response === btn.value;
              let btnStyle: string;

              if (isActive && btn.value === "using") {
                btnStyle =
                  "bg-accent text-white border-accent shadow-sm";
              } else if (isActive && btn.value === "not-yet") {
                btnStyle =
                  "bg-amber-100 text-amber-800 border-amber-300 shadow-sm";
              } else if (isActive && btn.value === "not-sure") {
                btnStyle =
                  "bg-stone-100 text-ink-2 border-stone-300 shadow-sm";
              } else {
                btnStyle =
                  "bg-white text-ink-2 border-line hover:border-accent/40 hover:text-ink";
              }

              return (
                <button
                  key={btn.value}
                  onClick={() =>
                    onRespond(isActive ? null : btn.value)
                  }
                  className={`rounded-lg border px-3.5 py-1.5 text-[13px] font-medium transition-all ${btnStyle}`}
                >
                  {btn.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Results panel                                                      */
/* ------------------------------------------------------------------ */

function ResultsPanel({
  responses,
}: {
  responses: Record<string, Response>;
}) {
  const answered = Object.values(responses).filter((r) => r !== null);
  const usingCount = answered.filter((r) => r === "using").length;
  const notYetCount = answered.filter((r) => r === "not-yet").length;
  const notSureCount = answered.filter(
    (r) => r === "not-sure"
  ).length;
  const total = benefits.length;

  if (answered.length === 0) return null;

  let summary: string;
  if (notYetCount >= 3) {
    summary =
      "There might be some opportunities here worth looking into.";
  } else if (notSureCount >= 3) {
    summary =
      "It could be worth a quick check with HR or your benefits portal — some of these might apply to you.";
  } else if (usingCount >= total * 0.6) {
    summary =
      "Looks like you’re using most of what’s available. That’s a strong position to be in.";
  } else {
    summary =
      "A few answers in — keep going to get the full picture.";
  }

  return (
    <div className="rounded-xl border border-line bg-surface p-6">
      <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
        <ProgressRing value={usingCount} max={total} />

        <div className="flex-1 text-center sm:text-left">
          <h3 className="text-[17px] font-semibold text-ink">
            You&rsquo;re using {usingCount} of {total} benefits
          </h3>

          <div className="mt-3 flex flex-wrap justify-center gap-4 sm:justify-start">
            {notYetCount > 0 && (
              <span className="inline-flex items-center gap-1.5 text-[13px] text-amber-700">
                <span className="inline-block h-2 w-2 rounded-full bg-amber-400" />
                {notYetCount} opportunit{notYetCount === 1 ? "y" : "ies"}
              </span>
            )}
            {notSureCount > 0 && (
              <span className="inline-flex items-center gap-1.5 text-[13px] text-ink-2">
                <span className="inline-block h-2 w-2 rounded-full bg-stone-300" />
                {notSureCount} worth looking into
              </span>
            )}
          </div>

          <p className="mt-3 text-[14px] leading-relaxed text-ink-2">
            {summary}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

export default function BenefitsCheckup() {
  const [responses, setResponses] = useState<Record<string, Response>>(
    () =>
      Object.fromEntries(benefits.map((b) => [b.id, null]))
  );

  const handleRespond = (id: string, value: Response) => {
    setResponses((prev) => ({ ...prev, [id]: value }));
  };

  const answeredCount = useMemo(
    () => Object.values(responses).filter((r) => r !== null).length,
    [responses]
  );

  return (
    <div className="mx-auto max-w-[720px]">
      {/* Header */}
      <h1 className="font-display text-[32px] font-medium leading-tight text-ink md:text-[38px]">
        Benefits checkup
      </h1>
      <p className="mt-4 max-w-[600px] text-[16px] leading-relaxed text-ink-2">
        Most people have access to more through their employer than they
        realize &mdash; and some of those benefits are genuinely valuable. This
        is a quick walkthrough to help you see what you might be leaving on the
        table.
      </p>

      {/* Results (sticky, updates in real-time) */}
      {answeredCount > 0 && (
        <div className="sticky top-4 z-10 mt-8">
          <ResultsPanel responses={responses} />
        </div>
      )}

      {/* Benefit cards */}
      <div className="mt-8 space-y-4">
        {benefits.map((benefit, i) => (
          <BenefitCard
            key={benefit.id}
            benefit={benefit}
            response={responses[benefit.id]}
            onRespond={(value) => handleRespond(benefit.id, value)}
            index={i}
          />
        ))}
      </div>

      {/* Closing note */}
      <p className="mt-10 text-[13px] leading-relaxed text-muted">
        Not every benefit is available at every employer, and some of these
        might not apply to your situation. The point is to make sure you&rsquo;re
        not missing something that&rsquo;s already there for you.
      </p>

      {/* CTA */}
      <section className="mt-12 rounded-2xl border border-dashed border-[#ddd7cb] p-8 text-center">
        <h3 className="font-display text-[20px] font-medium text-ink">
          Want to go through this with someone?
        </h3>
        <p className="mx-auto mt-2 max-w-[420px] text-[15px] text-ink-2">
          A coach can help you understand what you have, what you might be
          missing, and whether any changes make sense. And the promise stands: if your first session isn't worth it, you don't pay.
        </p>
        <a
          href="/employers"
          className="mt-5 inline-flex items-center gap-[9px] rounded-[9px] bg-accent px-[19px] py-[10px] text-sm font-semibold text-white shadow-[0_8px_22px_-12px_rgba(58,90,125,0.75)] transition-all hover:-translate-y-px hover:bg-accent-hover"
        >
          See the employer program <span aria-hidden="true">&rarr;</span>
        </a>
      </section>
    </div>
  );
}
