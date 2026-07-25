import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Container from "@/components/Container";
import EmployerContactForm from "@/components/EmployerContactForm";

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
    title: "We scope the program together",
    body: "We'll talk about your team's size, what you're already offering, and what would actually be useful. There's no standard package — we figure out the right fit.",
  },
  {
    n: "02",
    title: "Your team books privately",
    body: "Employees choose a coach and book on their own time. The cost is covered by you, and nobody has to ask permission or explain why.",
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
      <Header cta={{ label: "Talk to us", href: "#contact" }} />

      {/* hero */}
      <header className="py-24 md:py-28">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-14 items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#dde5ec] bg-accent-tint px-[14px] py-[7px] text-[12.5px] font-medium text-ink-2">
                <span className="dot" />
                Financial wellness for your team
              </div>
              <h1 className="mt-[22px] font-display text-[38px] md:text-[58px] font-normal leading-[1.04] tracking-[-0.021em] text-ink">
                Your team&rsquo;s money stress is already costing you.
              </h1>
              <p className="mt-6 max-w-[480px] text-[18px] md:text-[20px] leading-[1.55] tracking-[-0.008em] text-ink-2">
                12th & Good Street is a financial wellness program built around
                something most programs skip — an actual conversation with
                someone who has nothing to sell.
              </p>
              <div className="mt-[34px] flex flex-wrap gap-[14px]">
                <a
                  href="#contact"
                  className="inline-flex items-center gap-[9px] rounded-[9px] bg-accent px-[25px] py-[14px] text-[15px] font-semibold text-white shadow-[0_8px_22px_-12px_rgba(58,90,125,0.75)] transition-all hover:-translate-y-px hover:bg-accent-hover"
                >
                  Let&rsquo;s talk about your team{" "}
                  <span aria-hidden>&rarr;</span>
                </a>
                <Link
                  href="/employers/roi-calculator"
                  className="inline-flex items-center gap-[9px] rounded-[9px] border border-line px-[25px] py-[14px] text-[15px] font-semibold text-ink transition-all hover:border-ink hover:bg-white"
                >
                  Calculate your ROI
                </Link>
              </div>
            </div>
            <div className="placeholder-swatch flex h-[260px] md:h-[340px] items-center justify-center rounded-[18px]">
              team / workplace image
            </div>
          </div>
        </Container>
      </header>

      {/* stats band */}
      <section className="border-y border-line bg-surface py-14">
        <Container>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 text-center">
            {STATS.map((s) => (
              <div key={s.number}>
                <div className="font-display text-[40px] md:text-[48px] font-normal leading-none tracking-[-0.02em] text-accent">
                  {s.number}
                </div>
                <p className="mt-3 text-[15px] text-ink-2">{s.label}</p>
                <p className="mt-1 text-[12px] text-muted">{s.source}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

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

      {/* plans */}
      <section className="reveal py-24">
        <Container>
          <div className="mb-5 text-center">
            <p className="text-[11.5px] font-semibold uppercase tracking-[0.17em] text-accent">
              Pricing
            </p>
            <h2 className="mt-4 font-display text-[28px] md:text-[40px] font-normal leading-[1.08] tracking-[-0.019em] text-ink">
              Two ways to fund the program.
            </h2>
          </div>
          <p className="mx-auto mb-8 max-w-[560px] text-center text-[15px] text-ink-2">
            Start with a pilot you can approve without a committee — then
            scale what works.
          </p>

          {/* Founding pilot — a concrete, decidable offer. HR buyers can't
              take "flexible and negotiable" into a budget meeting. */}
          <div className="mx-auto mb-12 max-w-[820px] rounded-2xl border-2 border-accent bg-accent-tint p-8">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <h3 className="font-display text-[24px] font-medium text-ink">
                Founding Employer Pilot
              </h3>
              <p className="font-display text-[22px] text-ink">
                Flat per-employee rate
                <span className="text-[15px] text-ink-2"> · quoted in one call</span>
              </p>
            </div>
            <ul className="mt-4 grid grid-cols-1 gap-x-8 sm:grid-cols-2 text-sm text-ink-2">
              {[
                "One team or department — up to 50 people",
                "90 days, cancel anytime, no long contract",
                "Money Blueprint access for every employee",
                "A pool of 1:1 sessions with a fee-only coach",
                "Aggregate participation reporting (never individual data)",
                "Founding-partner rate locked for year one if you continue",
              ].map((item) => (
                <li key={item} className="flex gap-[10px] py-[5px]">
                  <span className="dot mt-[7px]" />
                  {item}
                </li>
              ))}
            </ul>
            <a
              href="#contact"
              className="mt-6 inline-flex w-full items-center justify-center gap-[9px] rounded-[9px] bg-accent px-[25px] py-[14px] text-[15px] font-semibold text-white shadow-[0_8px_22px_-12px_rgba(58,90,125,0.75)] transition-all hover:-translate-y-px hover:bg-accent-hover sm:w-auto"
            >
              Start the pilot conversation
            </a>
          </div>
          <div className="mx-auto grid max-w-[820px] grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-line bg-surface p-9 transition-all duration-[240ms] ease-[cubic-bezier(0.2,0.7,0.3,1)] hover:-translate-y-[5px] hover:border-[#dcd8cf] hover:shadow-[0_26px_54px_-30px_rgba(20,30,45,0.42)]">
              <h3 className="font-display text-[22px] font-medium text-ink">
                Session pool
              </h3>
              <p className="mt-[10px] min-h-[52px] text-[14.5px] text-muted">
                Fund a block of sessions your whole team can draw from.
                A good way to start and see how people use it.
              </p>
              <div className="mt-4 mb-1 font-display text-[30px] text-ink">
                Per session
              </div>
              <p className="text-[13px] text-muted">
                You fund a pool &middot; team books as needed
              </p>
              <ul className="my-[22px] space-y-0 text-sm text-ink-2">
                {[
                  "No per-employee commitment",
                  "Top up anytime",
                  "Includes group sessions",
                  "Aggregate usage reporting",
                ].map((item) => (
                  <li key={item} className="flex gap-[10px] py-[6px]">
                    <span className="dot mt-[7px]" />
                    {item}
                  </li>
                ))}
              </ul>
              <a
                href="#contact"
                className="flex w-full items-center justify-center gap-[9px] rounded-[9px] border border-line px-[25px] py-[14px] text-[15px] font-semibold text-ink transition-all hover:border-ink hover:bg-white"
              >
                Scope a pool
              </a>
            </div>
            <div className="rounded-2xl border border-accent bg-surface p-9 shadow-[0_24px_54px_-32px_rgba(58,90,125,0.5)]">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-[22px] font-medium text-ink">
                  Per-seat
                </h3>
                <span className="inline-flex items-center gap-2 rounded-full border border-[#dde5ec] bg-accent-tint px-[14px] py-[7px] text-[12.5px] font-medium text-ink-2">
                  <span className="dot" />
                  Full program
                </span>
              </div>
              <p className="mt-[10px] min-h-[52px] text-[14.5px] text-muted">
                Give every employee standing access to the full financial
                wellness program as an ongoing benefit.
              </p>
              <div className="mt-4 mb-1 font-display text-[30px] text-ink">
                Per employee / mo
              </div>
              <p className="text-[13px] text-muted">
                Ongoing access &middot; predictable budgeting
              </p>
              <ul className="my-[22px] space-y-0 text-sm text-ink-2">
                {[
                  "Every employee covered",
                  "Money Blueprint for everyone",
                  "Group sessions & lunch-and-learns",
                  "Onboarding & comms support",
                ].map((item) => (
                  <li key={item} className="flex gap-[10px] py-[6px]">
                    <span className="dot mt-[7px]" />
                    {item}
                  </li>
                ))}
              </ul>
              <a
                href="#contact"
                className="flex w-full items-center justify-center gap-[9px] rounded-[9px] bg-accent px-[25px] py-[14px] text-[15px] font-semibold text-white shadow-[0_8px_22px_-12px_rgba(58,90,125,0.75)] transition-all hover:-translate-y-px hover:bg-accent-hover"
              >
                Scope per-seat <span aria-hidden>&rarr;</span>
              </a>
            </div>
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
