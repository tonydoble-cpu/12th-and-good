"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Attaches the fade/rise-in-on-scroll behavior to every `.reveal` element on
 * the page, per the design handoff's Motion spec. A 2.5s safety timeout
 * reveals everything even if the observer never fires, so content never
 * stays permanently hidden.
 *
 * Lives in the root layout, which persists across client-side navigations —
 * so the effect re-runs on pathname change to pick up each new page's
 * `.reveal` elements rather than only the ones present on first mount.
 */
export default function ScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>(".reveal"));
    if (els.length === 0) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.08 }
    );
    els.forEach((el) => io.observe(el));

    const timeout = setTimeout(() => {
      els.forEach((el) => el.classList.add("in"));
    }, 2500);

    return () => {
      io.disconnect();
      clearTimeout(timeout);
    };
  }, [pathname]);

  return null;
}
