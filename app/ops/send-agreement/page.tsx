"use client";

import { useState } from "react";
import { TIER_LADDER } from "@/lib/program-pricing";

// Internal-only tool — not linked from anywhere on the site, same posture
// as /api/ops itself. Turns a real "yes" (a phone call, an email reply)
// into the onboarding email + attached agreement, without Tony writing a
// curl command every time. Token-gated exactly like the API it calls;
// there is no separate login, because this is a single-operator business
// and OPS_TOKEN already exists for exactly this purpose.
//
// Deliberately does NOT let you skip the confirmFinal checkbox — see the
// comment on the send-onboarding action in app/api/ops/route.ts for why.

const PILOT = { name: "Founding Partner Pilot", price: 9500 };
const PLANS = [...TIER_LADDER, PILOT];

function money(n: number) {
  return "$" + n.toLocaleString("en-US");
}

export default function SendAgreementPage() {
  const [token, setToken] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [planName, setPlanName] = useState<string>(TIER_LADDER[0].name);
  const [headcount, setHeadcount] = useState("");
  const [effectiveDate, setEffectiveDate] = useState("");
  const [confirmFinal, setConfirmFinal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);

  const plan = PLANS.find((p) => p.name === planName) ?? TIER_LADDER[0];
  const isPilot = planName === PILOT.name;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setResult(null);
    try {
      const res = await fetch("/api/ops", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          token,
          action: "send-onboarding",
          email,
          name: name || undefined,
          company,
          tierLabel: isPilot ? "Founding Partner Pilot" : `Annual Program — ${plan.name}`,
          annualFeeText: isPilot ? `${money(plan.price)} for 90 days` : `${money(plan.price)} / year`,
          headcountText: headcount || "—",
          effectiveDateText: effectiveDate || "—",
          isPilot,
          confirmFinal,
        }),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        setResult({ ok: true, message: `Sent to ${data.sentTo}.` });
      } else {
        setResult({ ok: false, message: data.error ?? "Something went wrong." });
      }
    } catch (err) {
      setResult({ ok: false, message: err instanceof Error ? err.message : "Request failed." });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-[560px] px-6 py-16">
      <h1 className="font-display text-[26px] font-medium text-ink">Send onboarding agreement</h1>
      <p className="mt-2 text-[14px] leading-[1.6] text-ink-2">
        Only use this after a real yes. It emails the client the agreement PDF
        (attached from <code>legal/employer-services-agreement.pdf</code>) plus
        the plan terms below, and sends you a confirmation copy.
      </p>

      <form onSubmit={submit} className="mt-8 flex flex-col gap-4">
        <label className="text-[13px] font-medium text-ink-2">
          Ops token
          <input
            type="password"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            required
            className="mt-1 w-full rounded-lg border border-line bg-white px-3 py-2 text-[14px] text-ink focus:border-accent focus:outline-none"
          />
        </label>

        <div className="grid grid-cols-2 gap-4">
          <label className="text-[13px] font-medium text-ink-2">
            Client email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 w-full rounded-lg border border-line bg-white px-3 py-2 text-[14px] text-ink focus:border-accent focus:outline-none"
            />
          </label>
          <label className="text-[13px] font-medium text-ink-2">
            Contact name (optional)
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded-lg border border-line bg-white px-3 py-2 text-[14px] text-ink focus:border-accent focus:outline-none"
            />
          </label>
        </div>

        <label className="text-[13px] font-medium text-ink-2">
          Company
          <input
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            required
            className="mt-1 w-full rounded-lg border border-line bg-white px-3 py-2 text-[14px] text-ink focus:border-accent focus:outline-none"
          />
        </label>

        <div className="grid grid-cols-2 gap-4">
          <label className="text-[13px] font-medium text-ink-2">
            Plan
            <select
              value={planName}
              onChange={(e) => setPlanName(e.target.value)}
              className="mt-1 w-full rounded-lg border border-line bg-white px-3 py-2 text-[14px] text-ink focus:border-accent focus:outline-none"
            >
              {PLANS.map((p) => (
                <option key={p.name} value={p.name}>
                  {p.name} — {money(p.price)}
                  {p.name === PILOT.name ? " / 90 days" : " / yr"}
                </option>
              ))}
            </select>
          </label>
          <label className="text-[13px] font-medium text-ink-2">
            Employees covered
            <input
              type="text"
              value={headcount}
              onChange={(e) => setHeadcount(e.target.value)}
              placeholder="e.g. up to 200"
              className="mt-1 w-full rounded-lg border border-line bg-white px-3 py-2 text-[14px] text-ink focus:border-accent focus:outline-none"
            />
          </label>
        </div>

        <label className="text-[13px] font-medium text-ink-2">
          Effective / start date
          <input
            type="text"
            value={effectiveDate}
            onChange={(e) => setEffectiveDate(e.target.value)}
            placeholder="e.g. September 1, 2026"
            className="mt-1 w-full rounded-lg border border-line bg-white px-3 py-2 text-[14px] text-ink focus:border-accent focus:outline-none"
          />
        </label>

        <label className="mt-2 flex items-start gap-3 rounded-lg border border-line bg-surface p-3 text-[13px] leading-[1.5] text-ink-2">
          <input
            type="checkbox"
            checked={confirmFinal}
            onChange={(e) => setConfirmFinal(e.target.checked)}
            className="mt-0.5"
          />
          <span>
            I confirm <code>legal/employer-services-agreement.pdf</code> is the
            attorney-reviewed final — entity name, address, governing law, and
            insurance sections filled in, no <code>[PLACEHOLDER]</code> text
            remaining.
          </span>
        </label>

        <button
          type="submit"
          disabled={submitting}
          className="mt-2 rounded-lg bg-accent px-5 py-3 text-[14px] font-semibold text-white transition-all hover:-translate-y-px hover:bg-accent-hover disabled:opacity-50"
        >
          {submitting ? "Sending…" : "Send agreement"}
        </button>

        {result && (
          <p className={`text-[13px] ${result.ok ? "text-emerald-700" : "text-rose-700"}`}>
            {result.message}
          </p>
        )}
      </form>
    </div>
  );
}
