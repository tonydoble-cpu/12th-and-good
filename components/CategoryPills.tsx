"use client";

import { useState } from "react";

const CATEGORIES = [
  "All",
  "Budgeting",
  "Debt payoff",
  "First home",
  "Investing",
  "Retirement",
  "Small business",
];

export default function CategoryPills() {
  const [active, setActive] = useState("All");

  return (
    <div className="mt-7 flex flex-wrap justify-center gap-[9px]">
      {CATEGORIES.map((c) => {
        const on = c === active;
        return (
          <button
            key={c}
            type="button"
            onClick={() => setActive(c)}
            className="inline-flex items-center whitespace-nowrap rounded-full border px-[17px] py-[9px] text-[13px] font-medium transition-all duration-[180ms]"
            style={
              on
                ? { background: "#191a1c", color: "#fff", borderColor: "#191a1c" }
                : { background: "#fff", color: "#3d4147", borderColor: "#e7e4dd" }
            }
          >
            {c}
          </button>
        );
      })}
    </div>
  );
}
