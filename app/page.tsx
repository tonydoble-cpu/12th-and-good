import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Container from "@/components/Container";
import HomeFaq from "@/components/homeb/HomeFaq";
import HeroQuestionStack from "@/components/HeroQuestionStack";
import WhatPeopleBring from "@/components/WhatPeopleBring";
import SessionExcerpt from "@/components/SessionExcerpt";
import TestimonialCarousel from "@/components/TestimonialCarousel";
import ToolArt from "@/components/ToolArt";
import Link from "next/link";
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
    body: "Private sessions with the same coach every time, by phone, email, or Zoom. A spouse or partner is always welcome.",
  },
  {
    n: "03",
    title: "You see the impact, not the details",
    body: "Aggregate reporting on participation and themes — never a name, a number, or a situation.",
  },
];

const TIER_PREVIEW = [100, 200, 350, 500];

// "What people bring" — illustrative openers from the approved mockup,
// written in-voice to show the actual range "anything counts" covers.
// Not real client quotes — nobody's session is ever recorded, by design.
const OPENERS = [
  {
    q: "I'm juggling credit cards, a car loan, and a payday loan. I don't know what to tackle first.",
    affect: "Focus, stress, and the ability to feel present at work.",
    a: "The payday loan first — and not because it's the biggest. It's the one compounding fastest against you.",
  },
  {
    q: "My mom needs help with rent, but I'm already stretched thin.",
    affect: "Mental bandwidth, family stress, and difficult financial decisions.",
    a: "First we separate “I can't say no” from “I can afford this.” Right now those two sentences are doing the same job.",
  },
  {
    q: "I got a bonus. Should I save it, invest it, or pay down debt?",
    affect: "Whether an important financial opportunity becomes progress or disappears into everyday spending.",
    a: "Before we allocate a dollar: is anything you owe above 18%? That's arithmetic, not investing.",
  },
  {
    q: "We want to start a family in the next few years. How do we prepare financially?",
    affect: "Benefits decisions, savings priorities, and confidence about the future.",
    a: "Bring your partner. Then we rehearse — you live on the post-baby number now and bank the difference.",
  },
  {
    q: "Am I doing enough with my 401(k), or am I just guessing?",
    affect: "Retirement confidence and whether employees understand the benefits already available to them.",
    a: "Let's read your actual plan document together. Most people have never once seen theirs.",
  },
  {
    q: "I earn a good living. Why do I still feel like I'm falling behind?",
    affect: "Financial confidence, stress, and the feeling that earning more should have solved everything.",
    a: "Then the problem was never income. We find where the money goes before we judge a single line of it.",
  },
];

// "What a session sounds like" — same source as OPENERS: illustrative,
// written in-voice, not a real transcript. Kept short (2 scenarios) rather
// than the mockup's full 6 — enough to make the format land without turning
// the homepage into a content library.
const CONVOS = [
  {
    q: "My mom needs help with rent and I can't say no.",
    beats: [
      { who: "them" as const, text: "My mom needs help with rent and I can't say no. Is that going to wreck me?" },
      { who: "coach" as const, text: "No. But “I can't say no” and “I can afford this” are two different sentences, and right now they're doing the same job. Let's separate them." },
      { who: "coach" as const, text: "How much, how often, and since when?" },
      { who: "them" as const, text: "About $600. Every month. Since March." },
      { who: "coach" as const, text: "So $5,400 this year. That's not a leak, it's a line item. Let's name it, fund it on purpose, and find out what it's actually displacing." },
      { who: "them" as const, text: "…my emergency fund, probably." },
      { who: "coach" as const, text: "Then that's the real problem, and it's fixable. Next month we build the number you can give without borrowing from future-you — and we practice the conversation with your mom. That's the harder half." },
      { who: "end" as const, text: "Nothing was recommended. Nothing was sold." },
    ],
  },
  {
    q: "I have $9,000 in credit card debt my partner doesn't know about.",
    beats: [
      { who: "them" as const, text: "I have about $9,000 in credit card debt my partner doesn't know about. I've been paying the minimum for two years." },
      { who: "coach" as const, text: "Okay. Two problems here, and the money one is by far the easier of the two. We'll do that one first, so you have something to walk in with." },
      { who: "coach" as const, text: "Two years of minimums on $9,000 — do you know what you've paid in interest?" },
      { who: "them" as const, text: "No. I've never looked." },
      { who: "coach" as const, text: "We're going to look. Not to make you feel worse — because the number is the argument. It's what makes “I need help with this” land as a plan instead of a confession." },
      { who: "coach" as const, text: "Then we write the first sentence together. Not the whole conversation. Just the first sentence, because that's the one nobody can get out." },
      { who: "end" as const, text: "The plan is yours. The conversation is yours. We just made both survivable." },
    ],
  },
];

// Real quotes from real clients and workshop participants — supplied
// directly, lightly cleaned up for punctuation/capitalization only (no
// wording or meaning changed).
const TESTIMONIALS = [
  {
    quote:
      "Tony, you are an incredible gift to this community. Thank you for your continued partnership.",
    name: "Tacoma Public Schools",
    role: "",
  },
  {
    quote:
      "The kids really enjoyed your talk. I had four students stay after class to confirm information and talk further on the subject.",
    name: "Kerry",
    role: "9th–12th grade teacher",
  },
  {
    quote:
      "A great presentation! Tony's voice was calming; he was confident and knowledgeable.",
    name: "Wes Miller",
    role: "Construction, Business Development",
  },
  {
    quote: "Tony was extremely helpful. I felt heard and understood.",
    name: "Francisco M.",
    role: "Seattle non-profit",
  },
];

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
            className="grid grid-cols-1 gap-12 py-16 md:py-20 lg:grid-cols-[1.25fr_0.75fr] lg:items-start"
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
                className="mt-6 max-w-[660px] font-display text-[38px] font-normal leading-[1.1] tracking-[-0.021em] md:text-[50px]"
                style={{ color: "var(--hero-cream)" }}
              >
                Everyone on your
                <br />
                payroll has money questions
                <br />
                <span
                  className="italic"
                  style={{ color: "var(--hero-terra)", fontSize: "0.9em" }}
                >
                  they&rsquo;ve never asked anyone.
                </span>
              </h1>
              <p
                className="mt-6 max-w-[520px] text-[17px] leading-[1.6] md:text-[19px]"
                style={{ color: "var(--hero-cream-muted)" }}
              >
                Help employees feel less alone with money. One trusted
                financial coach, available by phone, email, or Zoom all
                year&mdash;for everyday questions and the decisions that
                actually matter.
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
          <div className="mx-auto mt-10 grid max-w-[980px] grid-cols-2 gap-5 sm:grid-cols-4">
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
                why most of it sits unused. We show up by phone, email, and
                Zoom, and reach out first.
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

      {/* WHAT PEOPLE BRING */}
      <section className="reveal border-b border-line bg-surface py-20">
        <Container width="wide">
          <div className="mb-[46px] max-w-[640px]">
            <p className="text-[11.5px] font-semibold uppercase tracking-[0.17em] text-accent">
              What people bring
            </p>
            <h2 className="mt-4 font-display text-[28px] md:text-[36px] font-normal leading-[1.08] tracking-[-0.019em] text-ink">
              &ldquo;Anything counts&rdquo; means what it says.
            </h2>
            <p className="mt-4 text-[15.5px] leading-[1.65] text-ink-2">
              Six real openers, and how a coach actually starts each one.
              Tap any of them.
            </p>
          </div>
          <div className="mx-auto max-w-[760px]">
            <WhatPeopleBring openers={OPENERS} />
          </div>
        </Container>
      </section>

      {/* SESSION EXCERPT */}
      <section className="reveal border-b border-line py-20">
        <Container width="wide">
          <div className="mb-[46px] max-w-[640px]">
            <p className="text-[11.5px] font-semibold uppercase tracking-[0.17em] text-accent">
              What it sounds like
            </p>
            <h2 className="mt-4 font-display text-[28px] md:text-[36px] font-normal leading-[1.08] tracking-[-0.019em] text-ink">
              Not a portal. An actual conversation.
            </h2>
            <p className="mt-4 text-[15.5px] leading-[1.65] text-ink-2">
              Pick a scenario and step through it beat by beat — the same
              pace an actual session moves at.
            </p>
          </div>
          <div className="mx-auto max-w-[760px]">
            <SessionExcerpt convos={CONVOS} />
          </div>
        </Container>
      </section>

      {/* THE FREE SHELF — dark-green band, the deliberate mid-page bookend.
          Everything here is live, free, and open to everyone; this section
          exists so the breadth of what's actually built is visible on first
          landing instead of buried behind the nav. */}
      <section className="reveal border-b border-line bg-hero-green py-20">
        <Container width="wide">
          <div className="mb-12 max-w-[640px]">
            <div
              className="inline-flex items-center gap-2 rounded-full border px-[14px] py-[7px] text-[12.5px] font-medium"
              style={{ borderColor: "var(--hero-border)", color: "var(--hero-cream-muted)" }}
            >
              <span className="dot-on-dark" />
              Free &amp; open to everyone — no signup, no pitch
            </div>
            <h2
              className="mt-6 font-display text-[28px] font-normal leading-[1.08] tracking-[-0.019em] md:text-[36px]"
              style={{ color: "var(--hero-cream)" }}
            >
              Most of what we built,
              <br />
              <span className="italic" style={{ color: "var(--hero-terra)" }}>
                you don&rsquo;t have to pay for.
              </span>
            </h2>
            <p className="mt-5 text-[16px] leading-[1.65]" style={{ color: "var(--hero-cream-muted)" }}>
              Real tools, usable today, whether your employer works with us or
              not. If they&rsquo;re useful, that tells you something about how
              we&rsquo;d treat your team.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {[
              {
                slug: "coach-ai",
                href: "/coach-ai",
                kind: "AI chat",
                title: "AI Money Coach",
                body: "Ask any money question in plain English, anytime. Trained in our coaching approach — it never pitches you anything.",
              },
              {
                slug: "401k-questions",
                href: "/401k-questions",
                kind: "Guide",
                title: "401(k) questions, answered",
                body: "A searchable library of plain-English answers — match, vesting, rollovers, fees, leaving a job.",
              },
              {
                slug: "plan-benchmark",
                href: "/employers/plan-benchmark",
                kind: "For employers",
                title: "Free 401(k) plan benchmark",
                body: "Answer a few questions about your match and vesting, see how your plan compares to published industry data.",
              },
            ].map((t) => (
              <Link
                key={t.slug}
                href={t.href}
                className="group block overflow-hidden rounded-2xl transition-all duration-[240ms] ease-[cubic-bezier(0.2,0.7,0.3,1)] hover:-translate-y-[5px]"
                style={{ background: "var(--hero-panel)", border: "1px solid var(--hero-border)" }}
              >
                <div className="h-[150px] overflow-hidden border-b" style={{ borderColor: "var(--hero-border)" }}>
                  <ToolArt slug={t.slug} />
                </div>
                <div className="p-6">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.17em]" style={{ color: "var(--hero-terra)" }}>
                    {t.kind}
                  </div>
                  <h3 className="mt-2.5 font-display text-[19px] font-medium" style={{ color: "var(--hero-cream)" }}>
                    {t.title}
                  </h3>
                  <p className="mt-2 text-[13.5px] leading-[1.6]" style={{ color: "var(--hero-cream-muted)" }}>
                    {t.body}
                  </p>
                  <span
                    className="mt-4 inline-flex items-center gap-[6px] text-[13.5px] font-semibold"
                    style={{ color: "var(--hero-terra)" }}
                  >
                    Open it <span aria-hidden>&rarr;</span>
                  </span>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-[14px]" style={{ color: "var(--hero-cream-muted)" }}>
            <span className="font-medium" style={{ color: "var(--hero-cream)" }}>
              Also free:
            </span>
            {[
              { href: "/employers/roi-calculator", label: "Employer ROI calculator" },
              { href: "/resources/debt-payoff", label: "Debt payoff planner" },
              { href: "/resources/emergency-fund", label: "Emergency fund calculator" },
              { href: "/resources/budget-builder", label: "Budget builder" },
              { href: "/resources/benefits-checkup", label: "Benefits checkup" },
            ].map((l) => (
              <Link key={l.href} href={l.href} className="underline-offset-4 transition-colors hover:underline" style={{ color: "var(--hero-cream-muted)" }}>
                {l.label}
              </Link>
            ))}
            <Link href="/resources" className="font-semibold" style={{ color: "var(--hero-terra)" }}>
              Everything free &rarr;
            </Link>
          </div>
        </Container>
      </section>

      {/* TESTIMONIALS */}
      <section className="reveal border-b border-line bg-surface py-20">
        <Container width="wide">
          <p className="text-center text-[11.5px] font-semibold uppercase tracking-[0.17em] text-accent">
            From the schools, teams, and communities Tony&rsquo;s worked with
          </p>
          <div className="mt-8">
            <TestimonialCarousel items={TESTIMONIALS} />
          </div>
          <p className="mx-auto mt-8 max-w-[520px] text-center text-[12px] italic leading-[1.5] text-muted">
            These are about talks, trainings, and partnerships — not private
            1:1 coaching sessions, which are never recorded and never shared.
          </p>
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
