import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Container from "@/components/Container";

export const metadata = {
  title: "About | 12th & Good Street",
  description:
    "Why 12th & Good Street exists: the corner where the street you're from meets the guidance you deserve.",
};

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
            it — but a kid can&rsquo;t write a check, and the bill was due.
            The lights went off, and he sat in the dark waiting for her to
            come home.
          </p>
          <p>
            The family wasn&rsquo;t careless with money. They just had no one
            to talk to about it — no advisor, no playbook, no one a step
            ahead of them. That&rsquo;s the gap this company exists to close.
          </p>
          <p>
            <b className="text-ink">12th &amp; Good Street is the corner we
            wish had existed:</b> where the street you&rsquo;re from meets the
            guidance you deserve. A place to talk to someone about money who
            has nothing to sell you — no products, no commissions, no
            fine-print agenda. Coaches who are paid by you, work only for
            you, and often come from streets like yours.
          </p>
          <p>
            We&rsquo;re starting small on purpose: one founding coach (Tony
            himself — he takes the early calls personally), a free Money
            Blueprint that helps you see your own patterns, and a vetting
            standard we won&rsquo;t bend as we grow. More coaches are joining
            deliberately, not quickly.
          </p>
          <p>
            If you&rsquo;ve ever been the first in your family to earn real
            money, the one everyone leans on, the one rebuilding after a hard
            chapter, or the one figuring it out from scratch — this corner
            was built for you.
          </p>
        </div>

        <div className="mt-12 flex flex-wrap gap-4">
          <a
            href="/blueprint"
            className="inline-flex items-center gap-[9px] rounded-[9px] bg-accent px-[22px] py-[13px] text-[15px] font-semibold text-white shadow-[0_8px_22px_-12px_rgba(58,90,125,0.75)] transition-all hover:-translate-y-px hover:bg-accent-hover"
          >
            Get your free Money Blueprint
          </a>
          <a
            href="/how-we-make-money"
            className="inline-flex items-center gap-[6px] px-2 py-[13px] text-[15px] font-semibold text-accent"
          >
            How we make money &rarr;
          </a>
        </div>
      </Container>
      <Footer variant="simple" />
    </div>
  );
}
