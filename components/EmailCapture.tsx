"use client";

import { useState, type ReactNode } from "react";

type Props = {
  /** What the user gets in exchange for their email */
  valueProp: string;
  /** Optional heading above the form */
  heading?: string;
  /** Called after successful capture — parent can unlock gated content */
  onCapture?: (email: string) => void;
  /** Where the lead came from (tool name, page, etc.) */
  source: string;
  /** Show as a compact inline form vs. a card */
  variant?: "card" | "inline";
  /** Optional children rendered below the email field */
  children?: ReactNode;
};

export default function EmailCapture({
  valueProp,
  heading,
  onCapture,
  source,
  variant = "card",
  children,
}: Props) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">(
    "idle"
  );
  const [errorMsg, setErrorMsg] = useState("");

  const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    setStatus("sending");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Something went wrong");
      }

      setStatus("done");
      onCapture?.(email);
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  if (status === "done") {
    return (
      <div
        className={
          variant === "card"
            ? "rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center"
            : "text-center py-4"
        }
      >
        <div className="flex items-center justify-center gap-2 text-emerald-700">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <span className="font-display text-[18px] font-medium">
            You&rsquo;re in.
          </span>
        </div>
        <p className="mt-2 text-[14px] text-emerald-700/80">
          We&rsquo;ll send you useful stuff — no spam, no selling.
        </p>
      </div>
    );
  }

  const formContent = (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      {heading && (
        <h3 className="font-display text-[18px] font-medium text-ink">
          {heading}
        </h3>
      )}
      <p className="text-[14px] text-ink-2 leading-relaxed">{valueProp}</p>
      <div className="flex gap-2">
        <input
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (status === "error") setStatus("idle");
          }}
          className="min-w-0 flex-1 rounded-lg border border-line bg-white px-4 py-3 text-[14px] text-ink placeholder:text-muted/60 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
        />
        <button
          type="submit"
          disabled={!isValid || status === "sending"}
          className="shrink-0 rounded-lg bg-accent px-5 py-3 text-[14px] font-semibold text-white transition-all hover:-translate-y-px hover:bg-accent-hover disabled:opacity-40 disabled:hover:translate-y-0"
        >
          {status === "sending" ? "Sending..." : "Get it"}
        </button>
      </div>
      {status === "error" && (
        <p className="text-[13px] text-rose-600">{errorMsg}</p>
      )}
      <p className="text-[11px] text-muted">
        No spam, no selling your info. Unsubscribe anytime.
      </p>
      {children}
    </form>
  );

  if (variant === "inline") {
    return formContent;
  }

  return (
    <div className="rounded-2xl border border-line bg-surface p-8">
      {formContent}
    </div>
  );
}
