import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Container from "@/components/Container";

export const metadata = {
  title: "Become a coach | 12th & Good Street",
  description:
    "We're hand-picking a founding cohort of fee-only financial coaches who reflect the people they serve.",
};

const STANDARDS = [
  {
    t: "Fee-only, full stop",
    b: "Your entire pay is the session fee. No commissions, no product referrals, no kickbacks — from anyone. If part of your income comes from selling financial products, this isn't the platform for you (and we say that with respect).",
  },
  {
    t: "Lived experience counts",
    b: "Our clients are often the first in their family to build wealth — the bridge, the safety net, the one figuring it out from scratch. Coaches who've walked some version of that road, or who come from the communities they serve, go to the front of the line.",
  },
  {
    t: "Plain English",
    b: "You can explain a 401(k) to someone who's never had one, without making them feel small for asking.",
  },
  {
    t: "Credentials or proof of work",
    b: "AFC, CFP, CPA, or years of documented coaching with people like our clients. We verify what you claim, and we show it on your profile so clients can verify it too.",
  },
];

export default function BecomeACoachPage() {
  return (
    <div className="flex min-h-full flex-col">
      <Header cta={{ label: "See the client side", href: "/blueprint" }} />
      <Container width="narrow" className="flex-1 pt-16 pb-24">
        <p className="text-[11.5px] font-semibold uppercase tracking-[0.17em] text-accent">
          Become a coach
        </p>
        <h1 className="mt-4 font-display text-[34px] md:text-[44px] font-normal leading-[1.08] tracking-[-0.02em] text-ink">
          Coach people, not products.
        </h1>
        <p className="mt-6 text-[17px] leading-[1.7] text-ink-2">
          12th &amp; Good Street is a marketplace for fee-only financial
          coaching, built for people who never got the family playbook. Your
          clients pay you directly. You never have to hit a product quota,
          and you never have to pretend a sales pitch is advice.
        </p>

        <h2 className="mt-12 font-display text-[24px] font-medium text-ink">
          The bar to join
        </h2>
        <div className="mt-4 flex flex-col gap-6">
          {STANDARDS.map((s) => (
            <div key={s.t} className="border-t border-line pt-5">
              <h3 className="text-[16.5px] font-semibold text-ink">{s.t}</h3>
              <p className="mt-2 text-[15px] leading-[1.7] text-ink-2">{s.b}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-[16px] border border-line bg-surface p-[22px]">
          <h2 className="font-display text-[21px] font-medium text-ink">
            The founding cohort is forming now
          </h2>
          <p className="mt-3 text-[15px] leading-[1.7] text-ink-2">
            We&rsquo;re hand-picking the first coaches one conversation at a
            time — founding coaches get input on the platform, priority
            placement, and the 100% founding-phase rate. Start by seeing what
            your future clients see: take the Money Blueprint, then reach out
            through any of our channels and tell us what you&rsquo;d bring to
            this corner. A real person reads every note (it&rsquo;s probably
            Tony).
          </p>
          <a
            href="/blueprint"
            className="mt-5 inline-flex items-center gap-[9px] rounded-[9px] bg-accent px-[22px] py-[13px] text-[15px] font-semibold text-white shadow-[0_8px_22px_-12px_rgba(58,90,125,0.75)] transition-all hover:-translate-y-px hover:bg-accent-hover"
          >
            Take the Blueprint first
          </a>
        </div>
      </Container>
      <Footer variant="simple" />
    </div>
  );
}
