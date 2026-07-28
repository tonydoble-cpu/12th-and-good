import Link from "next/link";
import BrandMark from "@/components/BrandMark";

type Props = {
  /** Primary CTA on the right side of the nav. Omit to render none (used on the coach profile page). */
  cta?: { label: string; href: string } | null;
};

export default function Header({
  cta = { label: "Talk to us", href: "/employers#contact" },
}: Props) {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-[rgba(245,244,241,0.82)] backdrop-blur-md">
      <div className="flex items-center justify-between px-6 md:px-10 py-[19px]">
        <Link
          href="/"
          className="flex items-center gap-[11px] font-display text-[20px] font-medium tracking-[-0.01em] text-ink"
        >
          <BrandMark size={24} className="-mt-[1px]" />
          <span>
            12th <span className="italic font-normal">&amp;</span> Good Street
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-[30px]">
          <Link
            href="/employers"
            className="text-sm font-medium text-ink-2 transition-colors hover:text-ink"
          >
            For employers
          </Link>
          <Link
            href="/employers#program"
            className="text-sm font-medium text-ink-2 transition-colors hover:text-ink"
          >
            How it works
          </Link>
          <Link
            href="/401k-questions"
            className="text-sm font-medium text-ink-2 transition-colors hover:text-ink"
          >
            401(k) Guide
          </Link>
          <Link
            href="/resources"
            className="text-sm font-medium text-ink-2 transition-colors hover:text-ink"
          >
            Resources
          </Link>
          <Link
            href="/employers#pricing"
            className="text-sm font-medium text-ink-2 transition-colors hover:text-ink"
          >
            Pricing
          </Link>
          <Link
            href="/about"
            className="text-sm font-medium text-ink-2 transition-colors hover:text-ink"
          >
            About
          </Link>
          <Link
            href="/blog"
            className="text-sm font-medium text-ink-2 transition-colors hover:text-ink"
          >
            Blog
          </Link>
          {cta && (
            <Link
              href={cta.href}
              className="inline-flex items-center gap-[9px] rounded-[9px] bg-accent px-[19px] py-[10px] text-sm font-semibold text-white shadow-[0_8px_22px_-12px_rgba(58,90,125,0.75)] transition-all hover:-translate-y-px hover:bg-accent-hover"
            >
              {cta.label}
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
