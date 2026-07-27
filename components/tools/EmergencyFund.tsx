"use client";

import { useState } from "react";

const fmt = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

function parseNum(v: string): number {
  const n = parseFloat(v.replace(/[^0-9.]/g, ""));
  return isNaN(n) ? 0 : n;
}

export default function EmergencyFund() {
  const [monthlyExpenses, setMonthlyExpenses] = useState("3500");
  const [monthlySavings, setMonthlySavings] = useState("300");
  const [currentSavings, setCurrentSavings] = useState("4000");

  const expenses = parseNum(monthlyExpenses);
  const savings = parseNum(monthlySavings);
  const current = parseNum(currentSavings);

  const monthsCovered = expenses > 0 ? current / expenses : 0;
  const threeMonthTarget = expenses * 3;
  const sixMonthTarget = expenses * 6;
  const gapToThree = Math.max(0, threeMonthTarget - current);
  const gapToSix = Math.max(0, sixMonthTarget - current);

  const monthsToThree =
    gapToThree > 0 && savings > 0
      ? Math.ceil(gapToThree / savings)
      : gapToThree <= 0
        ? 0
        : null;

  const monthsToSix =
    gapToSix > 0 && savings > 0
      ? Math.ceil(gapToSix / savings)
      : gapToSix <= 0
        ? 0
        : null;

  const fillPercent =
    sixMonthTarget > 0
      ? Math.min(100, (current / sixMonthTarget) * 100)
      : 0;
  const threeMonthMark =
    sixMonthTarget > 0 ? (threeMonthTarget / sixMonthTarget) * 100 : 50;

  return (
    <div className="mx-auto max-w-[680px]">
      {/* Title */}
      <h1 className="font-display text-[32px] font-medium leading-[1.2] text-ink md:text-[38px]">
        Emergency fund calculator
      </h1>

      {/* Intro copy */}
      <p className="mt-4 text-[16px] leading-[1.65] text-ink-2">
        An emergency fund isn&rsquo;t about hitting a magic number &mdash;
        it&rsquo;s about knowing how long you could cover your basics if
        something changed. This calculator helps you see where you stand right
        now and what a reasonable target might look like.
      </p>

      {/* Inputs */}
      <div className="mt-10 space-y-6">
        {/* Monthly essential expenses */}
        <div>
          <label
            htmlFor="ef-expenses"
            className="block text-[13px] font-medium text-ink-2 mb-1.5"
          >
            Monthly essential expenses ($)
          </label>
          <input
            id="ef-expenses"
            type="text"
            inputMode="decimal"
            value={monthlyExpenses}
            onChange={(e) => setMonthlyExpenses(e.target.value)}
            className="w-full rounded-lg border border-line bg-white px-4 py-3 text-[15px] text-ink placeholder:text-muted/60 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            placeholder="3500"
          />
          <p className="mt-1.5 text-[13px] leading-[1.5] text-muted">
            Rent/mortgage, utilities, groceries, insurance, minimum debt
            payments &mdash; the things you&rsquo;d still need to cover.
          </p>
        </div>

        {/* Monthly savings */}
        <div>
          <label
            htmlFor="ef-savings-monthly"
            className="block text-[13px] font-medium text-ink-2 mb-1.5"
          >
            Monthly savings toward this goal ($)
          </label>
          <input
            id="ef-savings-monthly"
            type="text"
            inputMode="decimal"
            value={monthlySavings}
            onChange={(e) => setMonthlySavings(e.target.value)}
            className="w-full rounded-lg border border-line bg-white px-4 py-3 text-[15px] text-ink placeholder:text-muted/60 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            placeholder="300"
          />
          <p className="mt-1.5 text-[13px] leading-[1.5] text-muted">
            What you&rsquo;re setting aside each month, even if it&rsquo;s not
            much.
          </p>
        </div>

        {/* Current savings */}
        <div>
          <label
            htmlFor="ef-current"
            className="block text-[13px] font-medium text-ink-2 mb-1.5"
          >
            Current savings ($)
          </label>
          <input
            id="ef-current"
            type="text"
            inputMode="decimal"
            value={currentSavings}
            onChange={(e) => setCurrentSavings(e.target.value)}
            className="w-full rounded-lg border border-line bg-white px-4 py-3 text-[15px] text-ink placeholder:text-muted/60 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            placeholder="4000"
          />
        </div>
      </div>

      {/* Results */}
      <div className="mt-12">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="relative h-5 w-full overflow-hidden rounded-full bg-[#e8e6e1]">
            <div
              className="h-full rounded-full bg-accent transition-all duration-500 ease-out"
              style={{ width: `${fillPercent}%` }}
            />
            {/* 3-month tick mark */}
            <div
              className="absolute top-0 h-full w-px bg-ink/25"
              style={{ left: `${threeMonthMark}%` }}
            />
          </div>
          <div className="relative mt-2 text-[12px] text-muted">
            <span className="absolute left-0">
              {fmt.format(0)}
            </span>
            <span
              className="absolute -translate-x-1/2"
              style={{ left: `${threeMonthMark}%` }}
            >
              3 mo
            </span>
            <span className="absolute right-0">
              6 mo
            </span>
          </div>
        </div>

        {/* Stats grid */}
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {/* Months covered */}
          <div className="rounded-xl border border-line bg-surface p-5">
            <p className="text-[13px] font-medium text-ink-2">
              You&rsquo;re covered for
            </p>
            <p className="mt-1 font-display text-[28px] font-medium text-ink">
              {monthsCovered.toFixed(1)}{" "}
              <span className="text-[16px] text-ink-2">months</span>
            </p>
          </div>

          {/* 3-month target */}
          <div className="rounded-xl border border-line bg-surface p-5">
            <p className="text-[13px] font-medium text-ink-2">
              3-month target
            </p>
            <p className="mt-1 font-display text-[28px] font-medium text-ink">
              {fmt.format(threeMonthTarget)}
            </p>
            {gapToThree > 0 && (
              <p className="mt-1 text-[13px] text-muted">
                {fmt.format(gapToThree)} to go
              </p>
            )}
          </div>

          {/* 6-month target */}
          <div className="rounded-xl border border-line bg-surface p-5">
            <p className="text-[13px] font-medium text-ink-2">
              6-month target
            </p>
            <p className="mt-1 font-display text-[28px] font-medium text-ink">
              {fmt.format(sixMonthTarget)}
            </p>
            {gapToSix > 0 && (
              <p className="mt-1 text-[13px] text-muted">
                {fmt.format(gapToSix)} to go
              </p>
            )}
          </div>
        </div>

        {/* Timeline */}
        {savings > 0 && (gapToThree > 0 || gapToSix > 0) && (
          <div className="mt-8 rounded-xl border border-line bg-accent-tint p-5">
            <p className="text-[15px] leading-[1.6] text-ink-2">
              {monthsToThree !== null && monthsToThree > 0 ? (
                <>
                  At {fmt.format(savings)}/month, you&rsquo;d reach 3 months in{" "}
                  <span className="font-medium text-ink">
                    {monthsToThree} month{monthsToThree !== 1 ? "s" : ""}
                  </span>
                  .
                </>
              ) : (
                <>You&rsquo;re already there for 3 months.</>
              )}
            </p>
            {monthsToSix !== null && monthsToSix > 0 && (
              <p className="mt-2 text-[15px] leading-[1.6] text-ink-2">
                At {fmt.format(savings)}/month, you&rsquo;d reach 6 months in{" "}
                <span className="font-medium text-ink">
                  {monthsToSix} month{monthsToSix !== 1 ? "s" : ""}
                </span>
                .
              </p>
            )}
          </div>
        )}

        {/* Guidance note */}
        <p className="mt-8 text-[14px] leading-[1.65] text-muted">
          Three months is a common starting target. Six months gives you more
          room. The right number depends on your situation &mdash; how stable
          your income is, whether you have dependents, how quickly you could
          adjust if things changed.
        </p>

        {/* CTA */}
        <section className="mt-12 rounded-2xl border border-dashed border-[#ddd7cb] p-8 text-center">
          <h3 className="font-display text-[20px] font-medium text-ink">
            Want to figure out the right target for you?
          </h3>
          <p className="mt-2 max-w-[420px] mx-auto text-[15px] text-ink-2">
            A coach can help you think through your specific situation &mdash;
            income stability, dependents, the full picture. And the promise stands: if your first session isn't worth it, you don't pay.
          </p>
          <a
            href="/employers"
            className="mt-5 inline-flex items-center gap-[9px] rounded-[9px] bg-accent px-[19px] py-[10px] text-sm font-semibold text-white shadow-[0_8px_22px_-12px_rgba(58,90,125,0.75)] transition-all hover:-translate-y-px hover:bg-accent-hover"
          >
            Book a session <span aria-hidden="true">&rarr;</span>
          </a>
        </section>
      </div>
    </div>
  );
}
