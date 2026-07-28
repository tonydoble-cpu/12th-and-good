"use client";

import { useEffect } from "react";

/**
 * Instrumentation (funnel build brief §3): logs one view per answer page,
 * fire-and-forget. session_id is a random ID in sessionStorage — rough
 * unique-visitor counting, deliberately no PII. Failures are silent; a
 * dropped analytics beacon must never affect the reader.
 */
export default function QuestionViewTracker({ slug }: { slug: string }) {
  useEffect(() => {
    let sessionId: string | null = null;
    try {
      sessionId = sessionStorage.getItem("qv-sid");
      if (!sessionId) {
        sessionId = crypto.randomUUID();
        sessionStorage.setItem("qv-sid", sessionId);
      }
    } catch {
      // storage unavailable (private mode etc.) — log without a session id
    }

    void fetch("/api/question-view", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        slug,
        referrer: document.referrer || null,
        sessionId,
      }),
      keepalive: true,
    }).catch(() => {});
  }, [slug]);

  return null;
}
