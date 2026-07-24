const WIDTHS = {
  standard: "max-w-[1060px]",
  narrow: "max-w-[820px]",
  wide: "max-w-[1120px]",
  directory: "max-w-[1180px]",
} as const;

export default function Container({
  children,
  className = "",
  width = "standard",
}: {
  children: React.ReactNode;
  className?: string;
  width?: keyof typeof WIDTHS;
}) {
  return (
    <div className={`mx-auto w-full ${WIDTHS[width]} px-6 md:px-10 ${className}`}>
      {children}
    </div>
  );
}
