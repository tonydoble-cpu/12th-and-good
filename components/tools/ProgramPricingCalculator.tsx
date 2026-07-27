"use client";

import { useState } from "react";
import { priceForHeadcount } from "@/lib/program-pricing";

function money(n: number) {
  return "$" + Math.round(n).toLocaleString("en-US");
}

export default function ProgramPricingCalculator() {
  const [headcount, setHeadcount] = useState(300);
  const result = priceForHeadcount(headcount);

  return (
    <div className="mt-5 rounded-xl border border-line bg-white p-5">
      <label
        htmlFor="hcNumber"
        className="block text-[11.5px] font-semibold text-ink-2"
      >
        How many people are on your payroll?
      </label>
      <div className="mt-2 flex items-center gap-3">
        <input
          type="range"
          min={10}
          max={1200}
          step={5}
          value={headcount}
          onChange={(e) => setHeadcount(Number(e.target.value))}
          className="h-1 flex-1 cursor-pointer appearance-none rounded-full bg-gray-200"
          style={{ accentColor: "#3a5a7d" }}
        />
        <input
          id="hcNumber"
          type="number"
          min={1}
          value={headcount}
          onChange={(e) =>
            setHeadcount(Math.max(1, Math.min(5000, Number(e.target.value) || 0)))
          }
          className="w-[84px] rounded-lg border border-line bg-[#fcfbf9] px-2.5 py-2 text-center text-[13px] text-ink focus:border-accent focus:outline-none"
        />
      </div>

      <div className="mt-4 border-t border-line pt-4">
        {!result.soft ? (
          <>
            <div>
              <span className="block text-[11px] font-semibold uppercase tracking-[0.05em] text-accent">
                {result.label}
              </span>
              <span className="font-display text-[23px] leading-tight text-ink">
                {money(result.price)}{" "}
                <span className="text-[13px] font-sans text-muted">
                  {result.isPilot ? "/ 90 days" : "/yr"}
                </span>
              </span>
            </div>
            {result.note && (
              <p className="mt-2 max-w-[420px] text-[12.3px] leading-[1.5] text-ink-2">
                {result.note}
              </p>
            )}
            <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2">
              {[
                [`${result.onsiteDays} days`, "on site / year"],
                [`${result.pool}`, "one-on-one sessions"],
                [`${result.clinics}`, "virtual office hours"],
                [
                  `${result.locations} location${result.locations > 1 ? "s" : ""}`,
                  "included",
                ],
                [`${result.reporting}`, "HR reporting"],
                [`${result.comms}`, "employee reminders"],
              ].map(([n, l]) => (
                <div
                  key={l}
                  className="border-t border-[#f1efe9] pt-1.5 text-[11.6px] leading-[1.4] text-ink-2 first:border-t-0 [&:nth-child(2)]:border-t-0"
                >
                  <b className="block font-display text-[14.5px] font-medium text-ink">
                    {n}
                  </b>
                  {l}
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            <span className="font-display text-[16px] text-clay">
              {result.band}
            </span>
            <p className="mt-2 max-w-[420px] text-[12.3px] leading-[1.5] text-ink-2">
              {result.note}
            </p>
          </>
        )}
      </div>

      <p className="mt-4 text-[10.5px] italic text-muted">
        This is a real number for your size, not a teaser — no email required
        to see it. It moves only with scope, never with negotiation.
      </p>
    </div>
  );
}
