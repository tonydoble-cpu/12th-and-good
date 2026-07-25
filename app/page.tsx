import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Container from "@/components/Container";
import StickyBookBar from "@/components/homeb/StickyBookBar";
import HomeFaq from "@/components/homeb/HomeFaq";
import { NextTimePills } from "@/components/homeb/NextTimes";
import { getCoachBySlug, getOpenAvailability, getSessionTypes } from "@/lib/coach-data";
import { cheapestPaidPrice } from "@/lib/pricing";
import { formatPrice } from "@/lib/types";
import { ARCHETYPES } from "@/lib/archetypes";

// THE HOMEPAGE — book-first ("B carries more weight" — Tony, July 26, 2026).
// Grow Therapy's conversion physics in our brand: the one action never
// leaves the screen, a real person with real near-term times above the
// fold, concrete numbers everywhere. The quiz-first variant lives on at
// /home-a. Availability renders live — hence force-dynamic.

export const dynamic = "force-dynamic";

const HOW = [
  {
    n: "01",
    title: "Book & tell us what's on your mind",
    body: "Pick a time and write a few sentences about what you're working on. Tony reads it before you meet.",
  },
  {
    n: "02",
    title: "Talk it through — 60 minutes",
    body: "Video call, your real numbers, your real questions. He shows up already prepared for exactly your situation.",
  },
  {
    n: "03",
    title: "Leave with a written plan",
    body: "Plain language, steps you can start the same week. Worth every dollar — or you don't pay for it.",
  },
];

export default async function Home() {
  const coach = await getCoachBySlug("tony");
  const sessionTypes = coach ? await getSessionTypes(coach.id) : [];
  const availability = coach ? await getOpenAvailability(coach.id) : [];
  const fromPrice = cheapestPaidPrice(sessionTypes);
  const nextSlots = availability.slice(0, 3).map((s) => s.starts_at);
  const nextIso = nextSlots[0] ?? null;

  return (
    <div className="flex min-h-full flex-col">
      <Header cta={{ label: "Book a session", href: "/tony#book" }} />
      <StickyBookBar nextIso={nextIso} />

      {/* HERO — headline + concrete numbers, real person on the right */}
      <header className="border-b border-line bg-surface">
        <Container width="wide" className="grid grid-cols-1 items-center gap-12 py-16 md:py-20 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <div className="chip inline-flex items-center gap-2 rounded-full border border-[#dde5ec] bg-accent-tint px-[14px] py-[7px] text-[12.5px] font-medium text-ink-2">
              <span className="dot" />
              Fee-only financial coaching
            </div>
            <h1 className="mt-6 max-w-[620px] font-display text-[40px] font-normal leading-[1.05] tracking-[-0.021em] text-ink md:text-[56px]">
              Talk to someone who has{" "}
              <span className="text-accent">nothing to sell you.</span>
            </h1>
            <p className="mt-6 max-w-[520px] text-[17px] leading-[1.6] text-ink-2 md:text-[19px]">
              A real conversation about your money with a coach who&rsquo;s
              paid by you and no one else. {fromPrice > 0 && (
                <>Sessions are {formatPrice(fromPrice)} flat, 60 minutes, with
                a written plan you keep.</>
              )}{" "}
              And if your first session isn&rsquo;t worth every dollar —
              you don&rsquo;t pay.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-[14px]">
              <a
                href="/tony#book"
                className="inline-flex items-center gap-[10px] rounded-[11px] bg-accent px-[28px] py-[15px] text-[16px] font-semibold text-white shadow-[0_14px_34px_-14px_rgba(58,90,125,0.85)] transition-all hover:-translate-y-px hover:bg-accent-hover"
              >
                Book a session <span aria-hidden>&rarr;</span>
              </a>
              <a
                href="/blueprint"
                className="text-[15px] font-semibold text-accent hover:text-accent-hover"
              >
                or get your free Money Blueprint <span aria-hidden>&rarr;</span>
              </a>
            </div>
          </div>

          {/* The provider card — a real face with real near-term times,
              above the fold. */}
          <div className="rounded-[20px] border border-line bg-white p-[22px] shadow-[0_28px_60px_-38px_rgba(20,30,45,0.45)]">
            <div className="flex items-center gap-4">
              <div className="relative h-[76px] w-[76px] flex-none overflow-hidden rounded-2xl">
                <Image
                  src={coach?.photo_url ?? "/tony-doble.png"}
                  alt={coach?.full_name ?? "Tony Doble"}
                  fill
                  sizes="76px"
                  style={{ objectPosition: "50% 16%" }}
                  className="object-cover"
                  priority
                />
              </div>
              <div>
                <p className="font-display text-[21px] font-medium leading-[1.1] text-ink">
                  {coach?.full_name ?? "Tony Doble"}
                </p>
                <p className="mt-[3px] text-[13px] font-medium text-ink-2">
                  Founding coach · Fee-only — nothing to sell you
                </p>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-[7px]">
              {(coach?.specialties ?? []).slice(0, 4).map((s) => (
                <span
                  key={s}
                  className="rounded-full border border-[#dde5ec] bg-accent-tint px-[12px] py-[5px] text-[12px] font-medium text-ink-2"
                >
                  {s}
                </span>
              ))}
            </div>
            <div className="mt-5 border-t border-line pt-4">
              <p className="text-[11.5px] font-semibold uppercase tracking-[0.1em] text-ink-2">
                Next available
              </p>
              <div className="mt-[10px]">
                {nextSlots.length > 0 ? (
                  <NextTimePills slots={nextSlots} />
                ) : (
                  <p className="text-[13.5px] text-ink-2">
                    New times open soon —{" "}
                    <a href="/blueprint" className="font-semibold text-accent">
                      join the Corner
                    </a>{" "}
                    for first pick.
                  </p>
                )}
              </div>
            </div>
          </div>
        </Container>
      </header>

      {/* HONEST NUMBERS BAND — the numbers we can stand behind forever */}
      <section className="border-b border-line py-12">
        <Container width="wide">
          <div className="grid grid-cols-1 gap-8 text-center sm:grid-cols-3">
            <div>
              <p className="font-display text-[38px] leading-none text-accent md:text-[44px]">$0</p>
              <p className="mt-2 text-[14.5px] text-ink-2">
                commissions, product fees, or kickbacks — ever
              </p>
            </div>
            <div>
              <p className="font-display text-[38px] leading-none text-accent md:text-[44px]">100%</p>
              <p className="mt-2 text-[14.5px] text-ink-2">
                of your coach&rsquo;s pay comes from clients like you — never
                from commissions or products
              </p>
            </div>
            <div>
              <p className="font-display text-[38px] leading-none text-accent md:text-[44px]">1</p>
              <p className="mt-2 text-[14.5px] text-ink-2">
                promise, in writing: not worth it? You don&rsquo;t pay
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* HOW IT WORKS — three steps, anchor target for the nav */}
      <section className="border-b border-line py-20" id="how">
        <Container width="wide">
          <p className="text-center text-[11.5px] font-semibold uppercase tracking-[0.17em] text-accent">
            How it works
          </p>
          <h2 className="mt-4 text-center font-display text-[28px] font-normal leading-[1.1] tracking-[-0.019em] text-ink md:text-[36px]">
            One question in, one plan out.
          </h2>
          <div className="mt-12 grid grid-cols-1 gap-10 md:grid-cols-3">
            {HOW.map((s) => (
              <div key={s.n}>
                <p className="font-display text-[28px] text-accent">{s.n}</p>
                <h3 className="mt-3 text-[16.5px] font-semibold text-ink">{s.title}</h3>
                <p className="mt-2 text-[14.5px] leading-[1.65] text-ink-2">{s.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* LANE 2 — the Blueprint for people not ready to book */}
      <section className="reveal border-b border-line bg-surface py-20" id="blueprint">
        <Container width="wide">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <div>
              <p className="text-[11.5px] font-semibold uppercase tracking-[0.17em] text-accent">
                Not sure yet? Start free
              </p>
              <h2 className="mt-4 font-display text-[30px] font-normal leading-[1.08] tracking-[-0.019em] text-ink md:text-[38px]">
                Walk to the corner first.
              </h2>
              <p className="mt-5 max-w-[460px] text-[16.5px] leading-[1.65] text-ink-2">
                Eight questions, about two minutes — a walk from 4th &amp;
                Good to 12th &amp; Good that shows you your money style, the
                strength you already have, and three moves for your next 90
                days. No email needed to see your style.
              </p>
              <a
                href="/blueprint"
                className="mt-7 inline-flex items-center gap-[9px] rounded-[9px] border border-accent px-[24px] py-[13px] text-[15px] font-semibold text-accent transition-all hover:-translate-y-px hover:bg-accent hover:text-white"
              >
                Take the walk <span aria-hidden>&rarr;</span>
              </a>
            </div>
            <div className="grid grid-cols-2 gap-[12px] sm:grid-cols-3">
              {Object.values(ARCHETYPES).map((a) => (
                <div key={a.id} className="rounded-xl border border-line bg-white p-4">
                  <span
                    className="block h-[8px] w-[8px] rounded-[2px]"
                    style={{ background: a.accent, transform: "rotate(45deg)" }}
                  />
                  <p className="mt-3 font-display text-[16px] font-medium leading-[1.15] text-ink">
                    {a.name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* FOUNDER — compressed; the full story lives at /about */}
      <section className="border-b border-line bg-[#15171b] py-16 text-white">
        <Container width="narrow">
          <p className="text-[11.5px] font-semibold uppercase tracking-[0.17em] text-[var(--clay-soft)]">
            Why this corner exists
          </p>
          <p className="mt-5 font-display text-[22px] font-normal leading-[1.4] tracking-[-0.01em] md:text-[26px]">
            &ldquo;When I was 12, the power company shut our lights off while
            my mom was at work. We weren&rsquo;t careless with money — we just
            had no one to talk to about it. This is the corner I wish had
            existed.&rdquo;
          </p>
          <div className="mt-5 flex items-center justify-between">
            <p className="text-[14px] text-white/70">— Tony, founder</p>
            <a href="/about" className="text-[14px] font-semibold text-white/90 hover:text-white">
              The whole story &rarr;
            </a>
          </div>
        </Container>
      </section>

      {/* FAQ — the skeptic's four questions, answered plainly */}
      <section className="py-20" id="resources">
        <Container width="wide">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[0.8fr_1.2fr]">
            <h2 className="font-display text-[30px] font-normal leading-[1.1] tracking-[-0.019em] text-ink md:text-[36px]">
              The questions worth asking any financial company.
            </h2>
            <HomeFaq />
          </div>
        </Container>
      </section>

      {/* CLOSE */}
      <section className="border-t border-line bg-surface py-16 text-center">
        <Container width="narrow">
          <h2 className="font-display text-[28px] font-normal leading-[1.1] tracking-[-0.019em] text-ink md:text-[34px]">
            Bring one money question.
          </h2>
          <p className="mx-auto mt-4 max-w-[440px] text-[16px] leading-[1.6] text-ink-2">
            That&rsquo;s the whole ask. Sixty minutes later you&rsquo;ll have
            a written plan — or you won&rsquo;t pay for it.
          </p>
          <a
            href="/tony#book"
            className="mt-7 inline-flex items-center gap-[10px] rounded-[11px] bg-accent px-[30px] py-[15px] text-[16px] font-semibold text-white shadow-[0_14px_34px_-14px_rgba(58,90,125,0.85)] transition-all hover:-translate-y-px hover:bg-accent-hover"
          >
            Book your session <span aria-hidden>&rarr;</span>
          </a>
        </Container>
      </section>

      <Footer />
    </div>
  );
}
