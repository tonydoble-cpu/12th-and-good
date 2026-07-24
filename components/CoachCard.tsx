"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/types";
import type { Coach } from "@/lib/types";

export default function CoachCard({
  coach,
  fromPriceCents,
  blurb,
  imageHeight = 210,
}: {
  coach: Coach;
  fromPriceCents: number;
  blurb: string;
  imageHeight?: number;
}) {
  const [liked, setLiked] = useState(false);

  return (
    <Link href={`/${coach.slug}`} className="block text-inherit no-underline">
      <div className="overflow-hidden rounded-2xl border border-line bg-surface text-left transition-all duration-[240ms] ease-[cubic-bezier(0.2,0.7,0.3,1)] hover:-translate-y-[5px] hover:border-[#dcd8cf] hover:shadow-[0_26px_54px_-30px_rgba(20,30,45,0.42)]">
        <div className="relative" style={{ height: imageHeight }}>
          <Image
            src={coach.photo_url ?? "/tony-doble.png"}
            alt={coach.full_name}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            style={{ objectPosition: "50% 20%" }}
            className="object-cover"
          />
          {coach.founding && (
            <span className="absolute top-[13px] left-[13px] rounded-full bg-white px-3 py-[6px] text-[11px] font-semibold text-ink shadow-[0_2px_10px_rgba(0,0,0,0.15)]">
              Founding coach
            </span>
          )}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              setLiked((v) => !v);
            }}
            aria-label={liked ? "Remove from saved" : "Save coach"}
            className="absolute top-3 right-3 flex h-[35px] w-[35px] items-center justify-center rounded-full bg-white/92 shadow-[0_2px_9px_rgba(0,0,0,0.14)]"
          >
            <span
              className="text-base transition-transform duration-150"
              style={{
                color: liked ? "var(--accent)" : "#c6c0b4",
                transform: liked ? "scale(1.12)" : "scale(1)",
              }}
            >
              &#9829;
            </span>
          </button>
        </div>
        <div className="px-5 pt-5 pb-[22px]">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-display text-[19px] font-medium text-ink">
              {coach.full_name}
            </h3>
            <span className="whitespace-nowrap text-[13px] text-ink-2">
              &#9733; New
            </span>
          </div>
          <p className="mt-1 text-[13px] font-semibold text-accent">
            Founding coach &middot; Online sessions
          </p>
          <p className="mt-[10px] text-[13px] leading-[1.5] text-muted">{blurb}</p>
          <hr className="my-4 border-line" />
          <div className="flex items-baseline justify-between">
            <span className="text-[14.5px] font-semibold text-ink">
              From {formatPrice(fromPriceCents)} / session
            </span>
            <span className="inline-flex items-center gap-[6px] text-[13px] font-semibold text-accent">
              View profile <span aria-hidden>&rarr;</span>
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
