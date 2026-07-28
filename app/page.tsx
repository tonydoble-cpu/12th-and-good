import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Container from "@/components/Container";
import HomeFaq from "@/components/homeb/HomeFaq";
import HeroQuestionStack from "@/components/HeroQuestionStack";
import { priceForHeadcount } from "@/lib/program-pricing";
import { getQuestionBySlug } from "@/lib/questions";

// THE HOMEPAGE — rebuilt for the employer annual-program pivot (July 2026),
// re-skinned July 28 2026 (Phase 1 of the homepage rebuild) to match the
// approved dark-green/terracotta system: the hero and stats band now use
// the same --hero-* tokens as the /401k-questions tool, so the free tool
// and the marketing site read as one product. Everything from "How it
// works" down is unchanged this phase — that's Phase 2/3.

const STATS = [
  {
    n: "$0",
    l: "commissions, product fees, or kickbacks — ever.",
  },
  {
    n: "1",
    l: "flat annual fee, sized to your team. No per-user meter, no surprise bill when engagement grows.",
  },
  {
    n: "0",
    l: "data files, system integrations, or IT reviews required to start.",
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

// The rotating hero question stack — real slugs from the 401(k) library, in
// the order they appear on the approved homepage mockup. getQuestionBySlug
// is the single source of truth, so if wording ever changes in
// lib/questions-data.json, the hero updates automatically instead of
// silently drifting out of sync.
const HERO_QUESTION_SLUGS = [
  "what-is-a-401k-employer-match",
  "is-my-401k-match-actually-good",
  "how-do-i-even-start-with-401k",
  "pay-off-debt-or-invest-first",
  "am-i-too-late-to-catch-up-on-retirement",
  "what-happens-to-401k-match-when-i-leave-job",
  "how-much-will-i-actually-need-in-retirement",
  "am-i-saving-enough-401k",
];

export default function Home() {
  const heroCards = HERO_QUESTION_SLUGS.map((slug) => {
    const q = getQuestionBySlug(slug);
    return q ? { question: q.question, slug: q.slug } : null;
  }).filter((c): c is { question: string; slug: string } => c !== null);

  return (
    <div className="flex min-h-full flex-col">
      {/* DARK-GREEN BAND — nav + hero, matching the approved mockup */}
      <div className="bg-hero-green">
        <Header cta={{ label: "Talk to us", href: "/employers#contact" }} />

        <header>
          <Container
            width="wide"
            className="grid grid-cols-1 gap-12 py-16 md:py-20 lg:grid-cols-[1.1fr_0.9fr] lg:items-start"
          >
            <div>
              <div
                className="inline-flex items-center gap-2 rounded-full border px-[14px] py-[7px] text-[12.5px] font-medium"
                style={{
                  borderColor: "var(--hero-border)",
                  color: "var(--hero-cream-muted)",
                }}
              >
                <span className="dot-on-dark" />
                Employer-sponsored financial wellness
              </div>
              <h1
                className="mt-6 max-w-[620px] font-display text-[38px] font-normal leading-[1.1] tracking-[-0.021em] md:text-[54px]"
                style={{ color: "var(--hero-cream)" }}
              >
                Everyone on your payroll has money questions{" "}
                <span className="italic" style={{ color: "var(--hero-terra)" }}>
                  they&rsquo;ve never asked anyone.
                </span>
              </h1>
              <p
                className="mt-6 max-w-[520px] text-[17px] leading-[1.6] md:text-[19px]"
                style={{ color: "var(--hero-cream-muted)" }}
              >
                A named coach, on site and on call all year — for your newest
                hire and your leadership team alike. Not a portal. Not a
                per-employee meter running in the background.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-[14px]">
                <a
                  href="/employers#contact"
                  className="inline-flex items-center gap-[10px] rounded-full px-[28px] py-[15px] text-[16px] font-semibold transition-all hover:-translate-y-px"
                  style={{ background: "var(--hero-terra)", color: "#2c1608" }}
                >
                  Talk to us <span aria-hidden>&rarr;</span>
                </a>
                <a
                  href="#pricing-preview"
                  className="inline-flex items-center gap-[9px] rounded-full border px-[25px] py-[14px] text-[15px] font-semibold transition-all hover:bg-white/5"
                  style={{
                    borderColor: "var(--hero-border-hi)",
                    color: "var(--hero-cream)",
                  }}
                >
                  See pricing <span aria-hidden>&darr;</span>
                </a>
                <a
                  href="/401k-questions"
                  className="inline-flex items-center gap-[9px] rounded-full border px-[25px] py-[14px] text-[15px] font-semibold transition-all hover:bg-white/5"
                  style={{
                    borderColor: "var(--hero-border-hi)",
                    color: "var(--hero-cream)",
                  }}
                >
                  Free 401(k) answers <span aria-hidden>&rarr;</span>
                </a>
              </div>
            </div>

            <HeroQuestionStack cards={heroCards} />
          </Container>
        </header>
      </div>

      {/* STATS BAND — solid clay, three equal columns (matches mockup) */}
      <section style={{ background: "var(--clay)" }}>
        <Container width="wide">
          <div className="grid grid-cols-1 divide-y divide-white/15 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {STATS.map((s) => (
              <div key={s.l} className="py-8 first:pl-0 sm:px-8 sm:py-10">
                <p className="font-display text-[40px] font-normal leading-none text-hero-cream md:text-[48px]">
                  {s.n}
                </p>
                <p className="mt-3 max-w-[280px] text-[14.5px] leading-[1.5] text-hero-cream">
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
            className="mt-7 inline-flex items-center gap-[10px] rounded-[11px] bg-accent px-[30px] py-[15px] text-[16px] font-semibold text-white shadow-[0_14px_34px_-14px_rgba(184,80,43,0.55)] transition-all hover:-translate-y-px hover:bg-accent-hover"
          >
            Talk to us <span aria-hidden>&rarr;</span>
          </a>
        </Container>
      </section>

      <Footer />
    </div>
  );
}
