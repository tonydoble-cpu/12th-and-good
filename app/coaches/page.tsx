import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Container from "@/components/Container";
import SearchBar from "@/components/SearchBar";
import CoachFilters from "@/components/CoachFilters";
import CoachCard from "@/components/CoachCard";
import { JoiningSoonCard, BecomeCoachCard } from "@/components/JoiningSoonCard";
import { getCoachBySlug, getSessionTypes } from "@/lib/coach-data";
import { cheapestPaidPrice } from "@/lib/pricing";

export default async function BrowseCoachesPage() {
  const coach = await getCoachBySlug("tony");
  const sessionTypes = coach ? await getSessionTypes(coach.id) : [];
  const fromPrice = cheapestPaidPrice(sessionTypes);

  return (
    <div className="flex min-h-full flex-col">
      <Header />

      {/* search header */}
      <header className="border-b border-line bg-surface">
        <Container width="directory" className="pt-12 pb-10">
          <div className="mb-4 text-[13px] text-muted">
            <Link href="/" className="text-muted no-underline">
              Home
            </Link>
            &nbsp;/&nbsp;
            <span className="text-ink-2">Browse coaches</span>
          </div>
          <h1 className="font-display text-[32px] md:text-[44px] font-normal leading-[1.04] tracking-[-0.02em] text-ink">
            Find your coach.
          </h1>
          <p className="mt-3 max-w-[560px] text-base text-muted">
            Every coach here is fee-only and screened before they join.
            Filter by what you want to work on, and see who feels like the
            right fit.
          </p>
          <SearchBar size="sm" className="mt-[26px] max-w-[640px]" />
        </Container>
      </header>

      {/* body: filters + results */}
      <Container width="directory" className="py-9 md:py-[80px]">
        <div className="grid grid-cols-1 md:grid-cols-[248px_1fr] gap-11 items-start">
          <CoachFilters />

          <div>
            <div className="mb-[22px] flex flex-wrap items-center justify-between gap-4">
              <div className="text-[14.5px] text-ink-2">
                <b className="text-ink">1 coach</b> available{" "}
                <span className="text-muted">&middot; more joining soon</span>
              </div>
              <div className="flex items-center gap-[10px] text-[13.5px] text-muted">
                Sort by
                <span className="inline-flex items-center gap-2 rounded-lg border border-line bg-white px-[13px] py-2 font-medium text-ink-2">
                  Best match <span className="text-[10px]">&#9662;</span>
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {coach && (
                <CoachCard
                  coach={coach}
                  fromPriceCents={fromPrice}
                  blurb="Budgeting, debt paydown, first-time home buying, investing basics, and making sense of your 401(k)."
                  imageHeight={190}
                />
              )}
              <JoiningSoonCard
                body="We're carefully vetting the next cohort of conflict-free coaches."
                minHeight={344}
              />
              <JoiningSoonCard
                body="Specialists in retirement, small business, and life transitions."
                minHeight={344}
              />
              <BecomeCoachCard minHeight={344} />
            </div>

            <div className="mt-10 rounded-2xl border border-line bg-surface p-9 text-center">
              <p className="mx-auto max-w-[460px] text-base text-ink-2">
                More coaches are joining every month.{" "}
                <b>
                  Want to know when someone in your focus area is available?
                </b>
              </p>
              <a
                href="#"
                className="mt-5 inline-flex items-center gap-[9px] rounded-[9px] bg-accent px-[25px] py-[14px] text-[15px] font-semibold text-white shadow-[0_8px_22px_-12px_rgba(58,90,125,0.75)] transition-all hover:-translate-y-px hover:bg-accent-hover"
              >
                Get notified <span aria-hidden>&rarr;</span>
              </a>
            </div>
          </div>
        </div>
      </Container>

      <Footer variant="simple" />
    </div>
  );
}
