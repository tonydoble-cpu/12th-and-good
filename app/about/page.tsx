import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Container from "@/components/Container";

export const metadata = {
  title: "About | 12th & Good Street",
  description:
    "Why 12th & Good Street exists: the corner where the street you're from meets the guidance you deserve.",
};

// Rewritten Aug 2026 to match the employer-program pivot. The previous
// version still described the consumer marketplace ("coaches paid by you,
// more coaches joining") — directly contradicting the homepage's flat
// annual employer fee. It also had no photo, no books, no bio: the founder
// was invisible on a founder-led product. Both fixed here. Facts in the
// Meet Tony section came from Tony directly — don't extend them without
// asking him.

const BOOKS = [
  {
    title: "Zella's Money Choices",
    note: "A children's story about money, five years in the making.",
  },
  {
    title: "Charlie's Money Choices",
    note: "Updated edition, with a companion workbook for teachers.",
  },
  {
    title: "The 2-Hour 401(k) Maximizer",
    note: "Two years of 401(k) conversations, distilled.",
  },
  {
    title: "The 31-Day Purpose Journal",
    note: "Because money decisions start somewhere deeper than math.",
  },
];

export default function AboutPage() {
  return (
    <div className="flex min-h-full flex-col">
      <Header />
      <Container width="narrow" className="flex-1 pt-16 pb-24">
        <p className="text-[11.5px] font-semibold uppercase tracking-[0.17em] text-accent">
          About
        </p>
        <h1 className="mt-4 font-display text-[34px] md:text-[44px] font-normal leading-[1.08] tracking-[-0.02em] text-ink">
          Why this corner exists.
        </h1>

        <div className="mt-9 flex flex-col gap-5 text-[16.5px] leading-[1.75] text-ink-2">
          <p>
            When Tony was 12, the man from the power company knocked on the
            door on 12th Street. His mom was at work. The man was kind about
            it &mdash; but a kid can&rsquo;t write a check, and the bill was
            due. The lights went off, and he sat in the dark waiting for her
            to come home.
          </p>
          <p>
            The family wasn&rsquo;t careless with money. They just had no one
            to talk to about it &mdash; no advisor, no playbook, no one a
            step ahead of them. That&rsquo;s the gap this company exists to
            close.
          </p>
          <p>
            <b className="text-ink">
              12th &amp; Good Street is the corner we wish had existed:
            </b>{" "}
            where the street you&rsquo;re from meets the guidance you
            deserve. Today it takes the shape of an employer program &mdash;
            a company pays one flat annual fee, and everyone on the payroll
            gets a financial coach they can actually call. The coach has
            nothing to sell: no products, no commissions, no fine-print
            agenda. Your employer covers the seat. The conversations belong
            to you, and nothing said in one ever leaves it.
          </p>
          <p>
            It&rsquo;s founder-led on purpose. Tony takes the calls himself
            &mdash; every workshop, every session, every &ldquo;is this a
            dumb question?&rdquo; that isn&rsquo;t. That&rsquo;s not a
            limitation we&rsquo;re apologizing for; it&rsquo;s the standard
            everything else will be measured against as this grows.
          </p>
          <p>
            If you&rsquo;ve ever been the first in your family to earn real
            money, the one everyone leans on, the one rebuilding after a hard
            chapter, or the one figuring it out from scratch &mdash; this
            corner was built for you.
          </p>
        </div>

        {/* MEET TONY */}
        <div className="mt-16 border-t border-line pt-12">
          <p className="text-[11.5px] font-semibold uppercase tracking-[0.17em] text-accent">
            The person behind it
          </p>
          <div className="mt-7 flex flex-col gap-8 sm:flex-row sm:items-start">
            <Image
              src="/tony-doble.png"
              alt="Tony Doble, founder of 12th & Good Street"
              width={168}
              height={168}
              className="h-[168px] w-[168px] flex-none rounded-2xl border border-line object-cover"
            />
            <div>
              <h2 className="font-display text-[26px] font-medium leading-[1.15] text-ink">
                Tony Doble
              </h2>
              <p className="mt-1 text-[14px] font-medium text-muted">
                Founder &amp; coach
              </p>
              <div className="mt-4 flex flex-col gap-4 text-[15.5px] leading-[1.7] text-ink-2">
                <p>
                  Tony has spent two decades having money conversations
                  &mdash; in classrooms, break rooms, workshops, and living
                  rooms &mdash; with schools, teams, and community
                  organizations across Washington, including years of
                  financial-wellness work with Tacoma Public Schools staff
                  and students.
                </p>
                <p>
                  He writes about money the way he coaches: plainly, and
                  without a product behind the advice. His weekly notes go
                  out as{" "}
                  <a
                    href="https://www.linkedin.com/in/tonydoble"
                    className="font-semibold text-accent hover:text-accent-hover"
                  >
                    The Corner Table on LinkedIn
                  </a>
                  .
                </p>
              </div>
            </div>
          </div>

          {/* BOOKS */}
          <div className="mt-10">
            <p className="text-[13px] font-semibold text-ink">
              Four books, all available on Amazon:
            </p>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {BOOKS.map((b) => (
                <div
                  key={b.title}
                  className="rounded-xl border border-line bg-surface p-5"
                >
                  <p className="font-display text-[17px] font-medium text-ink">
                    {b.title}
                  </p>
                  <p className="mt-1.5 text-[13.5px] leading-[1.55] text-muted">
                    {b.note}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-wrap gap-4">
          <a
            href="/employers#contact"
            className="inline-flex items-center gap-[9px] rounded-[9px] bg-accent px-[22px] py-[13px] text-[15px] font-semibold text-white shadow-[0_8px_22px_-12px_rgba(58,90,125,0.75)] transition-all hover:-translate-y-px hover:bg-accent-hover"
          >
            Talk to us about your team
          </a>
          <a
            href="/resources"
            className="inline-flex items-center gap-[6px] px-2 py-[13px] text-[15px] font-semibold text-accent"
          >
            Try the free tools &rarr;
          </a>
        </div>
      </Container>
      <Footer variant="simple" />
    </div>
  );
}
