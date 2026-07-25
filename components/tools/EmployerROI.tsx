"use client";

import { useState, useMemo } from "react";
import EmailCapture from "@/components/EmailCapture";

/* ------------------------------------------------------------------ */
/* Formatting helpers                                                  */
/* ------------------------------------------------------------------ */
const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});
const pct = (n: number) => `${n.toFixed(1)}%`;
const commas = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });

/* ------------------------------------------------------------------ */
/* Research-backed assumptions                                         */
/* Each has a source citation shown in the footnotes                   */
/* ------------------------------------------------------------------ */
const ASSUMPTIONS = {
  stressedPct: 0.59, // PwC 2026: 59% of employees report financial stress
  hoursLostPerWeek: 3.3, // Valoir 2025: 3.3 hrs/wk on personal finances at work
  weeksPerYear: 48, // ~48 working weeks
  replacementCostMultiple: 0.5, // Conservative: 50% of salary (range is 50-200%)
  turnoverReductionPct: 0.15, // Conservative: 15% reduction in voluntary turnover
  absentDaysReduced: 3, // Financial Finesse: participants had 5 fewer unscheduled days; we use 3 conservatively
  dailyCostMultiple: 1 / 260, // salary / 260 working days
  healthcareSavingsPerPerson: 271, // Financial Finesse/Fortune 100 study: $271.50/employee/year
  stressedTurnoverMultiple: 2, // PwC: financially stressed employees are 2x as likely to job search
  programCostPerEmployee: 10, // Mid-range: $3-$20/employee/month → $10 median
  // Only count a quarter of modeled savings as realized. Un-haircut models
  // in this category produce 15-20x ROI numbers that experienced HR buyers
  // read as fantasy (the biggest incumbent publicly claims ~3x). A number a
  // buyer believes beats a bigger one they don't.
  realizationRate: 0.25,
};

/* ------------------------------------------------------------------ */
/* Calculator component                                                */
/* ------------------------------------------------------------------ */
export default function EmployerROI() {
  const [employees, setEmployees] = useState(250);
  const [avgSalary, setAvgSalary] = useState(65000);
  const [turnoverRate, setTurnoverRate] = useState(18);
  const [showSources, setShowSources] = useState(false);
  const [emailCaptured, setEmailCaptured] = useState(false);

  const results = useMemo(() => {
    const A = ASSUMPTIONS;

    // --- Productivity recovery ---
    // Stressed employees × hours recovered × hourly cost
    const stressedCount = Math.round(employees * A.stressedPct);
    const hourlyRate = avgSalary / (A.weeksPerYear * 40);
    // Conservative: recover 30% of lost hours through coaching
    const hoursRecoveredPerPerson = A.hoursLostPerWeek * 0.3;
    const productivitySavings =
      stressedCount * hoursRecoveredPerPerson * A.weeksPerYear * hourlyRate;

    // --- Turnover reduction ---
    const annualTurnover = Math.round(employees * (turnoverRate / 100));
    const costPerReplacement = avgSalary * A.replacementCostMultiple;
    const turnoversAvoided = Math.round(annualTurnover * A.turnoverReductionPct);
    const turnoverSavings = turnoversAvoided * costPerReplacement;

    // --- Absenteeism reduction ---
    const dailyCost = avgSalary * A.dailyCostMultiple;
    const absenteeismSavings = stressedCount * A.absentDaysReduced * dailyCost;

    // --- Healthcare cost reduction ---
    const healthcareSavings = stressedCount * A.healthcareSavingsPerPerson;

    // --- Program cost ---
    const annualProgramCost = employees * A.programCostPerEmployee * 12;

    // --- Totals (with conservatism haircut) ---
    const modeledSavings =
      productivitySavings + turnoverSavings + absenteeismSavings + healthcareSavings;
    const totalSavings = modeledSavings * A.realizationRate;
    const netSavings = totalSavings - annualProgramCost;
    const roi = annualProgramCost > 0 ? totalSavings / annualProgramCost : 0;

    return {
      stressedCount,
      productivitySavings: productivitySavings * A.realizationRate,
      annualTurnover,
      turnoversAvoided,
      turnoverSavings: turnoverSavings * A.realizationRate,
      absenteeismSavings: absenteeismSavings * A.realizationRate,
      healthcareSavings: healthcareSavings * A.realizationRate,
      totalSavings,
      annualProgramCost,
      netSavings,
      roi,
    };
  }, [employees, avgSalary, turnoverRate]);

  return (
    <div>
      {/* Title */}
      <div className="mb-10">
        <h1 className="font-display text-[32px] font-medium leading-tight text-ink md:text-[38px]">
          <span className="dot" /> Financial wellness ROI calculator
        </h1>
        <p className="mt-4 max-w-[640px] text-[16px] leading-relaxed text-ink-2">
          The math on financial stress at work is hard to ignore. Plug in your
          numbers and see what a coaching program could save — and what doing
          nothing is already costing.
        </p>
      </div>

      {/* Inputs */}
      <div className="grid gap-6 md:grid-cols-3">
        <div>
          <label
            htmlFor="employees"
            className="block text-[13px] font-medium text-ink-2 mb-1.5"
          >
            Number of employees
          </label>
          <input
            id="employees"
            type="number"
            min={10}
            step={10}
            value={employees}
            onChange={(e) => setEmployees(Math.max(10, Number(e.target.value)))}
            className="w-full rounded-lg border border-line bg-white px-4 py-3 text-[15px] text-ink placeholder:text-muted/60 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          />
        </div>

        <div>
          <label
            htmlFor="avgSalary"
            className="block text-[13px] font-medium text-ink-2 mb-1.5"
          >
            Average salary ($)
          </label>
          <input
            id="avgSalary"
            type="number"
            min={20000}
            step={5000}
            value={avgSalary}
            onChange={(e) => setAvgSalary(Math.max(20000, Number(e.target.value)))}
            className="w-full rounded-lg border border-line bg-white px-4 py-3 text-[15px] text-ink placeholder:text-muted/60 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          />
        </div>

        <div>
          <label
            htmlFor="turnover"
            className="block text-[13px] font-medium text-ink-2 mb-1.5"
          >
            Annual turnover rate (%)
          </label>
          <div className="flex items-center gap-4">
            <input
              id="turnover"
              type="range"
              min={5}
              max={50}
              step={1}
              value={turnoverRate}
              onChange={(e) => setTurnoverRate(Number(e.target.value))}
              className="h-2 flex-1 cursor-pointer appearance-none rounded-full bg-gray-200"
              style={{ accentColor: "#3a5a7d" }}
            />
            <span className="w-[48px] text-right text-[15px] font-medium text-ink tabular-nums">
              {turnoverRate}%
            </span>
          </div>
          <p className="mt-1 text-[12px] text-muted">
            U.S. average is ~18%. Adjust for your industry.
          </p>
        </div>
      </div>

      {/* Headline result */}
      <div className="mt-10 rounded-2xl border-2 border-accent/30 bg-accent-tint p-8 text-center">
        <p className="text-[14px] font-medium uppercase tracking-[0.12em] text-ink-2">
          Estimated annual return
        </p>
        <p className="mt-2 font-display text-[44px] font-medium text-ink md:text-[56px] tabular-nums">
          {usd.format(results.netSavings)}
        </p>
        <p className="mt-1 text-[15px] text-ink-2">
          net savings per year&ensp;·&ensp;
          <span className="font-semibold text-accent">
            {results.roi.toFixed(1)}:1 ROI
          </span>
        </p>
        <p className="mt-3 text-[13px] text-muted">
          Based on {commas.format(results.stressedCount)} financially stressed
          employees out of {commas.format(employees)} total, at{" "}
          {usd.format(results.annualProgramCost)}/year program cost.
        </p>
        <p className="mt-2 text-[12.5px] text-muted">
          Deliberately conservative: we only count 25% of research-modeled
          savings as realized. Un-haircut versions of this math produce
          15&ndash;20:1 claims — we don&rsquo;t believe those, and you
          shouldn&rsquo;t either.
        </p>
      </div>

      {/* Email gate for detailed breakdown */}
      {!emailCaptured ? (
        <div className="mt-8">
          <EmailCapture
            heading="Get the full savings breakdown"
            valueProp="Enter your email to see the detailed analysis — productivity recovery, turnover savings, absenteeism impact, and healthcare costs broken out individually, plus per-employee numbers you can share with your team."
            source="employer-roi-calculator"
            onCapture={() => setEmailCaptured(true)}
          />
        </div>
      ) : (
        <>
          {/* Savings breakdown */}
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <SavingsCard
              label="Productivity recovered"
              value={usd.format(results.productivitySavings)}
              detail={`${commas.format(results.stressedCount)} stressed employees × 1 hr/wk recovered × ${pct(0)} hourly cost`}
              explanation="Financially stressed employees lose 3.3 hours per week to personal money issues at work. Coaching recovers a portion of that time."
              color="blue"
            />
            <SavingsCard
              label="Turnover avoided"
              value={usd.format(results.turnoverSavings)}
              detail={`${results.turnoversAvoided} departures avoided × ${usd.format(avgSalary * 0.5)} replacement cost`}
              explanation="Replacing an employee costs 50–200% of their salary. Financially stressed employees are 2× more likely to job-search."
              color="green"
            />
            <SavingsCard
              label="Reduced absenteeism"
              value={usd.format(results.absenteeismSavings)}
              detail={`${commas.format(results.stressedCount)} stressed employees × 3 fewer unscheduled days`}
              explanation="Program participants average 5 fewer unscheduled absence days. We conservatively model 3."
              color="amber"
            />
            <SavingsCard
              label="Healthcare cost reduction"
              value={usd.format(results.healthcareSavings)}
              detail={`${commas.format(results.stressedCount)} employees × $271/year`}
              explanation="One Fortune 100 study found healthcare costs decreased 4.5% for program users while increasing 19.4% for non-users."
              color="purple"
            />
          </div>

          {/* Cost vs. savings bar */}
          <div className="mt-8 rounded-xl border border-line bg-surface p-6">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[13px] font-medium text-ink-2">
                Program cost vs. total savings
              </p>
              <p className="text-[13px] text-muted">
                {usd.format(results.annualProgramCost)} cost&ensp;→&ensp;
                {usd.format(results.totalSavings)} return
              </p>
            </div>
            <div className="h-8 rounded-full bg-gray-100 overflow-hidden flex">
              {results.totalSavings > 0 && (
                <>
                  <div
                    className="h-full rounded-l-full bg-accent transition-all duration-500"
                    style={{
                      width: `${Math.min(
                        (results.annualProgramCost / results.totalSavings) * 100,
                        100
                      )}%`,
                    }}
                  />
                  <div
                    className="h-full rounded-r-full bg-emerald-400 transition-all duration-500"
                    style={{
                      width: `${Math.max(
                        100 -
                          (results.annualProgramCost / results.totalSavings) * 100,
                        0
                      )}%`,
                    }}
                  />
                </>
              )}
            </div>
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-accent" />
                <span className="text-[12px] text-ink-2">Investment</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                <span className="text-[12px] text-ink-2">Return</span>
              </div>
            </div>
          </div>

          {/* Per-employee breakdown */}
          <div className="mt-8 rounded-xl border border-line bg-surface p-6">
            <p className="text-[13px] font-medium text-ink-2 mb-4">
              Per-employee numbers
            </p>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="font-display text-[24px] font-medium text-ink tabular-nums">
                  {usd.format(results.annualProgramCost / employees)}
                </p>
                <p className="text-[12px] text-muted mt-1">Annual cost per head</p>
              </div>
              <div>
                <p className="font-display text-[24px] font-medium text-accent tabular-nums">
                  {usd.format(results.totalSavings / employees)}
                </p>
                <p className="text-[12px] text-muted mt-1">Annual return per head</p>
              </div>
              <div>
                <p className="font-display text-[24px] font-medium text-emerald-600 tabular-nums">
                  {usd.format(results.netSavings / employees)}
                </p>
                <p className="text-[12px] text-muted mt-1">Net savings per head</p>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Sources toggle */}
      <div className="mt-8">
        <button
          onClick={() => setShowSources(!showSources)}
          className="text-[13px] font-medium text-accent hover:underline"
        >
          {showSources ? "Hide" : "Show"} methodology &amp; sources
        </button>
        {showSources && (
          <div className="mt-4 rounded-xl border border-line bg-white p-6 text-[13px] leading-relaxed text-ink-2 space-y-3">
            <p>
              <strong className="text-ink">Financial stress prevalence (59%):</strong>{" "}
              PwC 2026 Employee Financial Wellness Survey, ~3,500 respondents.
            </p>
            <p>
              <strong className="text-ink">Productivity loss (3.3 hrs/wk):</strong>{" "}
              Valoir 2025 research. We conservatively model recovering 30% of lost
              time, not all of it.
            </p>
            <p>
              <strong className="text-ink">Replacement cost (50% of salary):</strong>{" "}
              SHRM estimates range from 50–200% depending on role seniority. We use
              the floor.
            </p>
            <p>
              <strong className="text-ink">2× turnover likelihood:</strong>{" "}
              PwC: financially stressed employees are twice as likely to actively
              job-search. We model a 15% reduction in stress-driven departures.
            </p>
            <p>
              <strong className="text-ink">Absenteeism (3–5 fewer days):</strong>{" "}
              Financial Finesse longitudinal study: participants averaged 11
              unscheduled absence days vs. 16 for non-participants. We use 3 days
              conservatively.
            </p>
            <p>
              <strong className="text-ink">Healthcare savings ($271/person):</strong>{" "}
              Fortune 100 case study via Financial Finesse/PFEEF: costs decreased
              4.5% for users vs. increased 19.4% for non-users.
            </p>
            <p>
              <strong className="text-ink">Overall ROI benchmark:</strong>{" "}
              Independent PFEEF study (8,233 participants) found $5.50 return per
              $1 invested under conservative assumptions. Our calculator applies
              a further 25% realization haircut to everything it models — if
              we&rsquo;re wrong, we&rsquo;d rather be wrong low.
            </p>
            <p>
              <strong className="text-ink">Program cost ($10/employee/month):</strong>{" "}
              Matches our Founding Employer Pilot rate, and the market midpoint
              for programs like this ($3&ndash;$20/employee/month).
            </p>
            <p className="text-muted italic">
              All estimates are directional. Actual results depend on participation
              rates, program scope, and workforce composition. These are conservative
              assumptions — most published studies report higher impact.
            </p>
          </div>
        )}
      </div>

      {/* CTA */}
      <section className="mt-12 rounded-2xl border border-dashed border-[#ddd7cb] p-8 text-center">
        <h3 className="font-display text-[20px] font-medium text-ink">
          Ready to run these numbers for your team?
        </h3>
        <p className="mt-2 max-w-[460px] mx-auto text-[15px] text-ink-2">
          We&rsquo;ll scope a program around what your team actually needs. No
          standard package, no pressure. Just a conversation about whether this
          is a fit.
        </p>
        <a
          href="/employers#contact"
          className="mt-5 inline-flex items-center gap-[9px] rounded-[9px] bg-accent px-[19px] py-[10px] text-sm font-semibold text-white shadow-[0_8px_22px_-12px_rgba(58,90,125,0.75)] transition-all hover:-translate-y-px hover:bg-accent-hover"
        >
          Talk to us <span aria-hidden="true">&rarr;</span>
        </a>
      </section>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Savings card sub-component                                          */
/* ------------------------------------------------------------------ */
const COLOR_MAP = {
  blue: {
    border: "border-blue-200/60",
    bg: "bg-blue-50/40",
    text: "text-blue-800",
  },
  green: {
    border: "border-emerald-200/60",
    bg: "bg-emerald-50/40",
    text: "text-emerald-800",
  },
  amber: {
    border: "border-amber-200/60",
    bg: "bg-amber-50/40",
    text: "text-amber-800",
  },
  purple: {
    border: "border-purple-200/60",
    bg: "bg-purple-50/40",
    text: "text-purple-800",
  },
};

function SavingsCard({
  label,
  value,
  detail,
  explanation,
  color,
}: {
  label: string;
  value: string;
  detail: string;
  explanation: string;
  color: keyof typeof COLOR_MAP;
}) {
  const c = COLOR_MAP[color];
  return (
    <div className={`rounded-xl border ${c.border} ${c.bg} p-5`}>
      <p className="text-[13px] font-medium text-ink-2">{label}</p>
      <p className={`mt-1 font-display text-[26px] font-medium tabular-nums ${c.text}`}>
        {value}
      </p>
      <p className="mt-2 text-[12px] text-muted">{explanation}</p>
    </div>
  );
}
