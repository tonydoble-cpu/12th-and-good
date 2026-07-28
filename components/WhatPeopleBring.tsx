"use client";

import { useState } from "react";

type Opener = { q: string; affect: string; a: string };

/**
 * Illustrative examples of what a first session opens with — not real
 * client quotes (nobody's session is ever recorded or quoted, by design;
 * see the privacy guarantees elsewhere on the site). Written in-voice to
 * show the range of what "anything counts" actually means, from a payday
 * loan to a 401(k) to a first kid. Click a card to see how the coach
 * actually opens the conversation.
 */
export default function WhatPeopleBring({ openers }: { openers: Opener[] }) {
  const [open, setOpen] = useState<number>(-1);

  return (
    <div className="flex flex-col gap-3">
      {openers.map((o, i) => {
        const on = open === i;
        return (
          <button
            key={o.q}
            onClick={() => setOpen(on ? -1 : i)}
            className={
              "rounded-[14px] border px-[20px] py-[16px] text-left transition-colors " +
              (on ? "border-line bg-white" : "border-line bg-surface hover:border-ink/25")
            }
          >
            <span className="flex items-center justify-between gap-4">
              <span className="font-display text-[16px] italic leading-[1.4] text-ink">
                &ldquo;{o.q}&rdquo;
              </span>
              <span
                className="shrink-0 text-[18px] text-muted transition-transform duration-200"
                style={{ transform: on ? "rotate(45deg)" : "none" }}
                aria-hidden
              >
                +
              </span>
            </span>
            {on && (
              <div className="mt-4 border-t border-[#f1efe9] pt-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">
                  What&rsquo;s actually at stake
                </p>
                <p className="mt-1.5 text-[14px] leading-[1.6] text-ink-2">
                  {o.affect}
                </p>
                <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.08em] text-accent">
                  How the coach opens it
                </p>
                <p className="mt-1.5 text-[14.5px] leading-[1.65] text-ink">
                  {o.a}
                </p>
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}
