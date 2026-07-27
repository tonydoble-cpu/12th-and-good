import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Container from "@/components/Container";
import HomeFaq from "@/components/homeb/HomeFaq";
import { priceForHeadcount } from "@/lib/program-pricing";

// THE HOMEPAGE — rebuilt for the employer annual-program pivot (July 2026).
// Retired: the consumer book-a-coach homepage (per-session Stripe checkout,
// quiz-first funnel). This is a B2B sale to one buyer (HR/benefits leader),
// not a marketplace a consumer browses. See onepager/the-program.md and
// onepager/founder-context.md for the source content this mirrors.

const STATS = [
  {
    n: "$0",
    l: "commissions, product fees, or kickbacks — ever",
  },
  {
    n: "1",
    l: "flat annual fee, sized to your team — no per-user meter, no surprise bill when engagement grows",
  },
  {
    n: "0",
    l: "data files, system integrations, or IT reviews required to start",
  },
];

const HOW = [
  {
    n: "01",
    title: "See your price, no call required",
    body: "Your price is set by headcount, not negotiated — see it below. Then we get your coach ready and set a launch date.",
  },
  {
    n: "02",
    title: "Everyone on payroll gets access",
    body: "Private sessions with the same coach every time, on site and on video. A spouse or partner is always welcome.",
  },
  {
    n: "03",
    title: "You see the impact, not the details",
    body: "Aggregate reporting on participation and themes — never a name, a number, or a situation.",
  },
];

const TIER_PREVIEW = [100, 200, 350];

export default function Home() {
  return (
    <div className="flex min-h-full flex-col">
      <Header cta={{ label: "Talk to us", href: "/employers#contact" }} />

      {/* HERO */}
      <header className="border-b border-line bg-surface">
        <Container width="wide" className="py-16 md:py-20">
          <div className="mx-auto max-w-[760px] text-center">
            <div className="chip mx-auto inline-flex items-center gap-2 rounded-full border border-[#dde5ec] bg-accent-tint px-[14px] py-[7px] text-[12.5px] font-medium text-ink-2">
              <span className="dot" />
              Employer-sponsored financial wellness
            </div>
            <h1 className="mx-auto mt-6 font-display text-[36px] font-normal leading-[1.08] tracking-[-0.021em] text-ink md:text-[54px]">
              Everyone on your payroll has money questions{" "}
              <span className="text-accent">they&rsquo;ve never asked anyone.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-[560px] text-[17px] leading-[1.6] text-ink-2 md:text-[19px]">
              A named coach, on site and on call all year — for your newest
              hire and your leadership team alike. Not a portal. Not a
              per-employee meter running in the background.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-[14px]">
              <a
                href="/employers#contact"
                className="inline-flex items-center gap-[10px] rounded-[11px] bg-accent px-[28px] py-[15px] text-[16px] font-semibold text-white shadow-[0_14px_34px_-14px_rgba(58,90,125,0.85)] transition-all hover:-translate-y-px hover:bg-accent-hover"
              >
                Talk to us <span aria-hidden>&rarr;</span>
              </a>
              <a
                href="/employers#pricing"
                className="inline-flex items-center gap-[9px] rounded-[9px] border border-line px-[25px] py-[14px] text-[15px] font-semibold text-ink transition-all hover:border-ink hover:bg-white"
              >
                See pricing for your team
              </a>
            </div>
          </div>
        </Container>
      </header>

      {/* HONEST NUMBERS BAND */}
      <section className="border-b border-line py-12">
        <Container width="wide">
          <div className="grid grid-cols-1 gap-8 text-center sm:grid-cols-3">
            {STATS.map((s) => (
              <div key={s.l}>
                <p className="font-display text-[38px] leading-none text-accent md:text-[44px]">
                  {s.n}
                </p>
                <p className="mx-auto mt-2 max-w-[280px] text-[14.5px] text-ink-2">
                  {s.l}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* HOW IT WORKS */}
      <section className="border-b border-line py-20" id="how">
        <Container width="wide">
          <p className="text-center text-[11.5px] font-semibold uppercase tracking-[0.17em] text-accent">
            How it works
          </p>
          <h2 className="mt-4 text-center font-display text-[28px] font-normal leading-[1.1] tracking-[-0.019em] text-ink md:text-[36px]">
            A conversation, not a procurement cycle.
          </h2>
          <div className="mt-12 grid grid-cols-1 gap-10 md:grid-cols-3">
            {HOW.map((s) => (
              <div key={s.n}>
                <p className="font-display text-[28px] text-accent">{s.n}</p>
                <h3 className="mt-3 text-[16.5px] font-semibold text-ink">
                  {s.title}
                </h3>
                <p className="mt-2 text-[14.5px] leading-[1.65] text-ink-2">
                  {s.body}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* PRICING PREVIEW — published, not gated behind a form */}
      <section className="reveal border-b border-line bg-surface py-20" id="pricing-preview">
        <Container width="wide">
          <div className="mx-auto max-w-[640px] text-center">
            <p className="text-[11.5px] font-semibold uppercase tracking-[0.17em] text-accent">
              Pricing, published
            </p>
            <h2 className="mt-4 font-display text-[28px] font-normal leading-[1.08] tracking-[-0.019em] text-ink md:text-[36px]">
              A firm annual fee for your size — not a quote behind a form.
            </h2>
            <p className="mt-5 text-[16px] leading-[1.6] text-ink-2">
              One annual fee. Every employee can use it. No per-user meter,
              and no surprise bill when engagement grows.
            </p>
          </div>
          <div className="mx-auto mt-10 grid max-w-[820px] grid-cols-1 gap-5 sm:grid-cols-3">
            {TIER_PREVIEW.map((n) => {
              const r = priceForHeadcount(n);
              if (r.soft) return null;
              return (
                <div
                  key={n}
                  className="rounded-2xl border border-line bg-white p-6 text-center"
                >
                  <p className="text-[12px] font-medium text-muted">
                    up to {n} employees
                  </p>
                  <p className="mt-2 font-display text-[30px] text-ink">
                    ${(r.price / 1000).toFixed(0)}k
                    <span className="text-[13px] font-sans text-muted">/yr</span>
                  </p>
                  <p className="mt-1 text-[12px] text-ink-2">{r.label.replace("Annual Program — ", "")}</p>
                </div>
              );
            })}
          </div>
          <div className="mt-8 text-center">
            <a
              href="/employers#pricing"
              className="text-[15px] font-semibold text-accent hover:text-accent-hover"
            >
              Type in your own headcount &rarr;
            </a>
          </div>
        </Container>
      </section>

      {/* WHAT EMPLOYEES EXPERIENCE */}
      <section className="reveal border-b border-line py-20">
        <Container width="wide">
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-3">
            <div>
              <p className="font-display text-[19px] font-medium text-ink">
                We come to them.
              </p>
              <p className="mt-2 text-[14.5px] leading-[1.6] text-ink-2">
                Most financial wellness waits for someone to log in — which is
                why most of it sits unused. We show up, on site and on video,
                and reach out first.
              </p>
            </div>
            <div>
              <p className="font-display text-[19px] font-medium text-ink">
                Partners welcome.
              </p>
              <p className="mt-2 text-[14.5px] leading-[1.6] text-ink-2">
                Money is a household decision. A plan the other person never
                heard is a plan that doesn&rsquo;t happen — a spouse or
                partner can always sit in.
              </p>
            </div>
            <div>
              <p className="font-display text-[19px] font-medium text-ink">
                Anything counts.
              </p>
              <p className="mt-2 text-[14.5px] leading-[1.6] text-ink-2">
                Not just 401(k) and budgeting. A parent they help. A move. A
                medical bill. Nobody has a 401(k) question in June.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* FOUNDER */}
      <section className="border-b border-line bg-[#15171b] py-16 text-white">
        <Container width="narrow">
          <p className="text-[11.5px] font-semibold uppercase tracking-[0.17em] text-[var(--clay-soft)]">
            Why this corner exists
          </p>
          <p className="mt-5 font-display text-[22px] font-normal leading-[1.4] tracking-[-0.01em] md:text-[26px]">
            &ldquo;When I was 12, the power company shut our lights off while
            my mom was at work. We weren&rsquo;t careless with money — we just
            had no one to talk to about it. I built this to be the person my
            family didn&rsquo;t have.&rdquo;
          </p>
          <div className="mt-5 flex items-center justify-between">
            <p className="text-[14px] text-white/70">— Tony, founder</p>
            <a href="/about" className="text-[14px] font-semibold text-white/90 hover:text-white">
              The whole story &rarr;
            </a>
          </div>
        </Container>
      </section>

      {/* FAQ */}
      <section className="py-20" id="faq">
        <Container width="wide">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[0.8fr_1.2fr]">
            <h2 className="font-display text-[30px] font-normal leading-[1.1] tracking-[-0.019em] text-ink md:text-[36px]">
              The questions worth asking any financial wellness vendor.
            </h2>
            <HomeFaq />
          </div>
        </Container>
      </section>

      {/* CLOSE */}
      <section className="border-t border-line bg-surface py-16 text-center">
        <Container width="narrow">
          <h2 className="font-display text-[28px] font-normal leading-[1.1] tracking-[-0.019em] text-ink md:text-[34px]">
            Bring one question about your team.
          </h2>
          <p className="mx-auto mt-4 max-w-[440px] text-[16px] leading-[1.6] text-ink-2">
            No pitch deck — just a conversation about whether this is a fit,
            and a real number for your size before you hang up.
          </p>
          <a
            href="/employers#contact"
            className="mt-7 inline-flex items-center gap-[10px] rounded-[11px] bg-accent px-[30px] py-[15px] text-[16px] font-semibold text-white shadow-[0_14px_34px_-14px_rgba(58,90,125,0.85)] transition-all hover:-translate-y-px hover:bg-accent-hover"
          >
            Talk to us <span aria-hidden>&rarr;</span>
          </a>
        </Container>
      </section>

      <Footer />
    </div>
  );
}
