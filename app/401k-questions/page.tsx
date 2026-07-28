import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import "@fontsource/instrument-sans/700.css";
import "@fontsource/ibm-plex-mono/600.css";
import "@fontsource/newsreader/400-italic.css";
import "./qtool.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Container from "@/components/Container";
import QuestionBrowser from "@/components/QuestionBrowser";
import { getAllQuestions, CATEGORIES } from "@/lib/questions";
import { TENANT } from "@/lib/tenant-config";

// Top-of-funnel landing (funnel build brief §2), skinned per the Brand
// Handoff (28 Jul 2026): deep green page, cream type, terracotta accent,
// Instrument Sans 700 display, questions in Newsreader italic quotes.

export const metadata: Metadata = {
  title: "401(k) Questions, Answered in Plain English — 12th & Good Street",
  description:
    "Free, searchable answers to the 401(k) questions people actually have — employer match, vesting, rollovers, fees, leaving a job. No jargon, no sales pitch, no signup.",
};

/** Normalize for ?q= matching: lowercase, strip punctuation/quotes. */
function norm(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9\s]/g, "").replace(/\s+/g, " ").trim();
}

export default async function QuestionsLandingPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const questions = getAllQuestions();

  // Deep-link format shipping from the homepage: /401k-questions?q=<question text>.
  // Exact (normalized) match opens the answer directly; otherwise fall back
  // to the landing view with the search prefilled (per the handoff).
  if (q) {
    const hit = questions.find((item) => norm(item.question) === norm(q));
    if (hit) redirect(`/401k-questions/${hit.slug}`);
  }

  return (
    <div className="qtool qt-dark flex min-h-full flex-col">
      <Header cta={{ label: "Talk to us", href: `${TENANT.contactCtaUrl}#contact` }} />

      <header className="pt-16 pb-10 md:pt-24">
        <Container width="wide">
          <div className="mx-auto max-w-[760px] text-center">
            <p className="qt-eyebrow" style={{ color: "var(--qg-terra)" }}>
              Free &middot; no signup &middot; plain English
            </p>
            <h1 className="qt-display mx-auto mt-6 text-[38px] md:text-[56px]">
              The 401(k) questions everyone has,{" "}
              <span className="qt-question font-normal">
                answered like a friend would.
              </span>
            </h1>
            <p
              className="qt-body mx-auto mt-6 max-w-[560px]"
              style={{ color: "var(--qg-cream-muted)" }}
            >
              No jargon, no judgment, no pitch. Look up what you&rsquo;re
              wondering about, forward it to a coworker, come back whenever.
            </p>
          </div>
        </Container>
      </header>

      <section className="flex-1 pb-16">
        <Container width="narrow">
          <QuestionBrowser
            questions={questions}
            categories={CATEGORIES}
            initialQuery={q ?? ""}
          />
        </Container>
      </section>

      {/* Soft funnel CTA — raised green panel, reads from tenant config */}
      <section className="pb-20">
        <Container width="narrow">
          <div
            className="rounded-[18px] p-10 text-center"
            style={{ background: "var(--qg-panel)" }}
          >
            <h2 className="qt-h mx-auto max-w-[480px] text-[24px] md:text-[28px]">
              {TENANT.ctaHeadline}
            </h2>
            <Link href={TENANT.contactCtaUrl} className="qt-btn qt-btn-primary mt-7">
              {TENANT.ctaButtonLabel} <span aria-hidden>&rarr;</span>
            </Link>
          </div>
        </Container>
      </section>

      <Footer />
    </div>
  );
}
