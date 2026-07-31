"use client";

import { useState } from "react";

// Internal-only dashboard for the outbound-prospecting tracker — same
// posture as /ops/send-agreement: unlinked, token-gated, single-operator
// tool. Reads/writes the outreach_targets table via /api/ops.
//
// This page never sends anything to a prospect. It exists so Tony can mark
// a target sent/replied/dead and see whose follow-up is due, instead of
// hand-editing a spreadsheet. The actual email still goes out from his own
// inbox — "Copy draft" puts the text on the clipboard, nothing more.

type Target = {
  id: string;
  region: string | null;
  segment: string;
  organization: string;
  est_size: string | null;
  contact_name: string | null;
  contact_title: string | null;
  contact_confidence: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  hook: string | null;
  draft_email: string | null;
  status: string;
  sent_at: string | null;
  follow_up_due_at: string | null;
  notes: string | null;
};

const STATUSES = [
  "researched",
  "needs_verification",
  "sent",
  "replied",
  "meeting_booked",
  "not_a_fit",
  "dead",
];

function isOverdue(t: Target) {
  return (
    t.status === "sent" &&
    t.follow_up_due_at !== null &&
    new Date(t.follow_up_due_at).getTime() <= Date.now()
  );
}

export default function OutreachDashboard() {
  const [token, setToken] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [targets, setTargets] = useState<Target[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/ops", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          token,
          action: "list-outreach-targets",
          ...(statusFilter ? { status: statusFilter } : {}),
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error ?? "Failed to load");
      setTargets(data.targets);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Request failed");
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(id: string, status: string) {
    setSavingId(id);
    try {
      const res = await fetch("/api/ops", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ token, action: "update-outreach-status", id, status }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error ?? "Failed to update");
      setTargets((prev) => prev?.map((t) => (t.id === id ? { ...t, ...data.target } : t)) ?? null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Request failed");
    } finally {
      setSavingId(null);
    }
  }

  function copyDraft(t: Target) {
    if (!t.draft_email) return;
    navigator.clipboard.writeText(t.draft_email);
    setCopiedId(t.id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  const overdueCount = targets?.filter(isOverdue).length ?? 0;

  return (
    <div className="mx-auto max-w-[860px] px-6 py-16">
      <h1 className="font-display text-[26px] font-medium text-ink">Outreach tracker</h1>
      <p className="mt-2 text-[14px] leading-[1.6] text-ink-2">
        Every target from the prospecting research, in one place. Nothing on this page sends an
        email — "Copy draft" puts the text on your clipboard so you can paste it into your own
        inbox and send it yourself.
      </p>

      <div className="mt-8 flex flex-wrap items-end gap-4">
        <label className="text-[13px] font-medium text-ink-2">
          Ops token
          <input
            type="password"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            className="mt-1 block w-[220px] rounded-lg border border-line bg-white px-3 py-2 text-[14px] text-ink focus:border-accent focus:outline-none"
          />
        </label>
        <label className="text-[13px] font-medium text-ink-2">
          Filter by status
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="mt-1 block w-[200px] rounded-lg border border-line bg-white px-3 py-2 text-[14px] text-ink focus:border-accent focus:outline-none"
          >
            <option value="">All</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s.replace(/_/g, " ")}
              </option>
            ))}
          </select>
        </label>
        <button
          onClick={load}
          disabled={loading || !token}
          className="rounded-lg bg-accent px-5 py-2.5 text-[14px] font-semibold text-white transition-all hover:-translate-y-px hover:bg-accent-hover disabled:opacity-50"
        >
          {loading ? "Loading…" : "Load targets"}
        </button>
      </div>

      {error && <p className="mt-4 text-[13px] text-rose-700">{error}</p>}

      {targets && (
        <p className="mt-6 text-[13px] text-ink-2">
          {targets.length} target{targets.length === 1 ? "" : "s"}
          {overdueCount > 0 && (
            <span className="ml-2 rounded-full bg-rose-100 px-2.5 py-1 text-[12px] font-semibold text-rose-700">
              {overdueCount} overdue for follow-up
            </span>
          )}
        </p>
      )}

      <div className="mt-4 flex flex-col gap-4">
        {targets?.map((t) => (
          <div
            key={t.id}
            className={
              "rounded-xl border p-5 " +
              (isOverdue(t) ? "border-rose-300 bg-rose-50" : "border-line bg-white")
            }
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-[15px] font-semibold text-ink">
                  {t.organization}
                  {t.region ? <span className="ml-2 text-[12px] font-normal text-muted">{t.region}</span> : null}
                </p>
                <p className="text-[13px] text-ink-2">{t.segment}</p>
                {t.contact_name && (
                  <p className="mt-1 text-[13px] text-ink-2">
                    {t.contact_name}
                    {t.contact_title ? `, ${t.contact_title}` : ""}
                    {t.contact_confidence && (
                      <span
                        className={
                          "ml-2 rounded-full px-2 py-0.5 text-[11px] font-semibold " +
                          (t.contact_confidence.toLowerCase().includes("verified") &&
                          !t.contact_confidence.toLowerCase().includes("un")
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-amber-100 text-amber-700")
                        }
                      >
                        {t.contact_confidence}
                      </span>
                    )}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={t.status}
                  onChange={(e) => updateStatus(t.id, e.target.value)}
                  disabled={savingId === t.id}
                  className="rounded-lg border border-line bg-white px-2.5 py-1.5 text-[13px] text-ink focus:border-accent focus:outline-none"
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s.replace(/_/g, " ")}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {t.hook && <p className="mt-3 text-[13px] italic leading-[1.5] text-ink-2">{t.hook}</p>}

            {isOverdue(t) && (
              <p className="mt-2 text-[12.5px] font-semibold text-rose-700">
                Follow-up due — sent {t.sent_at ? new Date(t.sent_at).toLocaleDateString() : "?"}, no
                reply logged.
              </p>
            )}

            {t.draft_email && (
              <div className="mt-3">
                <button
                  onClick={() => setExpanded(expanded === t.id ? null : t.id)}
                  className="text-[13px] font-medium text-accent hover:underline"
                >
                  {expanded === t.id ? "Hide draft" : "Show draft"}
                </button>
                {expanded === t.id && (
                  <div className="mt-2 rounded-lg border border-line bg-surface p-3">
                    <pre className="whitespace-pre-wrap font-sans text-[13px] leading-[1.5] text-ink">
                      {t.draft_email}
                    </pre>
                    <button
                      onClick={() => copyDraft(t)}
                      className="mt-3 rounded-lg border border-line bg-white px-3 py-1.5 text-[12.5px] font-semibold text-ink hover:border-ink"
                    >
                      {copiedId === t.id ? "Copied ✓" : "Copy draft"}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
