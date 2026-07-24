"use client";

import { useState } from "react";

const inputClass =
  "w-full rounded-[10px] border border-line bg-white px-[15px] py-[13px] text-[15px] text-ink placeholder:text-[#a7a196] transition-all focus:outline-none focus:border-accent focus:shadow-[0_0_0_3px_rgba(58,90,125,0.12)]";

export default function EmployerContactForm() {
  const [sent, setSent] = useState(false);

  return (
    <div className="rounded-2xl border border-line bg-surface p-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-[14px]">
        <div>
          <label className="mb-[6px] block text-xs font-semibold text-ink-2">
            Your name
          </label>
          <input className={inputClass} placeholder="Alex Morgan" />
        </div>
        <div>
          <label className="mb-[6px] block text-xs font-semibold text-ink-2">
            Company
          </label>
          <input className={inputClass} placeholder="Company name" />
        </div>
        <div>
          <label className="mb-[6px] block text-xs font-semibold text-ink-2">
            Work email
          </label>
          <input className={inputClass} placeholder="you@company.com" />
        </div>
        <div>
          <label className="mb-[6px] block text-xs font-semibold text-ink-2">
            Team size
          </label>
          <input className={inputClass} placeholder="e.g. 40" />
        </div>
      </div>
      <div className="mt-[14px]">
        <label className="mb-[6px] block text-xs font-semibold text-ink-2">
          What are you hoping to offer?{" "}
          <span className="font-normal text-muted">(optional)</span>
        </label>
        <textarea
          className={inputClass}
          rows={3}
          style={{ resize: "none" }}
          placeholder="A few words about your team and goals…"
        />
      </div>
      <button
        type="button"
        onClick={() => setSent(true)}
        className="mt-[18px] w-full rounded-[9px] bg-accent px-6 py-[14px] text-center text-[15px] font-semibold text-white shadow-[0_8px_22px_-12px_rgba(58,90,125,0.75)] transition-all hover:-translate-y-px hover:bg-accent-hover"
      >
        {sent ? "✓ Thanks — we'll be in touch" : "Request a conversation"}
      </button>
      <p className="mt-[11px] text-center text-xs text-muted">
        We&rsquo;ll only use this to get back to you.
      </p>
    </div>
  );
}
