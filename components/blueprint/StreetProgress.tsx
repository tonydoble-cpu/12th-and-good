"use client";

// The quiz is a walk up Good Street: you start at 4th & Good, every answer
// moves you one block, and eight blocks later you arrive at 12th & Good.
// 4 + 8 questions = 12. The clay dot (the person from our brand mark) is
// you, walking. This replaces the anonymous progress dots — a test has a
// progress bar; a neighborhood has street corners.

const STREETS = [
  "4th", "5th", "6th", "7th", "8th", "9th", "10th", "11th", "12th",
];

type Props = {
  /** Blocks already walked: 0 = standing at 4th, 8 = arrived at 12th. */
  position: number;
  /** Accent for walked road + nodes (archetype accent post-gate). */
  accent?: string;
};

export default function StreetProgress({ position, accent }: Props) {
  const road = accent ?? "var(--accent)";
  const clamped = Math.max(0, Math.min(position, 8));
  const pct = (clamped / 8) * 100;
  const street = STREETS[clamped];
  const blocksLeft = 8 - clamped;

  return (
    <div aria-label={`You're at ${street} & Good — ${blocksLeft} blocks to 12th`}>
      {/* The road */}
      <div className="relative h-[26px]">
        {/* base road */}
        <div className="absolute left-0 right-0 top-1/2 h-[3px] -translate-y-1/2 rounded-full bg-black/[0.09]" />
        {/* walked road */}
        <div
          className="absolute left-0 top-1/2 h-[3px] -translate-y-1/2 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${pct}%`, background: road }}
        />
        {/* intersections */}
        {STREETS.map((s, i) => {
          const x = (i / 8) * 100;
          const walked = i <= clamped;
          const isEnd = i === 8;
          return (
            <span
              key={s}
              className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-[1.5px] transition-colors duration-300"
              style={{
                left: `${x}%`,
                width: isEnd ? 9 : 6,
                height: isEnd ? 9 : 6,
                transform: "translate(-50%,-50%) rotate(45deg)",
                background: walked ? road : "rgba(0,0,0,0.18)",
              }}
            />
          );
        })}
        {/* you — the clay dot, walking */}
        <span
          className="absolute top-1/2 h-[13px] w-[13px] rounded-full border-2 border-white shadow-[0_1px_5px_rgba(0,0,0,0.25)] transition-all duration-500 ease-out"
          style={{
            left: `${pct}%`,
            transform: "translate(-50%,-50%)",
            background: "var(--clay)",
          }}
        />
      </div>

      {/* Street sign */}
      <div className="mt-[7px] flex items-baseline justify-between">
        <span className="text-[11.5px] font-semibold uppercase tracking-[0.14em] text-ink">
          {`${street} & Good`}
        </span>
        <span className="text-[11px] font-medium uppercase tracking-[0.08em] text-muted">
          {blocksLeft === 0
            ? "You made it"
            : `${blocksLeft} block${blocksLeft === 1 ? "" : "s"} to 12th`}
        </span>
      </div>
    </div>
  );
}
