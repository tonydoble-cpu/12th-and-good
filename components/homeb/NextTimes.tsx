"use client";

import { format } from "date-fns";

// Slot times must render in the VISITOR'S timezone, so formatting happens
// client-side from ISO strings (server-rendered times would be UTC).

export function NextTimePills({ slots }: { slots: string[] }) {
  return (
    <div className="flex flex-wrap gap-[8px]">
      {slots.map((iso) => (
        <a
          key={iso}
          href="/tony#book"
          className="rounded-full border border-line bg-white px-[15px] py-[9px] text-[13.5px] font-semibold text-ink transition-all hover:-translate-y-[1px] hover:border-accent hover:text-accent"
        >
          {format(new Date(iso), "EEE, MMM d · h:mm a")}
        </a>
      ))}
      <a
        href="/tony#book"
        className="rounded-full px-[15px] py-[9px] text-[13.5px] font-semibold text-accent"
      >
        All times &rarr;
      </a>
    </div>
  );
}

export function NextTimeInline({ iso }: { iso: string | null }) {
  if (!iso) return null;
  return <>{format(new Date(iso), "EEE h:mm a")}</>;
}
