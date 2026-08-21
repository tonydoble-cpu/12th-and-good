import { notFound } from "next/navigation";
import Image from "next/image";

// Availability must be live — a static snapshot of the calendar means new
// slots never appear and booked ones look open. Render on every request.
export const dynamic = "force-dynamic";

// Without this export the page inherits the homepage's employer-pitch
// metadata — so a Google search for "Tony Doble" showed a B2B tagline
// instead of the person. This page is a primary landing surface for
// name searches; keep title/description person-first.
export const metadata = {
  title: "Tony Doble — Financial Coach & Author | 12th & Good Street",
  description:
    "Tony Doble is a financial coach and the author of four books on money and purpose, including Zella's Money Choices and Charlie's Money Choices. Two decades of money conversations with schools, teams, and families — now coaching through 12th & Good Street.",
};
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Container from "@/components/Container";
import BookingCard from "@/components/BookingCard";
import { getCoachBySlug, getOpenAvailability, getSessionTypes } from "@/lib/coach-data";
import { isStripeConfigured } from "@/lib/stripe";

const WALK_AWAY = [
  {
    title: "A written plan",
    body: "In plain language, yours to keep and share with whoever you trust.",
  },
  {
    title: "Clear next steps",
    body: "Small, concrete actions you can start on the same week.",
  },
  {
    title: "Honest answers",
    body: "There's no product behind the advice, so the answer is just the answer.",
  },
  {
    title: "Someone who listens",
    body: "A coach who's paid by you and works only for you.",
  },
];

export default async function CoachProfilePage() {
  const coach = await getCoachBySlug("tony");
  if (!coach) notFound();

  const [sessionTypes, availability] = await Promise.all([
    getSessionTypes(coach.id),
    getOpenAvailability(coach.id),
  ]);

  const approachParagraphs = coach.bio.split("\n\n");

  return (
    <div className="flex min-h-full flex-col">
      <Header cta={null} />

      <Container width="wide" className="pt-[26px] pb-[88px]">
        {/* breadcrumb */}
        <div className="mb-[26px] text-[13px] text-muted">
          <a href="/employers" className="text-muted no-underline">
            Browse coaches
          </a>
          &nbsp;/&nbsp;
          <span className="text-ink-2">{coach.full_name}</span>
        </div>

        {/* header */}
        <div className="max-w-[640px]">
          <div className="mb-[14px] flex flex-wrap items-center gap-[10px]">
            {coach.founding && (
              <span className="inline-flex items-center gap-2 rounded-full border border-ink bg-ink px-[14px] py-[7px] text-[12.5px] font-medium text-white">
                <span className="dot" style={{ background: "#fff" }} />
                Founding coach
              </span>
            )}
            <span className="inline-flex items-center gap-[6px] text-[13px] font-medium text-ink-2">
              <span className="text-accent">&#10003;</span> Fee-only &mdash;
              nothing to sell you
            </span>
          </div>
          <h1 className="font-display text-[36px] md:text-[46px] font-normal leading-[1.05] tracking-[-0.02em] text-ink">
            {coach.full_name}
          </h1>
          <p className="mt-[14px] max-w-[560px] text-[16px] md:text-[17px] leading-[1.65] text-ink-2">
            {coach.headline}
          </p>
          <div className="mt-5 flex flex-wrap gap-[22px] text-sm text-ink-2">
            <span>
              &#9733; <b className="text-ink">New</b> &middot; be among the
              first to review
            </span>
            <span>&#8226;&nbsp; Online, video sessions</span>
            <span>&#8226;&nbsp; English</span>
            <span>
              &#8226;&nbsp;{" "}
              <a
                href="https://www.linkedin.com/in/tonydoble"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-accent hover:text-accent-hover"
              >
                LinkedIn &#8599;
              </a>
            </span>
          </div>
        </div>

        {/* media */}
        <div className="mt-[34px]">
          <div className="relative h-[320px] md:h-[440px] overflow-hidden rounded-2xl">
            <Image
              src={coach.photo_url ?? "/tony-doble.png"}
              alt={coach.full_name}
              fill
              sizes="100vw"
              style={{ objectPosition: "50% 16%" }}
              className="object-cover"
              priority
            />
          </div>
        </div>

        {/* two column body */}
        <div className="mt-14 grid grid-cols-1 lg:grid-cols-[1fr_372px] gap-14 items-start">
          {/* left */}
          <div>
            <div className="flex flex-wrap gap-[9px]">
              {coach.specialties.map((s) => (
                <span
                  key={s}
                  className="inline-flex items-center gap-2 rounded-full border border-[#dde5ec] bg-accent-tint px-[14px] py-[7px] text-[12.5px] font-medium text-ink-2"
                >
                  {s}
                </span>
              ))}
            </div>

            <hr className="my-9 border-line" />

            <section>
              <h2 className="font-display text-[24px] md:text-[27px] font-medium leading-[1.15] tracking-[-0.014em] text-ink">
                My approach
              </h2>
              {approachParagraphs.map((p, i) => (
                <p
                  key={i}
                  className="mt-4 text-[16px] md:text-[16.5px] leading-[1.7] text-ink-2"
                >
                  {p}
                </p>
              ))}
            </section>

            <hr className="my-9 border-line" />

            <section>
              <h2 className="font-display text-[24px] md:text-[27px] font-medium leading-[1.15] tracking-[-0.014em] text-ink">
                Background &amp; how I get paid
              </h2>
              {coach.credentials.length > 0 && (
                <ul className="mt-5 flex flex-col gap-[10px]">
                  {coach.credentials.map((c) => (
                    <li key={c} className="flex items-start gap-[13px]">
                      <span className="dot mt-[9px]" />
                      <span className="text-[15.5px] leading-[1.6] text-ink-2">{c}</span>
                    </li>
                  ))}
                </ul>
              )}
              <div className="mt-6 rounded-[14px] border border-line bg-accent-tint/60 p-[20px]">
                <p className="text-[15px] leading-[1.65] text-ink">
                  <b>The whole fee model, in one sentence:</b> you pay for the
                  session, and that is 100% of how I&rsquo;m paid — no
                  commissions, no product fees, no referral kickbacks, not from
                  anyone, ever. If I ever recommend something, it&rsquo;s
                  because I think it helps you, and I don&rsquo;t make a dime
                  either way.
                </p>
              </div>
            </section>

            <hr className="my-9 border-line" />

            <section>
              <h2 className="font-display text-[24px] md:text-[27px] font-medium leading-[1.15] tracking-[-0.014em] text-ink">
                Sessions I offer
              </h2>
              <div className="mt-5 flex flex-col gap-[14px]">
                {sessionTypes.map((s) => (
                  <div key={s.id} className="flex items-start gap-4">
                    <span className="dot mt-[9px]" />
                    <div>
                      <h3 className="font-display text-[18px] font-medium text-ink">
                        {s.name} &middot; {s.duration_minutes} min
                      </h3>
                      <p className="mt-[5px] text-[14.5px] text-muted">
                        {s.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <hr className="my-9 border-line" />

            <section>
              <h2 className="font-display text-[24px] md:text-[27px] font-medium leading-[1.15] tracking-[-0.014em] text-ink">
                What you&rsquo;ll walk away with
              </h2>
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-x-10">
                {WALK_AWAY.map((f) => (
                  <div key={f.title} className="flex gap-[13px] border-t border-line py-4">
                    <span className="flex h-[30px] w-[30px] flex-none items-center justify-center rounded-lg border border-[#dde5ec] bg-accent-tint mt-px">
                      <span className="dot" />
                    </span>
                    <div>
                      <b className="text-[15px] text-ink">{f.title}</b>
                      <p className="mt-[3px] text-[13.5px] text-muted">{f.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <hr className="my-9 border-line" />

            <section>
              <div className="flex items-baseline justify-between gap-4">
                <h2 className="font-display text-[24px] md:text-[27px] font-medium leading-[1.15] tracking-[-0.014em] text-ink">
                  Reviews
                </h2>
                <span className="text-sm text-muted">&#9733; New coach</span>
              </div>
              <div className="mt-[18px] rounded-[14px] border border-dashed border-[#ddd7cb] p-7 text-center">
                <p className="mx-auto max-w-[420px] text-[15.5px] text-ink-2">
                  Tony is our founding coach — no reviews yet. <b>If you work
                  with him, your honest feedback helps other people decide.</b>
                </p>
              </div>
            </section>
          </div>

          {/* right: booking */}
          <BookingCard
            sessionTypes={sessionTypes}
            availability={availability}
            reserveMode={!isStripeConfigured}
          />
        </div>
      </Container>

      {/* trust band */}
      <section className="bg-ink py-[72px] text-center text-white">
        <Container width="wide" className="max-w-[720px]">
          <h2 className="font-display text-[26px] md:text-[30px] font-medium text-white">
            Fee-only coaching, the way it should work.
          </h2>
          <p className="mx-auto mt-[14px] max-w-[520px] text-base text-white/76">
            Every coach on 12th & Good Street is paid by you — not by commission,
            not by a product company. That changes the conversation.
          </p>
          <a
            href="/employers"
            className="mt-5 inline-flex items-center gap-[6px] text-[15px] font-semibold text-white"
          >
            Browse all coaches <span aria-hidden>&rarr;</span>
          </a>
        </Container>
      </section>

      <Footer variant="simple" />
    </div>
  );
}
