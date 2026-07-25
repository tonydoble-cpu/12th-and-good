// HOME-A — the quiz-first homepage, preserved after Tony chose the
// book-first variant (July 26, 2026). Kept reachable for reference/A-B;
// not indexed.
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Container from "@/components/Container";
import CoachCard from "@/components/CoachCard";
import { JoiningSoonCard, BecomeCoachCard } from "@/components/JoiningSoonCard";
import { getCoachBySlug, getSessionTypes } from "@/lib/coach-data";
import { cheapestPaidPrice } from "@/lib/pricing";
import { ARCHETYPES } from "@/lib/archetypes";

const HOW_IT_WORKS = [
  {
    n: "01",
    title: "Look around",
    body: "Every coach here is fee-only and screened. Read their profile, see if the fit feels right.",
  },
  {
    n: "02",
    title: "Book a time",
    body: "Pick a time and tell your coach what you're working on — they show up prepared.",
  },
  {
    n: "03",
    title: "Have the conversation",
    body: "Show up over video with your real numbers and your real questions. That's all you need.",
  },
  {
    n: "04",
    title: "Leave with a plan",
    body: "You'll get a written plan in plain language, with steps you can start on the same week.",
  },
];

const TRUST = [
  { title: "Fee-only", body: "Your coach is paid by you, not by a product company or a commission. That's the whole arrangement." },
  {
    title: "Conflict-free",
    body: "There's no hidden incentive behind the advice. If a coach recommends something, it's because they think it helps you.",
  },
  {
    title: "Vetted coaches",
    body: "Every coach is credentialed, experienced, and screened before they join — not everyone who applies gets in.",
  },
  { title: "Advice is the product", body: "There's nothing else for sale. The session itself is what you're paying for, and that's what makes the conversation different." },
];

const RESOURCES = [
  {
    kind: "Calculator",
    title: "401(k) & employer match calculator",
    body: "See how much of your employer match you're actually using — and what the gap costs over time.",
    cover: "calculator preview",
    href: "/resources/401k-calculator",
  },
  {
    kind: "Planner",
    title: "Debt payoff planner",
    body: "Run your numbers and see what different payoff orders look like.",
    cover: "planner preview",
    href: "/resources/debt-payoff",
  },
  {
    kind: "Checkup",
    title: "Benefits checkup",
    body: "A quick walkthrough of employer benefits most people underuse. You might have more than you think.",
    cover: "checkup preview",
    href: "/resources/benefits-checkup",
  },
];

export const metadata = {
  title: "Homepage variant A | 12th & Good Street",
  robots: { index: false, follow: false },
};

export default async function Home() {
  const coach = await getCoachBySlug("tony");
  const sessionTypes = coach ? await getSessionTypes(coach.id) : [];
  const fromPrice = cheapestPaidPrice(sessionTypes);

  return (
    <div className="flex min-h-full flex-col">
      <Header />

      {/* hero */}
      <header className="pt-24 pb-[76px] text-center">
        <Container>
          <div className="chip mx-auto mb-[26px] inline-flex items-center gap-2 rounded-full border border-[#dde5ec] bg-accent-tint px-[14px] py-[7px] text-[12.5px] font-medium text-ink-2">
            <span className="dot" />
            Conflict-free financial coaching
          </div>
          <h1 className="mx-auto max-w-[840px] font-display text-[40px] md:text-[62px] font-normal leading-[1.04] tracking-[-0.021em] text-ink">
            Talk to someone who has{" "}
            <span className="text-accent">nothing to sell you.</span>
          </h1>
          <p className="mx-auto mt-7 max-w-[600px] text-[18px] md:text-[20px] leading-[1.55] tracking-[-0.008em] text-ink-2">
            A vetted, fee-only coach who&rsquo;s lived what you&rsquo;re living
            — paid by you, never by a product company. You bring the real
            questions; they bring a real plan.
          </p>

          <div className="mt-10 flex flex-col items-center gap-[14px]">
            <a
              href="/blueprint"
              className="inline-flex items-center gap-[10px] rounded-[11px] bg-accent px-[34px] py-[17px] text-[16.5px] font-semibold text-white shadow-[0_14px_34px_-14px_rgba(58,90,125,0.85)] transition-all hover:-translate-y-px hover:bg-accent-hover"
            >
              Get your free Money Blueprint <span aria-hidden>&rarr;</span>
            </a>
            <p className="text-[13.5px] tracking-[0.01em] text-muted">
              8 questions · 2 minutes · see your money style instantly — no
              email needed
            </p>
            <a
              href="/coaches"
              className="text-[14.5px] font-semibold text-accent hover:text-accent-hover"
            >
              or browse coaches <span aria-hidden>&rarr;</span>
            </a>
          </div>
        </Container>
      </header>

      {/* blueprint hook */}
      <section
        className="reveal border-y border-line bg-surface py-24"
        id="blueprint"
      >
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:items-center">
            <div>
              <p className="text-[11.5px] font-semibold uppercase tracking-[0.17em] text-accent">
                Start here — it&rsquo;s free
              </p>
              <h2 className="mt-4 font-display text-[30px] md:text-[41px] font-normal leading-[1.08] tracking-[-0.019em] text-ink">
                First, find out how you work with money.
              </h2>
              <p className="mt-6 text-[17px] md:text-[18px] leading-[1.6] text-ink-2">
                Eight questions, about two minutes. You&rsquo;ll get your money
                style — how you naturally handle money, the strength you
                already have, and the blind spot that quietly costs you — plus
                three moves for your next 90 days.
              </p>
              <a
                href="/blueprint"
                className="mt-8 inline-flex items-center gap-[9px] rounded-[9px] bg-accent px-[25px] py-[14px] text-[15px] font-semibold text-white shadow-[0_8px_22px_-12px_rgba(58,90,125,0.75)] transition-all hover:-translate-y-px hover:bg-accent-hover"
              >
                Take the quiz <span aria-hidden>&rarr;</span>
              </a>
              <p className="mt-4 text-[13px] text-muted">
                No account needed. Your money style shows instantly.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-[14px]">
              {Object.values(ARCHETYPES).map((a) => (
                <div
                  key={a.name}
                  className="rounded-xl border border-line bg-background p-5"
                >
                  <h3 className="font-display text-[18px] font-medium text-ink">
                    {a.name}
                  </h3>
                  <p className="mt-[6px] text-[13.5px] leading-[1.5] text-muted">
                    {a.tagline}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <hr className="mx-auto max-w-[1060px] border-line" />

      {/* coaches */}
      <section className="reveal pt-24 pb-[104px]" id="coaches">
        <Container>
          <div className="mb-[10px] flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="text-[11.5px] font-semibold uppercase tracking-[0.17em] text-accent">
                Meet the coaches
              </p>
              <h2 className="mt-4 font-display text-[32px] md:text-[41px] font-normal leading-[1.08] tracking-[-0.019em] text-ink">
                We&rsquo;re starting small — on purpose.
              </h2>
            </div>
            <span className="inline-flex items-center gap-2 rounded-full border border-[#dde5ec] bg-accent-tint px-[14px] py-[7px] text-[12.5px] font-medium text-ink-2">
              <span className="dot" />
              More coaches joining soon
            </span>
          </div>
          <p className="mb-9 max-w-[560px] text-[15px] text-muted">
            Every coach here is fee-only and screened before they join. More
            are coming — we&rsquo;d rather vet carefully than grow fast.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[22px]">
            {coach && (
              <CoachCard
                coach={coach}
                fromPriceCents={fromPrice}
                blurb="Budgeting · Debt paydown · First home · Investing & 401(k)s"
              />
            )}
            <JoiningSoonCard body="We're vetting the next cohort of conflict-free coaches." />
            <JoiningSoonCard body="Specialists in retirement, business, and more." />
            <BecomeCoachCard />
          </div>
        </Container>
      </section>

      {/* why we exist */}
      <section className="reveal border-y border-line bg-surface py-24">
        <Container width="narrow">
          <p className="text-[11.5px] font-semibold uppercase tracking-[0.17em] text-accent">
            Why we exist
          </p>
          <h2 className="mt-5 max-w-[640px] font-display text-[28px] md:text-[41px] font-normal leading-[1.08] tracking-[-0.019em] text-ink">
            A lot of financial &ldquo;advice&rdquo; has a product behind it.
          </h2>
          <p className="mt-[26px] text-[18px] md:text-[20px] leading-[1.55] tracking-[-0.008em] text-ink-2">
            The person helping you plan is sometimes paid a commission on
            what they recommend. Even good intentions can bend under that
            pressure — and it&rsquo;s not easy to see when it&rsquo;s happening.
          </p>
          <p className="mt-5 max-w-[680px] text-[17px] text-ink-2">
            We took that off the table. Our coaches don&rsquo;t sell products and
            don&rsquo;t earn commission. The only thing they&rsquo;re paid for
            is sitting down with you and helping you think through a decision.
            That&rsquo;s the whole model.
          </p>
        </Container>
      </section>

      {/* how it works */}
      <section className="reveal py-24" id="how">
        <Container>
          <div className="mb-[60px] text-center">
            <p className="text-[11.5px] font-semibold uppercase tracking-[0.17em] text-accent">
              How it works
            </p>
            <h2 className="mt-4 font-display text-[32px] md:text-[41px] font-normal leading-[1.08] tracking-[-0.019em] text-ink">
              Here&rsquo;s what it looks like.
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-9">
            {HOW_IT_WORKS.map((step) => (
              <div key={step.n}>
                <div className="font-display text-[34px] font-light leading-none text-accent">
                  {step.n}
                </div>
                <h3 className="mt-[18px] font-display text-[19px] font-medium text-ink">
                  {step.title}
                </h3>
                <p className="mt-[11px] text-[14.5px] text-muted">{step.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* founder story */}
      <section className="reveal bg-dark-section py-[100px] text-white">
        <Container width="narrow">
          <p className="text-[11.5px] font-semibold uppercase tracking-[0.17em] text-clay-soft">
            Why 12th &amp; Good
          </p>
          <h2 className="mt-5 max-w-[640px] font-display text-[28px] md:text-[41px] font-normal leading-[1.08] tracking-[-0.019em] text-white">
            The name is a real corner.
          </h2>
          <div className="mt-7 max-w-[680px] space-y-5 text-[17px] md:text-[18px] leading-[1.65] text-white/80">
            <p>
              When I was 12, the man from the power company knocked on our door
              on 12th Street. My mom was at work. He was kind about it — but I
              was a kid, I couldn&rsquo;t write a check, and the bill was due.
              The lights went off, and I sat in the dark waiting for her to
              come home.
            </p>
            <p>
              We weren&rsquo;t careless with money. We just had no one to talk
              to about it — no advisor, no playbook, no one a step ahead of us.
              12th &amp; Good is the corner I wish had existed: where the
              street you&rsquo;re from meets the guidance you deserve. Every
              coach here signed up to be the person my family never had.
            </p>
          </div>
          <p className="mt-8 font-display text-[17px] italic text-white/70">
            — Tony, founder
          </p>
        </Container>
      </section>

      {/* individuals / employers */}
      <section className="reveal py-24" id="employers">
        <Container>
          <div className="mb-[52px] text-center">
            <p className="text-[11.5px] font-semibold uppercase tracking-[0.17em] text-accent">
              Two ways in
            </p>
            <h2 className="mt-4 font-display text-[32px] md:text-[41px] font-normal leading-[1.08] tracking-[-0.019em] text-ink">
              For you, or for your whole team.
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-line bg-surface p-10 transition-all duration-[240ms] ease-[cubic-bezier(0.2,0.7,0.3,1)] hover:-translate-y-[5px] hover:border-[#dcd8cf] hover:shadow-[0_26px_54px_-30px_rgba(20,30,45,0.42)]">
              <h3 className="font-display text-[24px] font-medium text-ink">
                For individuals
              </h3>
              <p className="mt-[14px] min-h-[66px] text-[15px] text-muted">
                Book and pay on your own for a coach who works only for you.
                There&rsquo;s nothing else being sold during the session.
              </p>
              <ul className="my-5 space-y-0 text-[14.5px] text-ink-2">
                {[
                  "Transparent, all-in pricing",
                  "A written plan after every session",
                  "Matched to the right coach for your goals",
                ].map((item) => (
                  <li key={item} className="flex gap-[11px] py-[7px]">
                    <span className="dot mt-[7px]" />
                    {item}
                  </li>
                ))}
              </ul>
              <a
                href="/coaches"
                className="mt-4 inline-flex items-center gap-[9px] rounded-[9px] bg-accent px-[25px] py-[14px] text-[15px] font-semibold text-white shadow-[0_8px_22px_-12px_rgba(58,90,125,0.75)] transition-all hover:-translate-y-px hover:bg-accent-hover"
              >
                Browse coaches <span aria-hidden>&rarr;</span>
              </a>
            </div>
            <div className="rounded-2xl border border-line bg-surface p-10 transition-all duration-[240ms] ease-[cubic-bezier(0.2,0.7,0.3,1)] hover:-translate-y-[5px] hover:border-[#dcd8cf] hover:shadow-[0_26px_54px_-30px_rgba(20,30,45,0.42)]">
              <h3 className="font-display text-[24px] font-medium text-ink">
                For employers
              </h3>
              <p className="mt-[14px] min-h-[66px] text-[15px] text-muted">
                Sponsor coaching as a workplace benefit. You cover the cost;
                your team picks their own coach and books privately.
              </p>
              <ul className="my-5 space-y-0 text-[14.5px] text-ink-2">
                {[
                  "Sponsor sessions for your whole team",
                  "Private — you never see individual details",
                  "Simple per-seat or per-session plans",
                ].map((item) => (
                  <li key={item} className="flex gap-[11px] py-[7px]">
                    <span className="dot mt-[7px]" />
                    {item}
                  </li>
                ))}
              </ul>
              <a
                href="/employers"
                className="mt-4 inline-flex items-center gap-[9px] rounded-[9px] border border-line bg-transparent px-[25px] py-[14px] text-[15px] font-semibold text-ink transition-all hover:border-ink hover:bg-white"
              >
                Bring this to your company <span aria-hidden>&rarr;</span>
              </a>
            </div>
          </div>
        </Container>
      </section>

      {/* resources */}
      <section className="reveal border-y border-line bg-surface py-24" id="resources">
        <Container>
          <div className="mb-[38px] flex flex-wrap items-baseline justify-between gap-5">
            <div>
              <p className="text-[11.5px] font-semibold uppercase tracking-[0.17em] text-accent">
                Learn freely
              </p>
              <h2 className="mt-4 font-display text-[32px] md:text-[41px] font-normal leading-[1.08] tracking-[-0.019em] text-ink">
                Plain-English financial wellness.
              </h2>
            </div>
            <a
              href="/resources"
              className="inline-flex items-center gap-[6px] text-[15px] font-semibold text-accent hover:text-accent-hover"
            >
              Browse all resources <span aria-hidden>&rarr;</span>
            </a>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {RESOURCES.map((r) => (
              <a
                key={r.title}
                href={r.href}
                className="block overflow-hidden rounded-2xl border border-line bg-surface text-inherit no-underline transition-all duration-[240ms] ease-[cubic-bezier(0.2,0.7,0.3,1)] hover:-translate-y-[5px] hover:border-[#dcd8cf] hover:shadow-[0_26px_54px_-30px_rgba(20,30,45,0.42)]"
              >
                <div className="placeholder-swatch flex h-[158px] items-center justify-center border-0 border-b border-line">
                  {r.cover}
                </div>
                <div className="p-6">
                  <div className="text-[11.5px] font-semibold uppercase tracking-[0.17em] text-muted">
                    {r.kind}
                  </div>
                  <h3 className="mt-[11px] font-display text-[20px] font-medium text-ink">
                    {r.title}
                  </h3>
                  <p className="mt-[11px] text-[13.5px] text-muted">{r.body}</p>
                </div>
              </a>
            ))}
          </div>
        </Container>
      </section>

      {/* trust */}
      <section className="reveal py-24">
        <Container className="text-center">
          <p className="text-[11.5px] font-semibold uppercase tracking-[0.17em] text-accent">
            What makes us different
          </p>
          <h2 className="mt-4 font-display text-[32px] md:text-[41px] font-normal leading-[1.08] tracking-[-0.019em] text-ink">
            Why the conversation feels different here.
          </h2>
          <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[26px] text-left">
            {TRUST.map((t) => (
              <div key={t.title} className="border-t-2 border-accent pt-5">
                <h3 className="font-display text-[19px] font-medium text-ink">
                  {t.title}
                </h3>
                <p className="mt-[10px] text-[14px] text-muted">{t.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* final cta */}
      <section className="bg-accent py-[104px] text-center text-white">
        <Container width="narrow">
          <h2 className="mx-auto max-w-[680px] font-display text-[32px] md:text-[48px] font-normal text-white">
            It starts with a conversation.
          </h2>
          <p className="mx-auto mt-6 max-w-[520px] text-[18px] md:text-[20px] leading-[1.55] text-white/84">
            Whether it&rsquo;s for you or for your team — the first step is
            the same. Talk to someone who&rsquo;s there to help, not to sell.
          </p>
          <div className="mt-[38px] flex flex-wrap justify-center gap-[14px]">
            <a
              href="/blueprint"
              className="inline-flex items-center gap-[9px] rounded-[9px] bg-white px-[25px] py-[14px] text-[15px] font-semibold text-ink transition-all hover:-translate-y-px hover:shadow-[0_14px_30px_-14px_rgba(0,0,0,0.45)]"
            >
              Get your free Money Blueprint <span aria-hidden>&rarr;</span>
            </a>
            <a
              href="/coaches"
              className="inline-flex items-center gap-[9px] rounded-[9px] border border-white/30 bg-transparent px-[25px] py-[14px] text-[15px] font-semibold text-white transition-all hover:border-white hover:bg-white/10"
            >
              Browse coaches
            </a>
          </div>
        </Container>
      </section>

      <Footer />
    </div>
  );
}
