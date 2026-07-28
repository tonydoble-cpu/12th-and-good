import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Container from "@/components/Container";
import EmployerContactForm from "@/components/EmployerContactForm";
import ProgramPricingCalculator from "@/components/tools/ProgramPricingCalculator";

const STATS = [
  {
    number: "59%",
    label: "of employees report financial stress",
    source: "PwC, 2026",
  },
  {
    number: "3.3 hrs",
    label: "per week lost to personal financial issues at work",
    source: "American Institute of Stress",
  },
  {
    number: "83%",
    label: "of Gen Z will use employer financial wellness when offered",
    source: "PwC, 2026",
  },
];

const DIFFERENT = [
  {
    title: "A person, not a portal",
    body: "Most financial wellness programs are a login to a tool that goes unused. This is a real conversation with a real person — and it tends to get used because it actually helps.",
  },
  {
    title: "No product behind the advice",
    body: "Coaches on 12th & Good Street are fee-only. They don't earn commission and don't sell products. That changes what they recommend, and your team can feel the difference.",
  },
  {
    title: "Private by default",
    body: "You sponsor the access. What someone discusses in their session stays between them and their coach. You see whether the benefit is being used, not what anyone said.",
  },
];

// The concrete version of "$0 commissions, product fees, or kickbacks" —
// naming the actual product categories a coach never earns from makes the
// abstract stat verifiable instead of just a slogan.
const NOT_SOLD = [
  "Mutual funds",
  "Annuities",
  "Life insurance",
  "Managed accounts",
  "Referral fees to advisors",
  "Lead generation",
  "Your people's data",
];

const PROGRAM = [
  {
    title: "1:1 coaching sessions",
    body: "Over video, with a vetted, fee-only coach. This is the core — a real conversation about whatever's on their mind.",
  },
  {
    title: "The Money Blueprint for every employee",
    body: "Their money style, their blind spot, and a 90-day plan — free to them, private from you. The door into coaching.",
  },
  {
    title: "Group sessions & lunch-and-learns",
    body: "A coach presents on a topic your team cares about — debt, investing basics, homebuying — and takes real questions afterward.",
  },
  {
    title: "Written plans & next steps",
    body: "Every session ends with something concrete. Not a binder — a short, plain-language plan they can act on the same week.",
  },
  {
    title: "AI Money Coach — 24/7 access",
    body: "Between sessions, your team can chat with an AI trained in our coaching approach. It answers money questions in plain English, anytime.",
  },
  {
    title: "Any money topic, no judgment",
    body: "Debt, budgeting, a first home, a big life change. There's no topic too basic and no situation too messy.",
  },
  {
    title: "Aggregate usage reporting",
    body: "You see how many people are using the benefit and whether it's landing — never an individual's numbers, notes, or plan.",
  },
];

const HOW = [
  {
    n: "01",
    title: "See your price, no call required",
    body: "Your tier is set by headcount, not negotiated — check the calculator above. When you're ready, we get your coach up to speed on your actual benefits and plan documents, and set a launch date.",
  },
  {
    n: "02",
    title: "Your team books privately",
    body: "Employees book time with their coach privately, on their own schedule. The cost is covered by you, and nobody has to ask permission or explain why.",
  },
  {
    n: "03",
    title: "You see the impact, not the details",
    body: "You get aggregate reporting — participation rates, session counts, topics by category. Never an individual's conversation, numbers, or plan.",
  },
];

export default function EmployersPage() {
  return (
    <div className="flex min-h-full flex-col">
      {/* dark-green hero band — matches the homepage and /401k-questions
          system exactly, so this landing page doesn't read as a different
          product from the rest of the site. Right column uses the real
          market-research stats instead of a stock "team photo" placeholder —
          concrete numbers do more work than decorative art, and it matches
          the homepage hero's pattern of a real, functional right column. */}
      <div className="bg-hero-green">
        <Header cta={{ label: "Talk to us", href: "#contact" }} />

        <header>
          <Container
            width="wide"
            className="grid grid-cols-1 gap-12 py-16 md:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:items-center"
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
                Financial wellness for your team
              </div>
              <h1
                className="mt-6 max-w-[560px] font-display text-[38px] font-normal leading-[1.1] tracking-[-0.021em] md:text-[50px]"
                style={{ color: "var(--hero-cream)" }}
              >
                Your team&rsquo;s money stress{" "}
                <span className="italic" style={{ color: "var(--hero-terra)" }}>
                  is already costing you.
                </span>
              </h1>
              <p
                className="mt-6 max-w-[480px] text-[17px] leading-[1.6] md:text-[19px]"
                style={{ color: "var(--hero-cream-muted)" }}
              >
                12th & Good Street is a financial wellness program built around
                something most programs skip — an actual conversation with
                someone who has nothing to sell.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-[14px]">
                <a
                  href="#contact"
                  className="inline-flex items-center gap-[10px] rounded-full px-[28px] py-[15px] text-[16px] font-semibold transition-all hover:-translate-y-px"
                  style={{ background: "var(--hero-terra)", color: "#2c1608" }}
                >
                  Let&rsquo;s talk about your team{" "}
                  <span aria-hidden>&rarr;</span>
                </a>
                <Link
                  href="/employers/roi-calculator"
                  className="inline-flex items-center gap-[9px] rounded-full border px-[25px] py-[14px] text-[15px] font-semibold transition-all hover:bg-white/5"
                  style={{
                    borderColor: "var(--hero-border-hi)",
                    color: "var(--hero-cream)",
                  }}
                >
                  Calculate your ROI
                </Link>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              {STATS.map((s) => (
                <div
                  key={s.number}
                  className="flex items-center gap-4 rounded-[14px] border px-[22px] py-[16px]"
                  style={{
                    borderColor: "var(--hero-border-hi)",
                    background: "var(--hero-panel)",
                  }}
                >
                  <div
                    className="font-display text-[30px] leading-none"
                    style={{ color: "var(--hero-terra)" }}
                  >
                    {s.number}
                  </div>
                  <div>
                    <div
                      className="text-[13.5px] leading-[1.4]"
                      style={{ color: "var(--hero-cream)" }}
                    >
                      {s.label}
                    </div>
                    <div
                      className="mt-[2px] text-[11px]"
                      style={{ color: "var(--hero-cream-muted)" }}
                    >
                      {s.source}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </header>
      </div>

      {/* the problem */}
      <section className="reveal py-24">
        <Container>
          <div className="mx-auto max-w-[720px]">
            <p className="text-[11.5px] font-semibold uppercase tracking-[0.17em] text-accent">
              The real cost
            </p>
            <h2 className="mt-4 font-display text-[28px] md:text-[40px] font-normal leading-[1.08] tracking-[-0.019em] text-ink">
              People bring money stress to work. It shows up as distraction,
              turnover, and disengagement.
            </h2>
            <p className="mt-6 text-[18px] md:text-[20px] leading-[1.6] tracking-[-0.008em] text-ink-2">
              Most workplace financial wellness looks like a portal nobody
              logs into, or a webinar with a product pitch waiting at the end.
              Employees know the difference. When the &ldquo;help&rdquo; is
              really a sales channel, people don&rsquo;t use it — and the
              stress stays.
            </p>
            <p className="mt-5 text-[18px] md:text-[20px] leading-[1.6] tracking-[-0.008em] text-ink-2">
              What actually works is simpler than most vendors make it sound:
              give people access to a real person they can trust, and let them
              talk about what&rsquo;s on their mind. That&rsquo;s what this
              program is.
            </p>
          </div>
        </Container>
      </section>

      {/* what makes this different */}
      <section className="reveal border-y border-line bg-surface py-24">
        <Container>
          <div className="mb-[52px] max-w-[640px]">
            <p className="text-[11.5px] font-semibold uppercase tracking-[0.17em] text-accent">
              Why 12th & Good
            </p>
            <h2 className="mt-4 font-display text-[28px] md:text-[40px] font-normal leading-[1.08] tracking-[-0.019em] text-ink">
              Human-first financial wellness.
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-[26px]">
            {DIFFERENT.map((w) => (
              <div key={w.title}>
                <span className="dot mb-4" style={{ width: 9, height: 9 }} />
                <h3 className="font-display text-[19px] font-medium text-ink">
                  {w.title}
                </h3>
                <p className="mt-[11px] text-[14.5px] text-muted">{w.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* benefits navigation */}
      <section className="reveal py-24">
        <Container>
          <div className="mx-auto grid max-w-[960px] grid-cols-1 lg:grid-cols-[1fr_1fr] gap-14 items-center">
            <div>
              <p className="text-[11.5px] font-semibold uppercase tracking-[0.17em] text-accent">
                Benefits navigation
              </p>
              <h2 className="mt-4 font-display text-[28px] md:text-[36px] font-normal leading-[1.08] tracking-[-0.019em] text-ink">
                Your team has benefits they&rsquo;re not fully using.
              </h2>
              <p className="mt-5 text-[16px] md:text-[17px] leading-[1.65] text-ink-2">
                Most employees don&rsquo;t fully understand what&rsquo;s
                available to them — they&rsquo;re leaving 401(k) match money
                on the table, skipping their HSA, or confused about disability
                coverage. A 12th & Good Street coach helps them understand and use the
                benefits you&rsquo;re already paying for.
              </p>
              <p className="mt-4 text-[16px] md:text-[17px] leading-[1.65] text-ink-2">
                That means better ROI on your existing benefits spend — not
                just another line item.
              </p>
            </div>
            <div className="rounded-2xl border border-line bg-surface p-8">
              <h3 className="font-display text-[18px] font-medium text-ink mb-5">
                Common gaps a coach can help close
              </h3>
              <div className="flex flex-col gap-4">
                {[
                  "Not contributing enough to get the full employer match",
                  "HSA or FSA available but unused",
                  "Life and disability coverage not understood",
                  "EAP exists but nobody knows about it",
                  "Tuition reimbursement going unclaimed",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3 text-[14.5px] text-ink-2">
                    <span className="dot mt-[6px]" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              <a
                href="/resources/benefits-checkup"
                className="mt-6 inline-flex items-center gap-[6px] text-[14px] font-semibold text-accent hover:text-accent-hover"
              >
                Try the free benefits checkup <span aria-hidden>&rarr;</span>
              </a>
            </div>
          </div>
        </Container>
      </section>

      {/* what the program includes */}
      <section className="reveal border-t border-line py-24" id="program">
        <Container>
          <div className="mb-[52px] text-center">
            <p className="text-[11.5px] font-semibold uppercase tracking-[0.17em] text-accent">
              The program
            </p>
            <h2 className="mt-4 font-display text-[28px] md:text-[40px] font-normal leading-[1.08] tracking-[-0.019em] text-ink">
              What your team gets access to.
            </h2>
            <p className="mx-auto mt-5 max-w-[560px] text-[16px] md:text-[17px] leading-[1.65] text-ink-2">
              Everything is built around the same idea: give people a safe
              place to talk about money with someone who&rsquo;s actually on
              their side.
            </p>
          </div>
          <div className="mx-auto grid max-w-[960px] grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[22px]">
            {PROGRAM.map((p) => (
              <div
                key={p.title}
                className="rounded-2xl border border-line bg-surface p-7 transition-all duration-[240ms] ease-[cubic-bezier(0.2,0.7,0.3,1)] hover:-translate-y-[3px] hover:border-[#dcd8cf] hover:shadow-[0_20px_44px_-24px_rgba(20,30,45,0.3)]"
              >
                <span className="dot mb-4" style={{ width: 9, height: 9 }} />
                <h3 className="font-display text-[17px] font-medium text-ink">
                  {p.title}
                </h3>
                <p className="mt-[9px] text-[14px] leading-[1.6] text-muted">
                  {p.body}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* how it works */}
      <section className="reveal border-y border-line bg-ink py-24 text-white" id="how">
        <Container>
          <div className="mb-[60px] text-center">
            <p className="text-[11.5px] font-semibold uppercase tracking-[0.17em] text-[#8fb0d0]">
              How it works
            </p>
            <h2 className="mt-4 font-display text-[28px] md:text-[40px] font-normal leading-[1.08] tracking-[-0.019em] text-white">
              Getting started is a conversation, not a procurement cycle.
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
            {HOW.map((step) => (
              <div key={step.n}>
                <div className="font-display text-[34px] font-light leading-none text-[#8fb0d0]">
                  {step.n}
                </div>
                <h3 className="mt-[18px] font-display text-[19px] font-medium text-white">
                  {step.title}
                </h3>
                <p className="mt-[11px] text-[14.5px] text-[#b7bcc4]">
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* pricing — firm annual tiers, published, not quoted behind a form */}
      <section className="reveal py-24" id="pricing">
        <Container>
          <div className="mb-5 text-center">
            <p className="text-[11.5px] font-semibold uppercase tracking-[0.17em] text-accent">
              Pricing
            </p>
            <h2 className="mt-4 font-display text-[28px] md:text-[40px] font-normal leading-[1.08] tracking-[-0.019em] text-ink">
              A flat annual fee, sized to your team.
            </h2>
          </div>
          <p className="mx-auto mb-8 max-w-[620px] text-center text-[15px] text-ink-2">
            One annual fee. Every employee can use it. No per-user meter, and
            no surprise bill when engagement grows. Firm tiers, not
            ranges — the number below is the number for your size.
          </p>

          <div className="mx-auto grid max-w-[960px] grid-cols-1 gap-8 lg:grid-cols-[1fr_1fr] lg:items-start">
            <div>
              <ProgramPricingCalculator />
              <p className="mt-4 text-[12.5px] leading-[1.6] text-ink-2">
                Under 50 people, most teams start with the{" "}
                <b className="text-ink">Founding Partner Pilot</b> — $9,500
                for 90 days, with $5,000 credited toward year one if you
                continue within 30 days ($12,000 for a larger team or a
                second location).
              </p>
              <p className="mt-3 text-[12.5px] leading-[1.6] text-ink-2">
                Many programs start with us in the room, not a login — happy
                to talk through what makes sense for your team on our first
                call.
              </p>
            </div>
            <div className="rounded-2xl border border-line bg-surface p-8">
              <h3 className="font-display text-[18px] font-medium text-ink mb-5">
                Every tier includes
              </h3>
              <ul className="space-y-0 text-sm text-ink-2">
                {[
                  "Private 1:1 sessions with the same coach every time — a spouse or partner is always welcome",
                  "Answers grounded in your own plan documents — your real match, deductible, and vesting schedule",
                  "A written plan after every conversation, theirs to keep — we don't keep a copy",
                  "Quarterly reporting on participation and themes — never a name, a number, or a situation",
                  "Nothing on file — no employee data stored, nothing to integrate, nothing to breach",
                ].map((item) => (
                  <li key={item} className="flex gap-[10px] py-[8px] border-t border-[#f1efe9] first:border-t-0">
                    <span className="dot mt-[7px]" />
                    {item}
                  </li>
                ))}
              </ul>
              <a
                href="#contact"
                className="mt-6 flex w-full items-center justify-center gap-[9px] rounded-[9px] bg-accent px-[25px] py-[14px] text-[15px] font-semibold text-white shadow-[0_8px_22px_-12px_rgba(58,90,125,0.75)] transition-all hover:-translate-y-px hover:bg-accent-hover"
              >
                Talk to us <span aria-hidden>&rarr;</span>
              </a>
            </div>
          </div>
        </Container>
      </section>

      {/* what we never sell — the concrete version of the $0 stat */}
      <section className="reveal py-20">
        <Container width="narrow" className="text-center">
          <p className="text-[11.5px] font-semibold uppercase tracking-[0.17em] text-accent">
            $0 commissions
          </p>
          <h2 className="mt-4 font-display text-[26px] md:text-[34px] font-normal leading-[1.1] tracking-[-0.019em] text-ink">
            We don&rsquo;t get paid to sell any of this.
          </h2>
          <p className="mx-auto mt-4 max-w-[540px] text-[15px] leading-[1.6] text-ink-2">
            Fee-only means fee-only. If a coach ever recommends something,
            it&rsquo;s because it&rsquo;s right for your employee — never
            because it pays a commission. Here&rsquo;s exactly what that rules
            out:
          </p>
          <div className="mx-auto mt-8 flex max-w-[640px] flex-wrap justify-center gap-[10px]">
            {NOT_SOLD.map((item) => (
              <span
                key={item}
                className="inline-flex items-center gap-[7px] rounded-full border border-line bg-white px-4 py-2 text-[13.5px] text-ink-2"
              >
                <span aria-hidden className="text-[12px] text-clay">
                  &times;
                </span>
                {item}
              </span>
            ))}
          </div>
        </Container>
      </section>

      {/* privacy callout */}
      <section className="reveal border-y border-line bg-surface py-16">
        <Container width="narrow" className="text-center">
          <div className="mx-auto mb-5 flex h-11 w-11 items-center justify-center rounded-xl border border-[#dde5ec] bg-accent-tint text-xl text-accent">
            &#128274;
          </div>
          <h3 className="font-display text-[24px] md:text-[26px] font-medium text-ink">
            Privacy is how this earns trust.
          </h3>
          <p className="mx-auto mt-[14px] max-w-[560px] text-base text-ink-2">
            Coaching is confidential. You see whether the benefit is being
            used — not who said what, and not anyone&rsquo;s personal numbers.
            Because coaches are fee-only, there&rsquo;s no product pitch
            waiting inside the session. That&rsquo;s what makes people
            willing to actually talk.
          </p>
        </Container>
      </section>

      {/* contact */}
      <section className="reveal py-24" id="contact">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-start">
            <div>
              <p className="text-[11.5px] font-semibold uppercase tracking-[0.17em] text-accent">
                Get started
              </p>
              <h2 className="mt-4 font-display text-[28px] md:text-[40px] font-normal leading-[1.08] tracking-[-0.019em] text-ink">
                Tell us about your team.
              </h2>
              <p className="mt-5 max-w-[420px] text-[18px] md:text-[20px] leading-[1.55] tracking-[-0.008em] text-ink-2">
                We&rsquo;ll set up a call to talk through what you&rsquo;re
                already offering, what&rsquo;s missing, and whether this
                would be a good fit. No pitch deck — just a conversation.
              </p>
              <div className="mt-8 flex flex-col gap-4">
                {[
                  "Founding-partner pricing while we launch",
                  "Flexible — no long-term contract required",
                  "A real person will reply (it's probably Tony)",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3 text-[15px] text-ink-2">
                    <span className="dot" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <EmployerContactForm />
          </div>
        </Container>
      </section>

      {/* final cta */}
      <section className="bg-accent py-24 text-center text-white">
        <Container width="narrow">
          <h2 className="mx-auto max-w-[640px] font-display text-[30px] md:text-[44px] font-normal text-white">
            Financial wellness that people actually use.
          </h2>
          <p className="mx-auto mt-[22px] max-w-[520px] text-[18px] md:text-[20px] leading-[1.55] text-white/84">
            Most programs sit on a shelf. This one is a conversation — and
            that&rsquo;s why it works.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-[14px]">
            <a
              href="#contact"
              className="inline-flex items-center gap-[9px] rounded-[9px] bg-white px-[25px] py-[14px] text-[15px] font-semibold text-ink transition-all hover:-translate-y-px hover:shadow-[0_14px_30px_-14px_rgba(0,0,0,0.45)]"
            >
              Let&rsquo;s talk <span aria-hidden>&rarr;</span>
            </a>
            <Link
              href="/"
              className="inline-flex items-center gap-[9px] rounded-[9px] border border-white/30 px-[25px] py-[14px] text-[15px] font-semibold text-white transition-all hover:border-white hover:bg-white/10"
            >
              See the platform
            </Link>
          </div>
        </Container>
      </section>

      <Footer />
    </div>
  );
}
