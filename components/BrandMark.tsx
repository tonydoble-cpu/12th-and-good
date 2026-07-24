type Props = {
  size?: number;
  /** "light" for light backgrounds (default), "dark" for dark footers/sections. */
  tone?: "light" | "dark";
  className?: string;
};

/**
 * The Confluence mark: two roads meeting and continuing as one —
 * your path joining a coach who has already walked it.
 * Slate = the road ahead; clay = the person arriving. Kept uneven on purpose.
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
        d="M9.5 28.5 16 15.5V4"
        stroke={road}
        strokeWidth={4.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M25 27 16 15.5"
        stroke={clay}
        strokeWidth={4.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
