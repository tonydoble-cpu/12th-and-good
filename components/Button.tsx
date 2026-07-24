import Link from "next/link";
import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "ghost" | "light" | "on-dark-ghost";

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-accent text-white shadow-[0_8px_22px_-12px_rgba(58,90,125,0.75)] hover:bg-accent-hover hover:-translate-y-px",
  ghost:
    "bg-transparent text-ink border border-line hover:border-ink hover:bg-white",
  light: "bg-white text-ink hover:-translate-y-px hover:shadow-[0_14px_30px_-14px_rgba(0,0,0,0.45)]",
  "on-dark-ghost":
    "bg-transparent text-white border border-white/30 hover:border-white hover:bg-white/10",
};

const base =
  "inline-flex items-center justify-center gap-[9px] rounded-[9px] px-[25px] py-[14px] font-semibold text-[15px] tracking-[-0.01em] transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none";

export function Button({
  variant = "primary",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return (
    <button
      className={`${base} ${variantClasses[variant]} ${className}`}
      {...props}
    />
  );
}

export function ButtonLink({
  href,
  variant = "primary",
  className = "",
  children,
}: {
  href: string;
  variant?: Variant;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Link href={href} className={`${base} ${variantClasses[variant]} ${className}`}>
      {children}
    </Link>
  );
}
