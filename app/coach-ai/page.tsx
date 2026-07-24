import Link from "next/link";
import CoachAIChat from "@/components/CoachAIChat";

export default function CoachAIPage() {
  return (
    <div className="flex h-dvh flex-col">
      {/* compact header for full-height chat */}
      <header className="shrink-0 border-b border-line bg-[rgba(245,244,241,0.82)] backdrop-blur-md">
        <div className="flex items-center justify-between px-6 md:px-10 py-3">
          <Link
            href="/"
            className="flex items-center gap-[11px] font-display text-[18px] font-medium tracking-[-0.01em] text-ink"
          >
            <span className="flex h-[21px] w-[21px] items-center justify-center rounded-[5px] bg-ink">
              <span className="dot" style={{ background: "#fff", width: 5, height: 5 }} />
            </span>
            12th & Good
          </Link>
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-flex items-center gap-2 rounded-full border border-[#dde5ec] bg-accent-tint px-3 py-1 text-[11.5px] font-medium text-ink-2">
              <span className="dot" style={{ width: 5, height: 5 }} />
              Money Coach
            </span>
            <Link
              href="/coaches"
              className="inline-flex items-center gap-[6px] rounded-lg bg-accent px-4 py-2 text-[13px] font-semibold text-white shadow-[0_4px_12px_-4px_rgba(58,90,125,0.5)] transition-all hover:-translate-y-px hover:bg-accent-hover"
            >
              Talk to a human <span aria-hidden>&rarr;</span>
            </Link>
          </div>
        </div>
      </header>

      {/* chat fills remaining height */}
      <CoachAIChat />
    </div>
  );
}
