"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";

// The Grow Therapy lesson: the page's ONE action never leaves the screen.
// Their filter bar follows you down the whole page; ours is a slim bar that
// slides in once the hero scrolls away — next real opening + Book.
// nextIso formats client-side so the time is the visitor's local time.

type Props = {
  nextIso: string | null;
};

export default function StickyBookBar({ nextIso }: Props) {
  const nextLabel = nextIso
    ? format(new Date(nextIso), "EEE h:mm a")
    : null;
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 520);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-50 px-0 pb-0 transition-transform duration-300 md:px-6 md:pb-5"
      style={{ transform: visible ? "translateY(0)" : "translateY(140%)" }}
      aria-hidden={!visible}
    >
      <div className="mx-auto flex max-w-[720px] items-center justify-between gap-3 border border-line bg-white/95 px-[18px] py-[11px] shadow-[0_18px_44px_-18px_rgba(20,30,45,0.45)] backdrop-blur-md max-md:border-x-0 md:rounded-full">
        <div className="min-w-0">
          <p className="truncate text-[13.5px] font-semibold text-ink">
            Talk to Tony{nextLabel ? ` — next opening ${nextLabel}` : ""}
          </p>
          <p className="text-[11.5px] text-muted max-sm:hidden">
            Fee-only · nothing to sell you · not worth it? You don&rsquo;t pay.
          </p>
        </div>
        <div className="flex flex-none items-center gap-[8px]">
          <a
            href="/blueprint"
            className="text-[13px] font-semibold text-accent max-sm:hidden"
          >
            Free Blueprint
          </a>
          <a
            href="/tony#book"
            className="rounded-full bg-accent px-[18px] py-[9px] text-[13.5px] font-semibold text-white transition-all hover:-translate-y-px hover:bg-accent-hover"
          >
            Book a session
          </a>
        </div>
      </div>
    </div>
  );
}
