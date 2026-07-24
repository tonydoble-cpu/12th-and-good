type Props = {
  size?: number;
  /** "light" for light backgrounds (default), "dark" for dark footers/sections. */
  tone?: "light" | "dark";
  className?: string;
};

/**
 * The Corner: two streets meeting at a curbed corner — 12th & Good.
 * The clay dot is the person standing on it. Curve, not a right angle,
 * so it reads as a street corner rather than a letter "L".
 */
export default function BrandMark({
  size = 24,
  tone = "light",
  className,
}: Props) {
  const road = tone === "dark" ? "#f5f4f1" : "var(--accent)";
  const clay = tone === "dark" ? "var(--clay-soft)" : "var(--clay)";
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M8 4.5 V15 A9.5 9.5 0 0 0 17.5 24.5 H27"
        stroke={road}
        strokeWidth={4.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="17.5" cy="12.3" r="4" fill={clay} />
    </svg>
  );
}
