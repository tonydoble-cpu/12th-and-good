import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import "@fontsource/instrument-sans/700.css";
import "@fontsource/ibm-plex-mono/600.css";
import "@fontsource/newsreader/400-italic.css";
import "../qtool.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Container from "@/components/Container";
import QuestionViewTracker from "@/components/QuestionViewTracker";
import {
  getAllQuestions,
  getQuestionBySlug,
  getRelatedQuestions,
  getAnswerExcerpt,
} from "@/lib/questions";
import { TENANT } from "@/lib/tenant-config";

// Individual answer page — the "ANSWER PANEL — ON PAPER" pattern from the
// Brand Handoff: paper background, #fffef8 panel with a hairline (never a
// shadow), mono eyebrow, sans answer. The question itself stays a human
// voice: Newsreader italic in quotes. Statically generated per question —
// these pages are the long-tail SEO surface.

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return getAllQuestions().map((q) => ({ slug: q.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const q = getQuestionBySlug(slug);
  if (!q) return {};
  return {
    title: `${q.question} — 401(k) Questions, ${TENANT.orgName}`,
    description: getAnswerExcerpt(q),
  };
}

export default async function QuestionPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const q = getQuestionBySlug(slug);
  if (!q) notFound();

  const related = getRelatedQuestions(slug);
  const paragraphs = q.answer.split("\n\n");

  return (
    <div className="qtool qt-paper flex min-h-full flex-col">
      <Header cta={{ label: "Talk to us", href: `${TENANT.contactCtaUrl}#contact` }} />
      <QuestionViewTracker slug={q.slug} />

      <article className="flex-1 py-14 md:py-20">
        <Container width="narrow">
          <nav className="flex items-center gap-3 text-[13px]">
            <Link
              href="/401k-questions"
              className="font-semibold no-underline"
              style={{ color: "var(--qg-clay)" }}
            >
              &larr; All 401(k) questions
            </Link>
            <span className="qt-eyebrow" style={{ color: "var(--qg-ink-muted)" }}>
              {q.category}
            </span>
          </nav>

          <h1
            className="qt-question mt-6 text-[32px] leading-[1.15] md:text-[44px]"
            style={{ color: "var(--qg-ink)" }}
          >
            &ldquo;{q.question}&rdquo;
          </h1>

          {/* Answer panel — on paper */}
          <div className="qt-panel mt-8 p-8 md:p-10">
            <p className="qt-eyebrow" style={{ color: "var(--qg-clay)" }}>
              The answer
            </p>
            <div className="mt-4 flex flex-col gap-4">
              {paragraphs.map((p, i) => (
                <p
                  key={i}
                  className="text-[17.5px] leading-[1.65]"
                  style={{ color: "var(--qg-ink-body)" }}
                >
                  {p}
                </p>
              ))}
            </div>
          </div>

          {/* Soft CTA — deep green panel on paper, wired through tenant config */}
          <div
            className="mt-10 rounded-[18px] p-9 text-center"
            style={{ background: "var(--qg-green)" }}
          >
            <p
              className="qt-h mx-auto max-w-[460px] text-[22px] md:text-[26px]"
              style={{ color: "var(--qg-cream)" }}
            >
              {TENANT.ctaHeadline}
            </p>
            <Link href={TENANT.contactCtaUrl} className="qt-btn qt-btn-primary mt-6">
              {TENANT.ctaButtonLabel} <span aria-hidden>&rarr;</span>
            </Link>
            {TENANT.poweredBy && (
              <p
                className="qt-eyebrow mt-5"
                style={{ color: "var(--qg-cream-muted)" }}
              >
                Powered by 12th &amp; Good Street
              </p>
            )}
          </div>

          {/* Related questions */}
          {related.length > 0 && (
            <div className="mt-14">
              <p className="qt-eyebrow" style={{ color: "var(--qg-clay)" }}>
                Related questions
              </p>
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {related.map((r) => (
                  <Link
                    key={r.slug}
                    href={`/401k-questions/${r.slug}`}
                    className="qt-card-light"
                  >
                    <span
                      className="qt-eyebrow block"
                      style={{ color: "var(--qg-ink-muted)" }}
                    >
                      {r.category}
                    </span>
                    <span
                      className="qt-question mt-2 block text-[17px] leading-[1.35]"
                      style={{ color: "var(--qg-ink)" }}
                    >
                      &ldquo;{r.question}&rdquo;
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </Container>
      </article>

      <Footer />
    </div>
  );
}
