"use client";

import { useState } from "react";

const FILTER_GROUPS = [
  {
    title: "Focus area",
    items: [
      "Budgeting & cash flow",
      "Debt payoff",
      "Buying a first home",
      "Starting to invest",
      "Retirement",
      "Small business",
      "Money after a big change",
    ],
  },
  {
    title: "Session type",
    items: ["Single session", "3-session action plan"],
  },
  {
    title: "Price",
    items: ["Under $150", "$150 – $250", "$250+"],
  },
  {
    title: "Availability",
    items: ["This week", "Evenings", "Weekends"],
  },
  { title: "Language", items: ["English", "Spanish"] },
];

/**
 * Pure UI-state filter sidebar, matching the design handoff's behavior
 * exactly — with a single real coach on the marketplace today, these don't
 * filter results yet. Wire to a real coach query once there's a second
 * coach to filter against.
 */
export default function CoachFilters() {
  const [active, setActive] = useState<Record<string, boolean>>({});

  const toggle = (key: string) =>
    setActive((prev) => {
      const next = { ...prev };
      if (next[key]) delete next[key];
      else next[key] = true;
      return next;
    });

  const anyActive = Object.keys(active).length > 0;

  return (
    <aside className="sticky top-[92px]">
      <div className="mb-[22px] flex items-baseline justify-between">
        <span className="font-display text-[19px] font-medium text-ink">
          Filters
        </span>
        <button
          type="button"
          onClick={() => setActive({})}
          disabled={!anyActive}
          className="text-[13px] font-medium"
          style={{
            color: anyActive ? "var(--accent)" : "#c6c0b4",
            cursor: anyActive ? "pointer" : "default",
          }}
        >
          Clear all
        </button>
      </div>

      {FILTER_GROUPS.map((group, gi) => (
        <div
          key={group.title}
          className="mb-6 border-b border-line pb-6 last:border-b-0"
        >
          <div className="mb-[11px] text-[11px] font-semibold uppercase tracking-[0.1em] text-muted">
            {group.title}
          </div>
          <div className="flex flex-col">
            {group.items.map((label, ii) => {
              const key = `${gi}-${ii}`;
              const on = !!active[key];
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => toggle(key)}
                  className="flex w-full items-center gap-[11px] rounded-lg px-2 py-2 text-left transition-colors"
                  style={{ background: on ? "#f2f0ea" : "transparent" }}
                >
                  <span
                    className="flex h-[18px] w-[18px] flex-none items-center justify-center rounded-[5px] text-[11px] text-white transition-all"
                    style={
                      on
                        ? { background: "var(--accent)", border: "1px solid var(--accent)" }
                        : { background: "#fff", border: "1.5px solid #cfc9bd" }
                    }
                  >
                    {on ? "✓" : ""}
                  </span>
                  <span className="flex-1 text-sm text-ink-2">{label}</span>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </aside>
  );
}
