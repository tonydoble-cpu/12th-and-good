"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type Props = {
  coachName?: string;
  coachTitle?: string;
  coachImageUrl?: string;
  sessionTime?: string; // ISO string
};

const PREP_PROMPTS = [
  "What's the one money question that's been on your mind this week?",
  "If you could change one thing about your financial situation right now, what would it be?",
  "Is there a decision coming up — big or small — that has a money component?",
  "What would feel like progress for you after today's session?",
  "Is there anything about your benefits or paycheck you've been meaning to ask about?",
];

export default function WaitingRoom({
  coachName = "Tony",
  coachTitle = "Financial Wellness Coach",
  coachImageUrl,
  sessionTime,
}: Props) {
  const [promptIndex] = useState(
    () => Math.floor(Math.random() * PREP_PROMPTS.length)
  );
  const [prepNote, setPrepNote] = useState("");
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Calculate time until session
  const getTimeUntil = () => {
    if (!sessionTime || !now) return null;
    const target = new Date(sessionTime);
    const diff = target.getTime() - now.getTime();
    if (diff <= 0) return null;
    const mins = Math.floor(diff / 60000);
    const secs = Math.floor((diff % 60000) / 1000);
    return { mins, secs };
  };

  const timeUntil = getTimeUntil();

  return (
    <div className="flex min-h-dvh flex-col bg-ink text-white">
      {/* Header */}
      <header className="shrink-0 px-6 md:px-10 py-4">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-[11px] font-display text-[18px] font-medium tracking-[-0.01em] text-white"
          >
            <span className="flex h-[21px] w-[21px] items-center justify-center rounded-[5px] bg-white">
              <span
                className="rounded-full"
                style={{
                  background: "#1e2d3d",
                  width: 7,
                  height: 7,
                  display: "block",
                }}
              />
            </span>
            12th & Good
          </Link>
          <span className="text-[13px] text-[#8fb0d0]">1:1 coaching session</span>
        </div>
      </header>

      {/* Main content */}
      <main className="flex flex-1 flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-[520px] text-center">
          {/* Coach card */}
          <div className="mb-10 flex flex-col items-center">
            {coachImageUrl ? (
              <img
                src={coachImageUrl}
                alt={coachName}
                className="mb-4 h-[72px] w-[72px] rounded-2xl object-cover"
              />
            ) : (
              <div className="mb-4 flex h-[72px] w-[72px] items-center justify-center rounded-2xl bg-[#2a3d52] text-[28px] font-display font-medium text-white">
                {coachName.charAt(0)}
              </div>
            )}
            <p className="text-[13px] text-[#8fb0d0]">Your session with</p>
            <h2 className="mt-1 font-display text-[22px] font-medium text-white">
              {coachName}
            </h2>
            <p className="text-[14px] text-[#8fb0d0]">{coachTitle}</p>
            <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-emerald-500/20 px-3 py-1">
              <span
                className="rounded-full"
                style={{
                  background: "#34d399",
                  width: 7,
                  height: 7,
                  display: "block",
                }}
              />
              <span className="text-[12px] font-medium text-emerald-300">
                Available
              </span>
            </div>
          </div>

          {/* Status */}
          <h1 className="font-display text-[32px] md:text-[40px] font-medium leading-tight text-white">
            You&rsquo;re in the right place.
          </h1>
          <p className="mt-4 text-[16px] text-[#8fb0d0] leading-relaxed">
            Your coach will start the session shortly.
            {timeUntil && timeUntil.mins > 0 && (
              <span className="block mt-2 text-[14px]">
                Starting in about{" "}
                <span className="font-medium text-white tabular-nums">
                  {timeUntil.mins}:{timeUntil.secs.toString().padStart(2, "0")}
                </span>
              </span>
            )}
          </p>

          {/* Prep prompt */}
          <div className="mt-10 rounded-2xl border border-[#2a3d52] bg-[#1a2a3a] p-6 text-left">
            <p className="text-[12px] font-semibold uppercase tracking-[0.15em] text-[#8fb0d0] mb-3">
              While you wait
            </p>
            <p className="text-[16px] font-medium text-white leading-relaxed mb-4">
              {PREP_PROMPTS[promptIndex]}
            </p>
            <textarea
              value={prepNote}
              onChange={(e) => setPrepNote(e.target.value)}
              placeholder="Jot a note here — just for you, not shared with anyone..."
              rows={3}
              className="w-full resize-none rounded-xl border border-[#2a3d52] bg-[#0f1c2a] px-4 py-3 text-[14px] text-white placeholder:text-[#4a6a8a] focus:border-[#3a5a7d] focus:outline-none"
            />
            <p className="mt-2 text-[11px] text-[#4a6a8a]">
              This stays on your screen — it&rsquo;s not sent or saved anywhere.
            </p>
          </div>

          {/* Quick links */}
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/coach-ai"
              className="inline-flex items-center gap-2 rounded-xl border border-[#2a3d52] px-4 py-2.5 text-[13px] font-medium text-[#8fb0d0] transition-all hover:border-[#3a5a7d] hover:text-white"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              Chat with AI Money Coach
            </Link>
            <Link
              href="/resources"
              className="inline-flex items-center gap-2 rounded-xl border border-[#2a3d52] px-4 py-2.5 text-[13px] font-medium text-[#8fb0d0] transition-all hover:border-[#3a5a7d] hover:text-white"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
              </svg>
              Browse resources
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="shrink-0 px-6 md:px-10 py-4 text-center">
        <p className="text-[12px] text-[#4a6a8a]">
          Having trouble?{" "}
          <a href="mailto:tony@12thandgood.com" className="text-[#8fb0d0] hover:text-white">
            Reach out to us
          </a>
        </p>
      </footer>
    </div>
  );
}
