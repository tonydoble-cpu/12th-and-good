import Link from "next/link";
import BrandMark from "@/components/BrandMark";

type Props = {
  /** Primary CTA on the right side of the nav. Omit to render none (used on the coach profile page). */
  cta?: { label: string; href: string } | null;
};

// Dark-green nav — matches the homepage mockup and the /401k-questions tool
// exactly (same --hero-green field, cream links, terracotta pill CTA), so
// the nav reads as one product wherever it sits, light page or dark tool.
export default function Header({
  cta = { label: "Talk to us", href: "/employers#contact" },
}: Props) {
  return (
    <header className="sticky top-0 z-40 border-b border-hero-border bg-hero-green">
      <div className="flex items-center justify-between px-6 md:px-10 py-[19px]">
        <Link
          href="/"
          className="flex items-center gap-[11px] font-display text-[20px] font-medium tracking-[-0.01em] text-hero-cream"
        >
          <BrandMark size={24} tone="dark" className="-mt-[1px]" />
          <span>
            12th <span className="italic font-normal">&amp;</span> Good Street
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-[30px]">
          <Link
            href="/employers#program"
            className="text-sm font-medium text-hero-cream-muted transition-colors hover:text-hero-cream"
          >
            How it works
          </Link>
          <Link
            href="/employers"
            className="text-sm font-medium text-hero-cream-muted transition-colors hover:text-hero-cream"
          >
            For employers
          </Link>
          <Link
            href="/employers#pricing"
            className="text-sm font-medium text-hero-cream-muted transition-colors hover:text-hero-cream"
          >
            Pricing
          </Link>
          <Link
            href="/about"
            className="text-sm font-medium text-hero-cream-muted transition-colors hover:text-hero-cream"
          >
            About
          </Link>
          <Link
            href="/resources"
            className="text-sm font-medium text-hero-cream-muted transition-colors hover:text-hero-cream"
          >
            Resources
          </Link>
          {cta && (
            <Link
              href={cta.href}
              className="inline-flex items-center gap-[9px] rounded-full bg-hero-terra px-[19px] py-[10px] text-sm font-semibold text-[#2c1608] transition-all hover:-translate-y-px hover:bg-hero-cream"
            >
              {cta.label}
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
