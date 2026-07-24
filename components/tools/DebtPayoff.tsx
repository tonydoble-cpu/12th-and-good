"use client";

import { useState, useMemo, useCallback } from "react";

/* ------------------------------------------------------------------ */
/*  Types & helpers                                                    */
/* ------------------------------------------------------------------ */

interface Debt {
  id: string;
  name: string;
  balance: number;
  rate: number;
  minPayment: number;
}

interface SimResult {
  totalMonths: number;
  totalInterest: number;
  totalPaid: number;
}

const fmt = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

let nextId = 4;
function uid() {
  return String(nextId++);
}

const INITIAL_DEBTS: Debt[] = [
  { id: "1", name: "Credit card", balance: 5200, rate: 22.9, minPayment: 130 },
  { id: "2", name: "Car loan", balance: 12400, rate: 6.5, minPayment: 285 },
  { id: "3", name: "Student loan", balance: 18000, rate: 5.0, minPayment: 200 },
];

/* ------------------------------------------------------------------ */
/*  Simulation                                                         */
/* ------------------------------------------------------------------ */

function simulate(
  debts: Debt[],
  extraPayment: number,
  strategy: "snowball" | "avalanche",
): SimResult {
  // Clone & sort
  const pool = debts
    .filter((d) => d.balance > 0)
    .map((d) => ({ ...d }))
    .sort((a, b) =>
      strategy === "snowball"
        ? a.balance - b.balance
        : b.rate - a.rate,
    );

  if (pool.length === 0) return { totalMonths: 0, totalInterest: 0, totalPaid: 0 };

  let months = 0;
  let totalInterest = 0;
  let totalPaid = 0;
  let rollingExtra = extraPayment;

  while (pool.some((d) => d.balance > 0) && months < 360) {
    months++;

    // Accrue interest
    for (const d of pool) {
      if (d.balance <= 0) continue;
      const interest = d.balance * (d.rate / 100 / 12);
      d.balance += interest;
      totalInterest += interest;
    }

    // Apply minimum payments
    for (const d of pool) {
      if (d.balance <= 0) continue;
      const payment = Math.min(d.minPayment, d.balance);
      d.balance -= payment;
      totalPaid += payment;
    }

    // Apply extra payment to the first debt in strategy order still owing
    let extra = rollingExtra;
    for (const d of pool) {
      if (d.balance <= 0 || extra <= 0) continue;
      const payment = Math.min(extra, d.balance);
      d.balance -= payment;
      totalPaid += payment;
      extra -= payment;
    }

    // When a debt is paid off, roll its minimum into the extra
    for (const d of pool) {
      if (d.balance <= 0 && d.minPayment > 0) {
        rollingExtra += d.minPayment;
        d.minPayment = 0; // prevent double-rolling
      }
    }
  }

  return {
    totalMonths: months,
    totalInterest: Math.round(totalInterest),
    totalPaid: Math.round(totalPaid),
  };
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function DebtPayoff() {
  const [debts, setDebts] = useState<Debt[]>(INITIAL_DEBTS);
  const [extra, setExtra] = useState(200);

  /* ---- debt CRUD ---- */

  const updateDebt = useCallback(
    (id: string, field: keyof Omit<Debt, "id">, raw: string) => {
      setDebts((prev) =>
        prev.map((d) => {
          if (d.id !== id) return d;
          if (field === "name") return { ...d, name: raw };
          const num = parseFloat(raw);
          return { ...d, [field]: isNaN(num) ? 0 : num };
        }),
      );
    },
    [],
  );

  const addDebt = useCallback(() => {
    if (debts.length >= 8) return;
    setDebts((prev) => [
      ...prev,
      { id: uid(), name: "", balance: 0, rate: 0, minPayment: 0 },
    ]);
  }, [debts.length]);

  const removeDebt = useCallback(
    (id: string) => {
      if (debts.length <= 1) return;
      setDebts((prev) => prev.filter((d) => d.id !== id));
    },
    [debts.length],
  );

  /* ---- results ---- */

  const snowball = useMemo(
    () => simulate(debts, extra, "snowball"),
    [debts, extra],
  );
  const avalanche = useMemo(
    () => simulate(debts, extra, "avalanche"),
    [debts, extra],
  );

  const diff = snowball.totalInterest - avalanche.totalInterest;

  const hasValidDebts = debts.some((d) => d.balance > 0);

  /* ---- shared input classes ---- */
  const inputCls =
    "w-full rounded-lg border border-line bg-white px-4 py-3 text-[15px] text-ink placeholder:text-muted/60 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent";
  const labelCls = "block text-[13px] font-medium text-ink-2 mb-1.5";

  /* ---------------------------------------------------------------- */
  /*  Render                                                           */
  /* ---------------------------------------------------------------- */

  return (
    <div className="mx-auto max-w-3xl">
      {/* Heading */}
      <h1 className="font-display text-[32px] font-semibold leading-snug text-ink md:text-[38px]">
        Debt payoff planner
      </h1>

      <p className="mt-4 max-w-[600px] text-[16px] leading-relaxed text-ink-2">
        If you&rsquo;re carrying a few different debts, the order you pay them
        off in actually matters &mdash; it can save you real money in interest.
        This planner runs the math on two common strategies so you can see the
        difference.
      </p>

      {/* ---- Debt entries ---- */}
      <div className="mt-10 space-y-4">
        {debts.map((debt, idx) => (
          <div
            key={debt.id}
            className="rounded-xl border border-line bg-surface p-5"
          >
            <div className="mb-4 flex items-center justify-between">
              <span className="text-[13px] font-medium text-muted">
                Debt {idx + 1}
              </span>
              {debts.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeDebt(debt.id)}
                  className="text-[13px] text-muted transition-colors hover:text-ink-2"
                  aria-label={`Remove ${debt.name || "debt"}`}
                >
                  Remove
                </button>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className={labelCls}>Name</label>
                <input
                  type="text"
                  className={inputCls}
                  placeholder="e.g. Visa, Car loan"
                  value={debt.name}
                  onChange={(e) => updateDebt(debt.id, "name", e.target.value)}
                />
              </div>

              <div>
                <label className={labelCls}>Balance ($)</label>
                <input
                  type="number"
                  className={inputCls}
                  placeholder="0"
                  min={0}
                  value={debt.balance || ""}
                  onChange={(e) =>
                    updateDebt(debt.id, "balance", e.target.value)
                  }
                />
              </div>

              <div>
                <label className={labelCls}>Interest rate (%)</label>
                <input
                  type="number"
                  className={inputCls}
                  placeholder="0"
                  min={0}
                  step={0.1}
                  value={debt.rate || ""}
                  onChange={(e) => updateDebt(debt.id, "rate", e.target.value)}
                />
              </div>

              <div>
                <label className={labelCls}>Minimum payment ($)</label>
                <input
                  type="number"
                  className={inputCls}
                  placeholder="0"
                  min={0}
                  value={debt.minPayment || ""}
                  onChange={(e) =>
                    updateDebt(debt.id, "minPayment", e.target.value)
                  }
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add debt button */}
      {debts.length < 8 && (
        <button
          type="button"
          onClick={addDebt}
          className="mt-4 rounded-lg border border-dashed border-line px-5 py-3 text-[14px] font-medium text-ink-2 transition-colors hover:border-accent hover:text-accent"
        >
          + Add a debt
        </button>
      )}

      {/* Extra payment input */}
      <div className="mt-8">
        <label className={labelCls}>Extra monthly payment ($)</label>
        <p className="mb-2 text-[13px] text-muted">
          The amount above your combined minimums you can put toward debt each
          month.
        </p>
        <input
          type="number"
          className={`${inputCls} max-w-[240px]`}
          placeholder="0"
          min={0}
          value={extra || ""}
          onChange={(e) => {
            const v = parseFloat(e.target.value);
            setExtra(isNaN(v) ? 0 : v);
          }}
        />
      </div>

      {/* ---- Results ---- */}
      {hasValidDebts && (
        <div className="mt-12">
          <h2 className="font-display text-[22px] font-medium text-ink">
            Your payoff comparison
          </h2>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            {/* Snowball card */}
            <div className="rounded-xl border border-line bg-surface p-6">
              <h3 className="text-[15px] font-semibold text-ink">
                Snowball method
              </h3>
              <p className="mt-1 text-[13px] text-muted">
                Smallest balance first
              </p>

              <dl className="mt-5 space-y-3 text-[15px]">
                <div className="flex justify-between">
                  <dt className="text-ink-2">Time to payoff</dt>
                  <dd className="font-medium text-ink">
                    {snowball.totalMonths}{" "}
                    {snowball.totalMonths === 1 ? "month" : "months"}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-ink-2">Total interest</dt>
                  <dd className="font-medium text-ink">
                    {fmt.format(snowball.totalInterest)}
                  </dd>
                </div>
                <div className="flex justify-between border-t border-line pt-3">
                  <dt className="text-ink-2">Total amount paid</dt>
                  <dd className="font-medium text-ink">
                    {fmt.format(snowball.totalPaid)}
                  </dd>
                </div>
              </dl>
            </div>

            {/* Avalanche card */}
            <div className="rounded-xl border border-line bg-surface p-6">
              <h3 className="text-[15px] font-semibold text-ink">
                Avalanche method
              </h3>
              <p className="mt-1 text-[13px] text-muted">
                Highest interest rate first
              </p>

              <dl className="mt-5 space-y-3 text-[15px]">
                <div className="flex justify-between">
                  <dt className="text-ink-2">Time to payoff</dt>
                  <dd className="font-medium text-ink">
                    {avalanche.totalMonths}{" "}
                    {avalanche.totalMonths === 1 ? "month" : "months"}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-ink-2">Total interest</dt>
                  <dd className="font-medium text-ink">
                    {fmt.format(avalanche.totalInterest)}
                  </dd>
                </div>
                <div className="flex justify-between border-t border-line pt-3">
                  <dt className="text-ink-2">Total amount paid</dt>
                  <dd className="font-medium text-ink">
                    {fmt.format(avalanche.totalPaid)}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Savings highlight */}
          <div className="mt-5 rounded-xl bg-accent-tint px-6 py-4 text-[15px] text-ink">
            {diff > 0 ? (
              <p>
                <span className="font-semibold">
                  The avalanche method saves you {fmt.format(diff)} in interest.
                </span>
              </p>
            ) : diff < 0 ? (
              <p>
                <span className="font-semibold">
                  The snowball method saves you {fmt.format(Math.abs(diff))} in
                  interest.
                </span>
              </p>
            ) : (
              <p>
                <span className="font-semibold">
                  Both methods cost the same in interest.
                </span>
              </p>
            )}
          </div>

          {/* Explainer note */}
          <p className="mt-6 text-[14px] leading-relaxed text-ink-2">
            The snowball method pays off the smallest debt first &mdash; the
            wins come faster, which helps some people stay motivated. The
            avalanche method targets the highest interest rate first &mdash; it
            usually saves more money. Neither is wrong.
          </p>
        </div>
      )}

      {/* ---- CTA ---- */}
      <section className="mt-12 rounded-2xl border border-dashed border-[#ddd7cb] p-8 text-center">
        <h3 className="font-display text-[20px] font-medium text-ink">
          Want help building a payoff plan?
        </h3>
        <p className="mt-2 mx-auto max-w-[420px] text-[15px] text-ink-2">
          A coach can look at the full picture with you &mdash; not just the
          math, but what actually fits your life. The intro call is free.
        </p>
        <a
          href="/coaches"
          className="mt-5 inline-flex items-center gap-[9px] rounded-[9px] bg-accent px-[19px] py-[10px] text-sm font-semibold text-white shadow-[0_8px_22px_-12px_rgba(58,90,125,0.75)] transition-all hover:-translate-y-px hover:bg-accent-hover"
        >
          Book a free intro call <span aria-hidden="true">&rarr;</span>
        </a>
      </section>
    </div>
  );
}
