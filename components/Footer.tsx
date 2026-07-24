import Link from "next/link";
import BrandMark from "@/components/BrandMark";

const wordmark = (
  <Link
    href="/"
    className="flex items-center gap-[11px] font-display text-[20px] font-medium tracking-[-0.01em] text-white"
  >
    <BrandMark size={24} tone="dark" className="-mt-[1px]" />
    <span>
      12th <span className="italic font-normal">&amp;</span> Good
    </span>
  </Link>
);

const tagline =
  "© 2026 12th & Good Street. The marketplace for better money conversations.";

export default function Footer({
  variant = "full",
}: {
  variant?: "full" | "simple";
}) {
  if (variant === "simple") {
    return (
      <footer className="bg-footer-bg px-6 md:px-10 py-10">
        <div className="mx-auto flex max-w-[1180px] flex-wrap items-center justify-between gap-8">
          {wordmark}
          <p className="text-xs text-[#767c86]">{tagline}</p>
        </div>
      </footer>
    );
  }

  return (
    <footer className="bg-[#15171b] px-6 md:px-10 pt-[60px] pb-11 text-[#aab0b9]">
      <div className="mx-auto flex max-w-[1060px] flex-wrap justify-between gap-8">
        <div className="max-w-[290px]">
          {wordmark}
          <p className="mt-[15px] text-[13px] leading-[1.6]">
            The marketplace for better money conversations.
          </p>
        </div>
        <div className="flex gap-[60px] text-[13.5px]">
          <div className="flex flex-col gap-3">
            <span className="mb-[3px] font-semibold text-white">Platform</span>
            <Link href="/coaches" className="text-[#aab0b9] hover:text-white">
              Browse coaches
            </Link>
            <Link href="/employers" className="text-[#aab0b9] hover:text-white">
              For employers
            </Link>
            <Link href="#" className="text-[#aab0b9] hover:text-white">
              Become a coach
            </Link>
          </div>
          <div className="flex flex-col gap-3">
            <span className="mb-[3px] font-semibold text-white">Learn</span>
            <Link href="/#resources" className="text-[#aab0b9] hover:text-white">
              Resources
            </Link>
            <Link href="/blog" className="text-[#aab0b9] hover:text-white">
              Blog
            </Link>
            <Link href="#" className="text-[#aab0b9] hover:text-white">
              Our model
            </Link>
            <Link href="#" className="text-[#aab0b9] hover:text-white">
              About
            </Link>
          </div>
        </div>
      </div>
      <div className="mx-auto mt-[38px] max-w-[1060px] border-t border-white/10 pt-6 text-xs text-[#767c86]">
        {tagline}
      </div>
    </footer>
  );
}
