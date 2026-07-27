"use client";

import { useState } from "react";

const fmt = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

function futureValue(annualAmount: number, years: number): number {
  const monthlyContrib = annualAmount / 12;
  const monthlyRate = 0.07 / 12;
  const months = years * 12;
  if (months === 0) return 0;
  return monthlyContrib * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
}

export default function Calculator401k() {
  const [salary, setSalary] = useState(75000);
  const [contributionRate, setContributionRate] = useState(6);
  const [matchRate, setMatchRate] = useState(100);
  const [matchCap, setMatchCap] = useState(4);
  const [years, setYears] = useState(25);

  const yourAnnualContribution = salary * (contributionRate / 100);
  const eligibleForMatch = Math.min(
    salary * (contributionRate / 100),
    salary * (matchCap / 100)
  );
  const employerMatch = eligibleForMatch * (matchRate / 100);
  const maxEmployerMatch = (salary * (matchCap / 100)) * (matchRate / 100);
  const leftOnTable = Math.max(0, maxEmployerMatch - employerMatch);

  const projectedValue = futureValue(yourAnnualContribution + employerMatch, years);
  const futureValueOfMissedMatch = futureValue(leftOnTable, years);

  return (
    <div>
      {/* Title and intro */}
      <div className="mb-10">
        <h1 className="font-display text-[32px] font-medium leading-tight text-ink md:text-[38px]">
          <span className="dot" /> 401(k) &amp; employer match calculator
        </h1>
        <p className="mt-4 max-w-[640px] text-[16px] leading-relaxed text-ink-2">
          Most people know they should contribute to their 401(k). Fewer know
          exactly how much of their employer match they&rsquo;re actually
          capturing&nbsp;&mdash; or what that gap costs them over time. This
          calculator helps you see both.
        </p>
      </div>

      {/* Inputs */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Annual salary */}
        <div>
          <label htmlFor="salary" className="block text-[13px] font-medium text-ink-2 mb-1.5">
            Annual salary ($)
          </label>
          <input
            id="salary"
            type="number"
            min={0}
            step={1000}
            value={salary}
            onChange={(e) => setSalary(Math.max(0, Number(e.target.value)))}
            className="w-full rounded-lg border border-line bg-white px-4 py-3 text-[15px] text-ink placeholder:text-muted/60 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          />
        </div>

        {/* Years until retirement */}
        <div>
          <label htmlFor="years" className="block text-[13px] font-medium text-ink-2 mb-1.5">
            Years until retirement
          </label>
          <input
            id="years"
            type="number"
            min={1}
            max={50}
            value={years}
            onChange={(e) => setYears(Math.max(1, Math.min(50, Number(e.target.value))))}
            className="w-full rounded-lg border border-line bg-white px-4 py-3 text-[15px] text-ink placeholder:text-muted/60 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          />
        </div>

        {/* Contribution rate slider */}
        <div>
          <label htmlFor="contributionRate" className="block text-[13px] font-medium text-ink-2 mb-1.5">
            Your contribution rate
          </label>
          <div className="flex items-center gap-4">
            <input
              id="contributionRate"
              type="range"
              min={0}
              max={100}
              step={1}
              value={contributionRate}
              onChange={(e) => setContributionRate(Number(e.target.value))}
              className="h-2 flex-1 cursor-pointer appearance-none rounded-full bg-gray-200"
              style={{ accentColor: "#3a5a7d" }}
            />
            <span className="w-[48px] text-right text-[15px] font-medium text-ink tabular-nums">
              {contributionRate}%
            </span>
          </div>
        </div>

        {/* Employer match rate slider */}
        <div>
          <label htmlFor="matchRate" className="block text-[13px] font-medium text-ink-2 mb-1.5">
            Employer match rate (cents per dollar)
          </label>
          <div className="flex items-center gap-4">
            <input
              id="matchRate"
              type="range"
              min={0}
              max={200}
              step={5}
              value={matchRate}
              onChange={(e) => setMatchRate(Number(e.target.value))}
              className="h-2 flex-1 cursor-pointer appearance-none rounded-full bg-gray-200"
              style={{ accentColor: "#3a5a7d" }}
            />
            <span className="w-[56px] text-right text-[15px] font-medium text-ink tabular-nums">
              {matchRate}%
            </span>
          </div>
        </div>

        {/* Employer match cap slider */}
        <div className="md:col-span-2">
          <label htmlFor="matchCap" className="block text-[13px] font-medium text-ink-2 mb-1.5">
            Employer match cap (% of salary)
          </label>
          <div className="flex items-center gap-4">
            <input
              id="matchCap"
              type="range"
              min={0}
              max={20}
              step={0.5}
              value={matchCap}
              onChange={(e) => setMatchCap(Number(e.target.value))}
              className="h-2 flex-1 cursor-pointer appearance-none rounded-full bg-gray-200"
              style={{ accentColor: "#3a5a7d" }}
            />
            <span className="w-[48px] text-right text-[15px] font-medium text-ink tabular-nums">
              {matchCap}%
            </span>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard label="Your annual contribution" value={fmt.format(yourAnnualContribution)} />
        <StatCard label="Employer match you're getting" value={fmt.format(employerMatch)} />
        <StatCard
          label="Free money you're leaving on the table"
          value={fmt.format(leftOnTable)}
          highlight={leftOnTable > 0}
        />
        <StatCard label="Projected value at retirement" value={fmt.format(projectedValue)} large />
        {leftOnTable > 0 && (
          <StatCard
            label="What the missed match could have been worth"
            value={fmt.format(futureValueOfMissedMatch)}
            highlight
          />
        )}
      </div>

      {/* Disclaimer */}
      <p className="mt-6 text-[13px] leading-relaxed text-muted">
        Assumes a 7% annual return, which is a common long-term estimate&nbsp;&mdash;
        not a guarantee. Your actual results will vary.
      </p>

      {/* CTA */}
      <section className="mt-12 rounded-2xl border border-dashed border-[#ddd7cb] p-8 text-center">
        <h3 className="font-display text-[20px] font-medium text-ink">
          Want to talk through your plan?
        </h3>
        <p className="mt-2 max-w-[420px] mx-auto text-[15px] text-ink-2">
          A coach can help you figure out the right contribution for your
          situation. And the promise stands: if your first session isn't worth it, you don't pay.
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

/* ------------------------------------------------------------------ */
/* Stat card sub-component                                            */
/* ------------------------------------------------------------------ */

function StatCard({
  label,
  value,
  highlight = false,
  large = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
  large?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border p-5 ${
        highlight
          ? "border-amber-300/60 bg-amber-50/50"
          : "border-line bg-surface"
      }`}
    >
      <p className="text-[13px] font-medium text-ink-2">{label}</p>
      <p
        className={`mt-1 font-display font-medium tabular-nums ${
          large ? "text-[28px]" : "text-[22px]"
        } ${highlight ? "text-amber-700" : "text-ink"}`}
      >
        {value}
      </p>
    </div>
  );
}
