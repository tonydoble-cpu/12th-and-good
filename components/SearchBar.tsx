import Link from "next/link";

export default function SearchBar({
  size = "lg",
  className = "",
}: {
  size?: "lg" | "sm";
  className?: string;
}) {
  const height = size === "lg" ? 54 : 50;
  const fieldPadY = size === "lg" ? "py-4" : "py-[15px]";

  return (
    <div
      className={`flex items-stretch overflow-hidden rounded-full border border-line bg-white text-left shadow-[0_14px_40px_-20px_rgba(20,30,45,0.32)] ${className}`}
    >
      <div className={`flex-[1.5] ${fieldPadY} px-8 border-r border-[#efe9de]`}>
        <div className="text-[11px] font-semibold text-ink">
          What do you want to work on?
        </div>
        <div className="mt-[3px] text-[14.5px] text-[#a7a196]">
          Budget, debt, buying a home…
        </div>
      </div>
      <div className={`flex-1 ${fieldPadY} px-[30px]`}>
        <div className="text-[11px] font-semibold text-ink">Session type</div>
        <div className="mt-[3px] text-[14.5px] text-[#a7a196]">
          Single or a plan
        </div>
      </div>
      <div className="flex items-center pr-[9px]">
        <Link
          href="/employers"
          aria-label="Search coaches"
          style={{ width: height, height }}
          className="flex items-center justify-center rounded-full bg-accent text-[21px] text-white transition-colors hover:bg-accent-hover"
        >
          &rarr;
        </Link>
      </div>
    </div>
  );
}
