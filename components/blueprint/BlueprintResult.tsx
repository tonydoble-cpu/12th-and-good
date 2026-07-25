"use client";

import { useEffect, useState } from "react";
import type { Archetype, ArchetypeId, QuizAnswer } from "@/lib/archetypes";

// Each money style gets the two free tools that fit it best — real value
// for people who aren't ready to book, already built at /resources/*.
const TOOLKIT: Record<ArchetypeId, { title: string; why: string; href: string }[]> = {
  bridge: [
    { title: "Budget Builder", why: "Room for them AND a line that's only yours.", href: "/resources/budget-builder" },
    { title: "Rainy-Day Fund", why: "A safety net for the safety net.", href: "/resources/emergency-fund" },
  ],
  builder: [
    { title: "401(k) Calculator", why: "See what your next level compounds into.", href: "/resources/401k-calculator" },
    { title: "Budget Builder", why: "Point the growth at a number you named.", href: "/resources/budget-builder" },
  ],
  guardian: [
    { title: "Rainy-Day Fund", why: "Know exactly when safe becomes too safe.", href: "/resources/emergency-fund" },
    { title: "Benefits Checkup", why: "Protection you may already be paying for.", href: "/resources/benefits-checkup" },
  ],
  reclaimer: [
    { title: "Debt Payoff Planner", why: "A date when the last payment happens.", href: "/resources/debt-payoff" },
    { title: "Budget Builder", why: "Built forward, not just away from the past.", href: "/resources/budget-builder" },
  ],
  steward: [
    { title: "401(k) Calculator", why: "See what deploying — not just keeping — does.", href: "/resources/401k-calculator" },
    { title: "Benefits Checkup", why: "Make what you've built work harder.", href: "/resources/benefits-checkup" },
  ],
  pathfinder: [
    { title: "Money Wellness Check", why: "A clear picture of where you actually are.", href: "/resources/wellness-assessment" },
    { title: "Budget Builder", why: "Your first system — one you choose.", href: "/resources/budget-builder" },
  ],
};

// Gate 2 payoff — the full personalized Blueprint. The three post-gate
// components (origin, need now, three steps) render here. Plus a share
// card and the transition to what's next (waitlist / coach match).

export default function BlueprintResult({
  archetype,
  email,
  postGateAnswers,
}: {
  archetype: Archetype;
  email: string;
  postGateAnswers: QuizAnswer[];
}) {
  const [mounted, setMounted] = useState(false);
  const [waitlistJoined, setWaitlistJoined] = useState(false);
  const [emailQueued, setEmailQueued] = useState(false);
  useEffect(() => setMounted(true), []);

  // Fire the final payload to the API — saves post-gate answers and, when
  // email is configured server-side, sends the Blueprint delivery email.
  // We only tell the user an email is coming if the API says one went out.
  useEffect(() => {
    fetch("/api/blueprint", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        email,
        archetype: archetype.id,
        postGateAnswers: postGateAnswers.map((a) => ({
          id: a.id,
          label: a.label,
        })),
        stage: "gate2",
      }),
    })
      .then((r) => r.json())
      .then((d) => setEmailQueued(Boolean(d?.emailQueued)))
      .catch(() => {});
  }, [email, archetype.id, postGateAnswers]);

  const goal = postGateAnswers.find((a) => a.id.startsWith("g"))?.label;
  const stage = postGateAnswers.find((a) => a.id.startsWith("s"))?.label;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="mx-auto w-full max-w-[640px] px-6 pb-16 pt-10">
        {/* Header */}
        <div
          className={`transition-all duration-700 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
          }`}
        >
          <div className="flex justify-center">
            <div
              className="flex items-center gap-2 rounded-full px-[13px] py-[6px] text-[12px] font-medium text-white"
              style={{ background: archetype.accent }}
            >
              <span
                className="h-[6px] w-[6px] rounded-[2px]"
                style={{
                  background: "rgba(255,255,255,0.9)",
                  transform: "rotate(45deg)",
                }}
              />
              <span>Welcome to 12th &amp; Good — your Blueprint</span>
            </div>
          </div>

          <h1 className="mt-6 text-center font-display text-[38px] font-medium leading-[1.05] tracking-[-0.02em] text-ink md:text-[44px]">
            {archetype.name}
          </h1>
          <p className="mt-3 text-center text-[16px] leading-[1.5] text-ink-2">
            {archetype.tagline}
          </p>
          <p className="mt-2 text-center text-[12.5px] uppercase tracking-[0.1em] text-muted">
            Motivation: {archetype.motivation}
          </p>
        </div>

        {/* Strength (recap so the page stands alone in email/PDF form) */}
        <Section
          label="Your natural strength"
          accent={archetype.accent}
          delay={100}
          mounted={mounted}
        >
          {archetype.strength}
        </Section>

        {/* Origin — the emotional hinge of the whole quiz */}
        <Section
          label="What may have shaped this"
          accent={archetype.accent}
          delay={200}
          mounted={mounted}
        >
          {archetype.origin}
        </Section>

        {/* Blind spot */}
        <Section
          label="The pattern to watch"
          accent={archetype.accent}
          delay={300}
          mounted={mounted}
          muted
        >
          {archetype.blindSpot}
        </Section>

        {/* Need now — the coach transition */}
        <Section
          label="What you likely need right now"
          accent={archetype.accent}
          delay={400}
          mounted={mounted}
        >
          {archetype.needNow}
        </Section>

        {/* The three practical moves — the payoff */}
        <div
          className={`mt-6 rounded-[18px] border-2 p-[24px] transition-all duration-700`}
          style={{
            borderColor: archetype.accent,
            background: "var(--surface)",
            transitionDelay: "500ms",
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(8px)",
          }}
        >
          <div className="flex items-center gap-2">
            <span
              className="h-[8px] w-[8px] rounded-[2px]"
              style={{ background: archetype.accent, transform: "rotate(45deg)" }}
            />
            <span className="text-[11.5px] font-semibold uppercase tracking-[0.1em] text-ink-2">
              Your three moves for the next 90 days
            </span>
          </div>
          <ol className="mt-4 flex flex-col gap-[14px]">
            {archetype.nextSteps.map((step, i) => (
              <li key={i} className="flex gap-3">
                <span
                  className="mt-[3px] flex h-[24px] w-[24px] flex-none items-center justify-center rounded-full text-[12.5px] font-semibold text-white"
                  style={{ background: archetype.accent }}
                >
                  {i + 1}
                </span>
                <span className="flex-1 pt-[2px] text-[15px] leading-[1.55] text-ink">
                  {step}
                </span>
              </li>
            ))}
          </ol>

          {(goal || stage) && (
            <p className="mt-5 border-t border-line pt-4 text-[13px] leading-[1.55] text-ink-2">
              You told us:{" "}
              {goal && <span className="font-medium text-ink">{goal.toLowerCase()}</span>}
              {goal && stage && " · "}
              {stage && <span className="font-medium text-ink">{stage.toLowerCase()}</span>}
              . These three moves are shaped with that in mind — and
              they&rsquo;re exactly the kind of thing a session digs
              into.
            </p>
          )}
        </div>

        {/* Confirmation — only promise an email when one actually sent */}
        <div
          className="mt-6 rounded-[13px] border border-line bg-surface/60 px-[18px] py-[14px] text-[13.5px] leading-[1.5] text-ink-2 transition-all duration-700"
          style={{
            transitionDelay: "600ms",
            opacity: mounted ? 1 : 0,
          }}
        >
          {emailQueued ? (
            <>
              A full copy of your Blueprint is on its way to{" "}
              <span className="font-medium text-ink">{email}</span>. Check spam
              if it doesn&rsquo;t land in the next few minutes.
            </>
          ) : (
            <>
              This page is yours — <span className="font-medium text-ink">
              screenshot your three moves</span> or save the link so you can
              come back to it.
            </>
          )}
        </div>

        {/* What's next — work it with Tony. No intro calls: the write-up at
            booking + the guarantee do the trust work a free call used to.
            Non-bookers aren't a dead end — they join the Corner (below). */}
        <div
          className="mt-4 rounded-[18px] p-[24px] text-white transition-all duration-700"
          style={{
            background: archetype.accent,
            transitionDelay: "700ms",
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(8px)",
          }}
        >
          <h3 className="font-display text-[24px] font-medium leading-[1.15] tracking-[-0.02em]">
            Work these moves with Tony.
          </h3>
          <p className="mt-2 text-[14.5px] leading-[1.55] text-white/85">
            Book a session, tell him what you&rsquo;re working on when you
            book, and he shows up already prepared — a written plan you can
            start the same week. And the promise is in writing: if your
            first session isn&rsquo;t worth every dollar, you don&rsquo;t
            pay.
          </p>
          <a
            href="/tony#book"
            className="mt-5 block w-full rounded-[10px] bg-white px-6 py-[13px] text-center text-[15px] font-semibold transition-all hover:-translate-y-px active:translate-y-0"
            style={{ color: archetype.accent }}
          >
            Book your session &rarr;
          </a>
        </div>

        {/* The Corner — belonging for people who aren't booking today.
            "You live here now" has to be clickable, not a slogan. */}
        <div
          className="mt-4 rounded-[18px] border border-line bg-surface p-[24px] transition-all duration-700"
          style={{
            transitionDelay: "750ms",
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(8px)",
          }}
        >
          <div className="flex items-center gap-2">
            <span
              className="h-[8px] w-[8px] rounded-[2px]"
              style={{ background: "var(--clay)", transform: "rotate(45deg)" }}
            />
            <span className="text-[11.5px] font-semibold uppercase tracking-[0.1em] text-ink-2">
              Not booking today? You still live here.
            </span>
          </div>
          <h3 className="mt-3 font-display text-[21px] font-medium leading-[1.2] text-ink">
            Join the Corner.
          </h3>
          <p className="mt-2 text-[14px] leading-[1.6] text-ink-2">
            A short letter from Tony most weeks — one real money conversation
            at a time, in plain English. Plus first pick when new coaches and
            new session times open up. No spam, leave any time.
          </p>
          {waitlistJoined ? (
            <div className="mt-4 rounded-[10px] bg-accent-tint px-4 py-3 text-[14px] font-medium text-ink">
              You&rsquo;re in. Welcome to the corner — look out for
              Tony&rsquo;s next letter.
            </div>
          ) : (
            <button
              onClick={async () => {
                await fetch("/api/blueprint", {
                  method: "POST",
                  headers: { "content-type": "application/json" },
                  body: JSON.stringify({
                    email,
                    archetype: archetype.id,
                    stage: "waitlist",
                  }),
                }).catch(() => {});
                setWaitlistJoined(true);
              }}
              className="mt-4 w-full rounded-[10px] border border-ink/15 bg-white px-6 py-[12px] text-[14.5px] font-semibold text-ink transition-colors hover:border-ink/40"
            >
              Count me in
            </button>
          )}
        </div>

        {/* Your style's toolkit — real, free, already built. Belonging you
            can click: every archetype gets the two tools that fit it. */}
        <div
          className="mt-4 rounded-[18px] border border-line bg-surface p-[24px] transition-all duration-700"
          style={{
            transitionDelay: "800ms",
            opacity: mounted ? 1 : 0,
          }}
        >
          <div className="flex items-center gap-2">
            <span
              className="h-[8px] w-[8px] rounded-[2px]"
              style={{ background: archetype.accent, transform: "rotate(45deg)" }}
            />
            <span className="text-[11.5px] font-semibold uppercase tracking-[0.1em] text-ink-2">
              Free tools for {archetype.name.replace("The ", "the ")}
            </span>
          </div>
          <div className="mt-4 grid grid-cols-1 gap-[10px] sm:grid-cols-2">
            {TOOLKIT[archetype.id].map((t) => (
              <a
                key={t.href}
                href={t.href}
                className="rounded-[13px] border border-line bg-white px-[16px] py-[14px] transition-all hover:-translate-y-[1px] hover:border-ink/30"
              >
                <span className="block text-[14.5px] font-semibold text-ink">
                  {t.title}
                </span>
                <span className="mt-[3px] block text-[12.5px] leading-[1.45] text-muted">
                  {t.why}
                </span>
              </a>
            ))}
          </div>
        </div>

        {/* Share */}
        <ShareCard archetype={archetype} mounted={mounted} />

        <p className="mt-10 text-center text-[11.5px] text-muted">
          Your money style shows what&rsquo;s leading your choices right now.
          It shifts as your life does. Retake the quiz any time.
        </p>
      </div>
    </div>
  );
}

function Section({
  label,
  children,
  accent,
  delay,
  mounted,
  muted = false,
}: {
  label: string;
  children: React.ReactNode;
  accent: string;
  delay: number;
  mounted: boolean;
  muted?: boolean;
}) {
  return (
    <div
      className="mt-6 rounded-[16px] border border-line bg-surface p-[22px] transition-all duration-700"
      style={{
        transitionDelay: `${delay}ms`,
        opacity: mounted ? 1 : 0,
        transform: mounted ? "translateY(0)" : "translateY(8px)",
      }}
    >
      <div className="flex items-center gap-2">
        <span
          className="h-[8px] w-[8px] rounded-[2px]"
          style={{
            background: muted ? "rgba(0,0,0,0.35)" : accent,
            transform: "rotate(45deg)",
          }}
        />
        <span className="text-[11.5px] font-semibold uppercase tracking-[0.1em] text-ink-2">
          {label}
        </span>
      </div>
      <p
        className={`mt-3 text-[15px] leading-[1.6] ${
          muted ? "text-ink-2" : "text-ink"
        }`}
      >
        {children}
      </p>
    </div>
  );
}

function ShareCard({
  archetype,
  mounted,
}: {
  archetype: Archetype;
  mounted: boolean;
}) {
  const [copied, setCopied] = useState(false);

  async function share() {
    const shareText = `Right now, I'm leading with ${archetype.name}: ${archetype.shareLine} — @12thandgood`;
    const shareUrl =
      typeof window !== "undefined"
        ? `${window.location.origin}/blueprint`
        : "https://12thandgood.com/blueprint";
    if (typeof navigator !== "undefined" && "share" in navigator) {
      try {
        await (navigator as Navigator).share({
          title: `I'm ${archetype.name}`,
          text: shareText,
          url: shareUrl,
        });
        return;
      } catch {
        // fall through to copy
      }
    }
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      await navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2400);
    }
  }

  return (
    <div
      className="mt-8 rounded-[16px] border border-line bg-surface p-[22px] transition-all duration-700"
      style={{
        transitionDelay: "800ms",
        opacity: mounted ? 1 : 0,
      }}
    >
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="font-display text-[18px] font-medium leading-[1.2] text-ink">
            Share your money style
          </p>
          <p className="mt-[2px] text-[13.5px] leading-[1.5] text-ink-2">
            Pass this to someone who&rsquo;d want to see themselves in it.
          </p>
        </div>
        <button
          onClick={share}
          className="w-full rounded-[10px] border border-ink/15 bg-white px-4 py-[10px] text-[13.5px] font-semibold text-ink transition-colors hover:border-ink/40 sm:w-auto"
        >
          {copied ? "Link copied" : "Share"}
        </button>
      </div>
    </div>
  );
}
