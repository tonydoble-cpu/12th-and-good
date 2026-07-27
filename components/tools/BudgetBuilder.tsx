"use client";

import { useState, useMemo, useCallback } from "react";

/* ------------------------------------------------------------------ */
/*  Types & helpers                                                    */
/* ------------------------------------------------------------------ */

interface BudgetItem {
  key: string;
  label: string;
  value: number;
}

interface BudgetSection {
  id: string;
  title: string;
  color: string;
  headerBg: string;
  items: BudgetItem[];
}

const fmt = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const pct = (value: number, total: number): string => {
  if (total <= 0) return "0";
  return Math.round((value / total) * 100).toString();
};

/* ------------------------------------------------------------------ */
/*  Initial state                                                      */
/* ------------------------------------------------------------------ */

const INCOME_ITEMS: BudgetItem[] = [
  { key: "takeHome", label: "Take-home pay", value: 0 },
  { key: "sideIncome", label: "Side income / freelance", value: 0 },
  { key: "otherIncome", label: "Other income", value: 0 },
];

const NEEDS_ITEMS: BudgetItem[] = [
  { key: "housing", label: "Housing (rent/mortgage)", value: 0 },
  { key: "utilities", label: "Utilities", value: 0 },
  { key: "groceries", label: "Groceries", value: 0 },
  { key: "transportation", label: "Transportation", value: 0 },
  { key: "insurance", label: "Insurance (health, auto, etc.)", value: 0 },
  { key: "debtMin", label: "Minimum debt payments", value: 0 },
  { key: "childcare", label: "Childcare / dependents", value: 0 },
];

const WANTS_ITEMS: BudgetItem[] = [
  { key: "dining", label: "Dining out", value: 0 },
  { key: "entertainment", label: "Entertainment & subscriptions", value: 0 },
  { key: "shopping", label: "Shopping", value: 0 },
  { key: "personalCare", label: "Personal care", value: 0 },
  { key: "otherWants", label: "Other", value: 0 },
];

const SAVINGS_ITEMS: BudgetItem[] = [
  { key: "emergency", label: "Emergency fund", value: 0 },
  { key: "retirement", label: "Retirement (beyond employer match)", value: 0 },
  { key: "extraDebt", label: "Extra debt payments", value: 0 },
  { key: "otherSavings", label: "Other savings / goals", value: 0 },
];

/* ------------------------------------------------------------------ */
/*  Section input group                                                */
/* ------------------------------------------------------------------ */

function SectionGroup({
  section,
  onUpdate,
}: {
  section: BudgetSection;
  onUpdate: (sectionId: string, key: string, value: number) => void;
}) {
  return (
    <div className="rounded-xl border border-line bg-surface overflow-hidden">
      <div className={`px-5 py-3 ${section.headerBg}`}>
        <h3 className={`text-[14px] font-semibold ${section.color}`}>
          {section.title}
        </h3>
      </div>
      <div className="divide-y divide-line/50">
        {section.items.map((item) => (
          <div
            key={item.key}
            className="flex items-center justify-between gap-4 px-5 py-3"
          >
            <label
              htmlFor={`${section.id}-${item.key}`}
              className="text-[14px] text-ink-2 min-w-0 flex-1"
            >
              {item.label}
            </label>
            <div className="relative w-[140px] flex-shrink-0">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[14px] text-muted">
                $
              </span>
              <input
                id={`${section.id}-${item.key}`}
                type="number"
                min={0}
                className="w-full rounded-lg border border-line bg-white py-2 pl-7 pr-3 text-right text-[14px] text-ink placeholder:text-muted/60 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                placeholder="0"
                value={item.value || ""}
                onChange={(e) => {
                  const v = parseFloat(e.target.value);
                  onUpdate(section.id, item.key, isNaN(v) ? 0 : v);
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Breakdown bar                                                      */
/* ------------------------------------------------------------------ */

function BreakdownBar({
  needs,
  wants,
  savings,
  income,
}: {
  needs: number;
  wants: number;
  savings: number;
  income: number;
}) {
  const total = needs + wants + savings;
  if (income <= 0 || total <= 0) {
    return (
      <div className="h-4 w-full rounded-full bg-gray-100" />
    );
  }

  const needsW = Math.round((needs / income) * 100);
  const wantsW = Math.round((wants / income) * 100);
  const savingsW = Math.round((savings / income) * 100);

  // Cap at 100% for display
  const totalW = needsW + wantsW + savingsW;
  const scale = totalW > 100 ? 100 / totalW : 1;

  return (
    <div className="flex h-4 w-full overflow-hidden rounded-full bg-gray-100">
      {needsW > 0 && (
        <div
          className="bg-[#6b8a9e] transition-all duration-300"
          style={{ width: `${needsW * scale}%` }}
          title={`Needs: ${needsW}%`}
        />
      )}
      {wantsW > 0 && (
        <div
          className="bg-[#c4956a] transition-all duration-300"
          style={{ width: `${wantsW * scale}%` }}
          title={`Wants: ${wantsW}%`}
        />
      )}
      {savingsW > 0 && (
        <div
          className="bg-[#3a5a7d] transition-all duration-300"
          style={{ width: `${savingsW * scale}%` }}
          title={`Savings: ${savingsW}%`}
        />
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Guideline comparison                                               */
/* ------------------------------------------------------------------ */

function GuidelineRow({
  label,
  amount,
  percentage,
  guideline,
  dotColor,
}: {
  label: string;
  amount: number;
  percentage: string;
  guideline: number;
  dotColor: string;
}) {
  const pctNum = parseInt(percentage, 10);
  const over = pctNum > guideline;

  return (
    <div className="py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`inline-block h-2.5 w-2.5 rounded-full ${dotColor}`} />
          <span className="text-[14px] text-ink-2">{label}</span>
        </div>
        <span className="text-[15px] font-medium text-ink">
          {fmt.format(amount)}
        </span>
      </div>
      <div className="mt-1 flex items-center gap-2 pl-[18px]">
        <span className={`text-[13px] ${over ? "text-[#b55a30]" : "text-ink-2"}`}>
          {percentage}% of income
        </span>
        <span className="text-[13px] text-muted">
          (guideline: {guideline}%)
        </span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function BudgetBuilder() {
  const [income, setIncome] = useState<BudgetItem[]>(INCOME_ITEMS);
  const [needs, setNeeds] = useState<BudgetItem[]>(NEEDS_ITEMS);
  const [wants, setWants] = useState<BudgetItem[]>(WANTS_ITEMS);
  const [savings, setSavings] = useState<BudgetItem[]>(SAVINGS_ITEMS);

  const updateSection = useCallback(
    (sectionId: string, key: string, value: number) => {
      const setter =
        sectionId === "income"
          ? setIncome
          : sectionId === "needs"
            ? setNeeds
            : sectionId === "wants"
              ? setWants
              : setSavings;

      setter((prev) =>
        prev.map((item) => (item.key === key ? { ...item, value } : item)),
      );
    },
    [],
  );

  /* ---- Computed totals ---- */

  const totalIncome = useMemo(
    () => income.reduce((s, i) => s + i.value, 0),
    [income],
  );
  const totalNeeds = useMemo(
    () => needs.reduce((s, i) => s + i.value, 0),
    [needs],
  );
  const totalWants = useMemo(
    () => wants.reduce((s, i) => s + i.value, 0),
    [wants],
  );
  const totalSavings = useMemo(
    () => savings.reduce((s, i) => s + i.value, 0),
    [savings],
  );

  const remaining = totalIncome - totalNeeds - totalWants - totalSavings;

  /* ---- Section objects ---- */

  const sections: BudgetSection[] = useMemo(
    () => [
      {
        id: "income",
        title: "Income",
        color: "text-ink",
        headerBg: "bg-gray-50",
        items: income,
      },
      {
        id: "needs",
        title: "Needs (essentials)",
        color: "text-[#4a7082]",
        headerBg: "bg-[#e8eef2]",
        items: needs,
      },
      {
        id: "wants",
        title: "Wants",
        color: "text-[#9a6d42]",
        headerBg: "bg-[#f4ebe0]",
        items: wants,
      },
      {
        id: "savings",
        title: "Savings & debt paydown",
        color: "text-accent",
        headerBg: "bg-accent-tint",
        items: savings,
      },
    ],
    [income, needs, wants, savings],
  );

  /* ---------------------------------------------------------------- */
  /*  Render                                                           */
  /* ---------------------------------------------------------------- */

  return (
    <div className="mx-auto max-w-5xl">
      {/* Heading */}
      <h1 className="font-display text-[32px] font-semibold leading-snug text-ink md:text-[38px]">
        Monthly budget builder
      </h1>

      <p className="mt-4 max-w-[600px] text-[16px] leading-relaxed text-ink-2">
        This isn&rsquo;t about making a perfect budget &mdash; it&rsquo;s about
        getting a clear picture of where your money goes each month. Once you can
        see it, you can decide if anything feels off.
      </p>

      {/* Two-column layout */}
      <div className="mt-10 flex flex-col gap-8 lg:flex-row">
        {/* Left column: inputs (70%) */}
        <div className="flex-1 space-y-6 lg:max-w-[70%]">
          {sections.map((section) => (
            <SectionGroup
              key={section.id}
              section={section}
              onUpdate={updateSection}
            />
          ))}
        </div>

        {/* Right column: sticky summary (30%) */}
        <div className="lg:w-[30%]">
          <div className="lg:sticky lg:top-8">
            <div className="rounded-xl border border-line bg-surface p-6">
              <h2 className="font-display text-[18px] font-medium text-ink">
                Summary
              </h2>

              {/* Total income */}
              <div className="mt-5 flex items-center justify-between border-b border-line pb-3">
                <span className="text-[14px] font-medium text-ink-2">
                  Monthly income
                </span>
                <span className="text-[16px] font-semibold text-ink">
                  {fmt.format(totalIncome)}
                </span>
              </div>

              {/* Category breakdowns */}
              <div className="divide-y divide-line/50">
                <GuidelineRow
                  label="Needs"
                  amount={totalNeeds}
                  percentage={pct(totalNeeds, totalIncome)}
                  guideline={50}
                  dotColor="bg-[#6b8a9e]"
                />
                <GuidelineRow
                  label="Wants"
                  amount={totalWants}
                  percentage={pct(totalWants, totalIncome)}
                  guideline={30}
                  dotColor="bg-[#c4956a]"
                />
                <GuidelineRow
                  label="Savings"
                  amount={totalSavings}
                  percentage={pct(totalSavings, totalIncome)}
                  guideline={20}
                  dotColor="bg-[#3a5a7d]"
                />
              </div>

              {/* Breakdown bar */}
              <div className="mt-4 mb-4">
                <BreakdownBar
                  needs={totalNeeds}
                  wants={totalWants}
                  savings={totalSavings}
                  income={totalIncome}
                />
                <div className="mt-2 flex items-center justify-center gap-4 text-[11px] text-muted">
                  <span className="flex items-center gap-1">
                    <span className="inline-block h-2 w-2 rounded-full bg-[#6b8a9e]" />
                    Needs
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="inline-block h-2 w-2 rounded-full bg-[#c4956a]" />
                    Wants
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="inline-block h-2 w-2 rounded-full bg-[#3a5a7d]" />
                    Savings
                  </span>
                </div>
              </div>

              {/* Remaining */}
              <div className="rounded-lg bg-gray-50 px-4 py-3">
                <div className="flex items-center justify-between">
                  <span className="text-[14px] font-medium text-ink-2">
                    Remaining
                  </span>
                  <span
                    className={`text-[16px] font-semibold ${
                      remaining >= 0 ? "text-[#3d7a5a]" : "text-[#b55a30]"
                    }`}
                  >
                    {fmt.format(remaining)}
                  </span>
                </div>
                {remaining < 0 && totalIncome > 0 && (
                  <p className="mt-1 text-[12px] text-[#b55a30]">
                    Your spending and savings exceed your income by{" "}
                    {fmt.format(Math.abs(remaining))}.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Guideline note */}
      <p className="mt-10 max-w-[640px] text-[14px] leading-relaxed text-ink-2">
        The 50/30/20 guideline is a starting point, not a rule. If your housing
        costs are 40% of your income, that doesn&rsquo;t mean you&rsquo;re doing
        it wrong &mdash; it might just be where you live. The point is seeing the
        whole picture so you can make choices that feel right for you.
      </p>

      {/* ---- CTA ---- */}
      <section className="mt-12 rounded-2xl border border-dashed border-[#ddd7cb] p-8 text-center">
        <h3 className="font-display text-[20px] font-medium text-ink">
          Want a second pair of eyes?
        </h3>
        <p className="mt-2 max-w-[420px] mx-auto text-[15px] text-ink-2">
          A coach can help you look at the full picture and figure out what
          adjustments would actually make a difference. And the promise stands: if your first session isn't worth it, you don't pay.
        </p>
        <a
          href="/employers"
          className="mt-5 inline-flex items-center gap-[9px] rounded-[9px] bg-accent px-[19px] py-[10px] text-sm font-semibold text-white shadow-[0_8px_22px_-12px_rgba(58,90,125,0.75)] transition-all hover:-translate-y-px hover:bg-accent-hover"
        >
          Book a session <span aria-hidden="true">&rarr;</span>
        </a>
      </section>
    </div>
  );
}
