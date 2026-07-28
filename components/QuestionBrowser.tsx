"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Question } from "@/lib/questions";

/**
 * Client-side search + category filter over the full question library,
 * styled per the Brand Handoff (question cards: Newsreader italic in
 * quotes, radius 14, terracotta hover fill; chips and search on green).
 * At 175 questions this is instant with zero infrastructure.
 *
 * `initialQuery` supports the homepage's ?q= deep-link format: when the
 * text doesn't exactly match a question (which redirects server-side),
 * we land here with the search prefilled — the graceful fallback the
 * handoff specifies.
 */

type Props = {
  questions: Question[];
  categories: readonly string[];
  initialQuery?: string;
};

export default function QuestionBrowser({
  questions,
  categories,
  initialQuery = "",
}: Props) {
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState<string | null>(null);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return questions.filter((item) => {
      if (category && item.category !== category) return false;
      if (!q) return true;
      return (
        item.question.toLowerCase().includes(q) ||
        item.answer.toLowerCase().includes(q)
      );
    });
  }, [questions, query, category]);

  return (
    <div>
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search a question… (match, vesting, old 401(k), fees)"
        aria-label="Search 401(k) questions"
        className="qt-search"
      />

      <div className="mt-5 flex flex-wrap gap-2">
        <button
          onClick={() => setCategory(null)}
          className={category === null ? "qt-chip on" : "qt-chip"}
        >
          All
        </button>
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(category === c ? null : c)}
            className={category === c ? "qt-chip on" : "qt-chip"}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="mt-8 flex flex-col gap-3">
        {visible.length === 0 && (
          <p
            className="rounded-[14px] border p-8 text-center text-[15px]"
            style={{
              borderColor: "var(--qg-border)",
              background: "var(--qg-inset)",
              color: "var(--qg-cream-muted)",
            }}
          >
            Nothing matched that yet. Try a shorter word — or if your question
            isn&rsquo;t here, it&rsquo;s exactly the kind a coach answers in a
            real conversation.
          </p>
        )}
        {visible.map((q) => (
          <Link key={q.slug} href={`/401k-questions/${q.slug}`} className="qt-card">
            <span>
              <span className="qt-eyebrow qt-cat block">{q.category}</span>
              <span className="qt-question qt-q mt-2 block">
                &ldquo;{q.question}&rdquo;
              </span>
              <span className="qt-snippet mt-2 block text-[14px] leading-[1.55]">
                {q.answer.split("\n")[0].slice(0, 130)}
                {q.answer.split("\n")[0].length > 130 ? "…" : ""}
              </span>
            </span>
            <span className="qt-arrow text-[20px]" aria-hidden>
              &rarr;
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
