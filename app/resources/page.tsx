import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Container from "@/components/Container";

const TOOLS = [
  {
    slug: "401k-calculator",
    kind: "Calculator",
    title: "401(k) & employer match calculator",
    body: "See how much of your employer match you're actually using — and what it could grow to over time.",
  },
  {
    slug: "debt-payoff",
    kind: "Planner",
    title: "Debt payoff planner",
    body: "Enter your debts and compare payoff strategies. See which order saves you the most in interest.",
  },
  {
    slug: "emergency-fund",
    kind: "Calculator",
    title: "Emergency fund calculator",
    body: "Find out how many months your savings would cover, and what a solid target looks like for you.",
  },
  {
    slug: "budget-builder",
    kind: "Tool",
    title: "Monthly budget builder",
    body: "A quick way to see where your money goes each month — and whether the balance feels right.",
  },
  {
    slug: "benefits-checkup",
    kind: "Checkup",
    title: "Benefits checkup",
    body: "A walkthrough of common employer benefits most people underuse. You might have more than you think.",
  },
  {
    slug: "wellness-assessment",
    kind: "Assessment",
    title: "Financial wellness checkup",
    body: "Ten questions, two minutes. A quick way to notice where money feels manageable and where it doesn't.",
  },
];

export default function ResourcesPage() {
  return (
    <div className="flex min-h-full flex-col">
      <Header />

      <header className="pt-20 pb-6">
        <Container>
          <div className="inline-flex items-center gap-2 rounded-full border border-[#dde5ec] bg-accent-tint px-[14px] py-[7px] text-[12.5px] font-medium text-ink-2 mb-5">
            <span className="dot" />
            Free &amp; open to everyone
          </div>
          <h1 className="font-display text-[36px] md:text-[50px] font-normal leading-[1.04] tracking-[-0.021em] text-ink">
            Tools &amp; resources
          </h1>
          <p className="mt-5 max-w-[560px] text-[18px] md:text-[20px] leading-[1.55] tracking-[-0.008em] text-ink-2">
            Useful things you can do right now, on your own, for free. If
            you want to go deeper on any of this, that&rsquo;s what the
            coaching is for.
          </p>
        </Container>
      </header>

      <section className="py-14">
        <Container>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {TOOLS.map((t) => (
              <Link
                key={t.slug}
                href={`/resources/${t.slug}`}
                className="group block overflow-hidden rounded-2xl border border-line bg-surface text-inherit no-underline transition-all duration-[240ms] ease-[cubic-bezier(0.2,0.7,0.3,1)] hover:-translate-y-[5px] hover:border-[#dcd8cf] hover:shadow-[0_26px_54px_-30px_rgba(20,30,45,0.42)]"
              >
                <div className="placeholder-swatch flex h-[140px] items-center justify-center border-0 border-b border-line text-[14px]">
                  {t.kind}
                </div>
                <div className="p-7">
                  <div className="text-[11.5px] font-semibold uppercase tracking-[0.17em] text-accent">
                    {t.kind}
                  </div>
                  <h3 className="mt-3 font-display text-[20px] font-medium text-ink group-hover:text-accent transition-colors">
                    {t.title}
                  </h3>
                  <p className="mt-[10px] text-[14px] leading-[1.6] text-muted">
                    {t.body}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-[6px] text-[14px] font-semibold text-accent">
                    Open tool <span aria-hidden>&rarr;</span>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* cta */}
      <section className="border-t border-line bg-surface py-16">
        <Container width="narrow" className="text-center">
          <h2 className="font-display text-[24px] md:text-[30px] font-medium text-ink">
            Want to go deeper?
          </h2>
          <p className="mx-auto mt-3 max-w-[480px] text-[16px] text-ink-2">
            These tools can get you started. A coach can help you figure out
            the specifics — and the intro call is free.
          </p>
          <Link
            href="/coaches"
            className="mt-6 inline-flex items-center gap-[9px] rounded-[9px] bg-accent px-[25px] py-[14px] text-[15px] font-semibold text-white shadow-[0_8px_22px_-12px_rgba(58,90,125,0.75)] transition-all hover:-translate-y-px hover:bg-accent-hover"
          >
            Book a free intro call <span aria-hidden>&rarr;</span>
          </Link>
        </Container>
      </section>

      <Footer />
    </div>
  );
}
