"use client";

import { useState, FormEvent } from "react";

const inputClass =
  "w-full rounded-[10px] border border-line bg-white px-[15px] py-[13px] text-[15px] text-ink placeholder:text-[#a7a196] transition-all focus:outline-none focus:border-accent focus:shadow-[0_0_0_3px_rgba(58,90,125,0.12)]";

type Status = "idle" | "submitting" | "sent" | "error";

export default function EmployerContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [teamSize, setTeamSize] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (status === "submitting") return;
    setStatus("submitting");

    try {
      const res = await fetch("/api/employer-inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, company, email, teamSize, message }),
      });

      if (!res.ok) {
        setStatus("error");
        return;
      }

      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="rounded-2xl border border-line bg-surface p-8 text-center">
        <p className="font-display text-[18px] font-medium text-ink">
          ✓ Thanks — we&rsquo;ll be in touch
        </p>
        <p className="mt-2 text-[14px] text-ink-2">
          A real person read this. Expect a reply, not a sequence.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-line bg-surface p-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-[14px]">
        <div>
          <label htmlFor="ec-name" className="mb-[6px] block text-xs font-semibold text-ink-2">
            Your name
          </label>
          <input
            id="ec-name"
            name="name"
            autoComplete="name"
            className={inputClass}
            placeholder="Alex Morgan"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="ec-company" className="mb-[6px] block text-xs font-semibold text-ink-2">
            Company
          </label>
          <input
            id="ec-company"
            name="company"
            autoComplete="organization"
            required
            className={inputClass}
            placeholder="Company name"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="ec-email" className="mb-[6px] block text-xs font-semibold text-ink-2">
            Work email
          </label>
          <input
            id="ec-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className={inputClass}
            placeholder="you@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="ec-team-size" className="mb-[6px] block text-xs font-semibold text-ink-2">
            Team size
          </label>
          <input
            id="ec-team-size"
            name="teamSize"
            className={inputClass}
            placeholder="e.g. 40"
            value={teamSize}
            onChange={(e) => setTeamSize(e.target.value)}
          />
        </div>
      </div>
      <div className="mt-[14px]">
        <label htmlFor="ec-message" className="mb-[6px] block text-xs font-semibold text-ink-2">
          What are you hoping to offer?{" "}
          <span className="font-normal text-muted">(optional)</span>
        </label>
        <textarea
          id="ec-message"
          name="message"
          className={inputClass}
          rows={3}
          style={{ resize: "none" }}
          placeholder="A few words about your team and goals…"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </div>
      <button
        type="submit"
        disabled={status === "submitting"}
        className="mt-[18px] w-full rounded-[9px] bg-accent px-6 py-[14px] text-center text-[15px] font-semibold text-white shadow-[0_8px_22px_-12px_rgba(58,90,125,0.75)] transition-all hover:-translate-y-px hover:bg-accent-hover disabled:opacity-60 disabled:hover:translate-y-0"
      >
        {status === "submitting" ? "Sending…" : "Request a conversation"}
      </button>
      {status === "error" && (
        <p className="mt-[11px] text-center text-xs text-red-600">
          Something didn&rsquo;t go through — try again, or email us directly.
        </p>
      )}
      <p className="mt-[11px] text-center text-xs text-muted">
        We&rsquo;ll only use this to get back to you.
      </p>
    </form>
  );
}
