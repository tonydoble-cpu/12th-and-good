export function JoiningSoonCard({
  body,
  minHeight = 352,
}: {
  body: string;
  minHeight?: number;
}) {
  return (
    <div
      className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#ddd7cb] px-[22px] py-8 text-center"
      style={{ minHeight }}
    >
      <div className="flex h-[46px] w-[46px] items-center justify-center rounded-full border-[1.5px] border-dashed border-[#bdb7aa] text-[22px] text-[#9a9488]">
        &#43;
      </div>
      <h3 className="font-display text-[17px] font-medium text-ink mt-[18px]">
        Joining soon
      </h3>
      <p className="mt-[9px] max-w-[180px] text-[12.5px] leading-[1.5] text-muted">
        {body}
      </p>
    </div>
  );
}

export function BecomeCoachCard({ minHeight = 352 }: { minHeight?: number }) {
  return (
    <a href="#" className="block text-inherit no-underline">
      <div
        className="flex flex-col items-start justify-end rounded-2xl border border-accent bg-accent p-7 text-left text-white transition-all duration-[240ms] ease-[cubic-bezier(0.2,0.7,0.3,1)] hover:-translate-y-[5px] hover:shadow-[0_26px_54px_-30px_rgba(20,30,45,0.42)]"
        style={{ minHeight }}
      >
        <span className="dot mb-auto" style={{ background: "#fff", width: 9, height: 9 }} />
        <h3 className="font-display text-[21px] font-medium text-white mt-4">
          Are you a fee-only coach?
        </h3>
        <p className="mt-[11px] text-[13px] leading-[1.55] text-white/84">
          We&rsquo;re building the founding cohort now. If you coach without
          selling products, we&rsquo;d like to hear from you.
        </p>
        <span className="mt-[18px] inline-flex items-center gap-[6px] text-[14px] font-semibold text-white">
          Become a coach <span aria-hidden>&rarr;</span>
        </span>
      </div>
    </a>
  );
}
