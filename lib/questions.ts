/**
 * 401(k) Q&A library — data layer (funnel build brief §2).
 *
 * v1 architecture decision, documented: questions live in a repo JSON file
 * and every answer page is statically generated at build time. This deviates
 * from the brief's "questions in Supabase" on purpose:
 *   - SSG pages are the whole SEO play (brief §5) — fully-rendered HTML,
 *     instant, no runtime DB dependency, works even if Supabase hiccups.
 *   - At 175 questions, a rebuild-on-content-change is a one-command deploy,
 *     not a CMS problem.
 * The Supabase `questions` table still exists in schema.sql and the import
 * script can mirror into it — so when white-label licensing needs per-tenant
 * dynamic content, the migration path is already laid. Instrumentation
 * (question_views) IS in Supabase from day one, per the brief.
 */

import data from "./questions-data.json";

export type Question = {
  slug: string;
  category: string;
  question: string;
  answer: string; // \n\n-separated paragraphs
};

const ALL: Question[] = (data.questions as Question[]).slice();

/** Canonical category order — matches the brief's chip list. */
export const CATEGORIES = [
  "Contributions",
  "Employer Match",
  "Vesting",
  "Withdrawals & Loans",
  "Rollovers",
  "Investment Choices",
  "Fees",
  "Leaving a Job",
] as const;

export function getAllQuestions(): Question[] {
  return ALL;
}

export function getQuestionBySlug(slug: string): Question | undefined {
  return ALL.find((q) => q.slug === slug);
}

/** Related = same category first, then others; never includes itself. */
export function getRelatedQuestions(slug: string, limit = 4): Question[] {
  const current = getQuestionBySlug(slug);
  if (!current) return [];
  const sameCategory = ALL.filter(
    (q) => q.slug !== slug && q.category === current.category
  );
  const others = ALL.filter(
    (q) => q.slug !== slug && q.category !== current.category
  );
  return [...sameCategory, ...others].slice(0, limit);
}

/** First ~155 chars of the answer, cut at a word boundary — meta description. */
export function getAnswerExcerpt(q: Question, max = 155): string {
  const flat = q.answer.replace(/\n+/g, " ").trim();
  if (flat.length <= max) return flat;
  const cut = flat.slice(0, max);
  return cut.slice(0, cut.lastIndexOf(" ")) + "…";
}
