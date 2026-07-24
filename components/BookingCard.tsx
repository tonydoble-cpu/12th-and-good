"use client";

import { useMemo, useState } from "react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { useUser } from "@/lib/supabase/use-user";
import { formatPrice, type AvailabilitySlot, type SessionType } from "@/lib/types";

type Props = {
  sessionTypes: SessionType[];
  availability: AvailabilitySlot[];
};

export default function BookingCard({ sessionTypes, availability }: Props) {
  const router = useRouter();
  const { user, loading, configured: authConfigured } = useUser();

  const days = useMemo(() => {
    const map = new Map<string, AvailabilitySlot[]>();
    for (const slot of availability) {
      const key = format(new Date(slot.starts_at), "yyyy-MM-dd");
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(slot);
    }
    return Array.from(map.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, slots]) => ({
        key,
        date: new Date(slots[0].starts_at),
        slots: [...slots].sort((a, b) => a.starts_at.localeCompare(b.starts_at)),
      }));
  }, [availability]);

  // Default to the middle tier (a paid single session), matching the design.
  const defaultSessionIdx = Math.max(
    0,
    sessionTypes.findIndex((s) => s.price_cents > 0)
  );

  const [sessionIdx, setSessionIdx] = useState(defaultSessionIdx);
  const [dayIdx, setDayIdx] = useState(0);
  const [timeIdx, setTimeIdx] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const selectedSession = sessionTypes[sessionIdx];
  const selectedDay = days[dayIdx];
  const selectedSlot = selectedDay?.slots[Math.min(timeIdx, selectedDay.slots.length - 1)];

  const needsSignIn = authConfigured && !loading && !user;
  const total = !selectedSession
    ? null
    : selectedSession.price_cents === 0
      ? "Free"
      : formatPrice(selectedSession.price_cents);

  let payLabel = "Select a session";
  if (selectedSession) {
    payLabel = selectedSession.price_cents === 0
      ? "Book free intro call"
      : "Continue to secure payment";
  }
  if (needsSignIn) payLabel = "Sign in to book";
  if (submitting) payLabel = "Redirecting…";

  async function handleBook() {
    if (!selectedSession || !selectedSlot) return;
    setErrorMessage("");

    if (needsSignIn) {
      router.push("/login?next=/tony");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionTypeId: selectedSession.id,
          slotId: selectedSlot.id,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error ?? "Something went wrong. Try again.");
        setSubmitting(false);
        return;
      }

      window.location.href = data.url;
    } catch {
      setErrorMessage("Couldn't reach the server. Check your connection and try again.");
      setSubmitting(false);
    }
  }

  return (
    <aside className="lg:sticky lg:top-[92px]">
      <div className="rounded-[18px] border border-line bg-surface px-6 pt-6 pb-[26px] shadow-[0_24px_56px_-34px_rgba(20,30,45,0.4)]">
        <div className="mb-1 flex items-baseline justify-between">
          <h3 className="font-display text-[21px] font-medium text-ink">
            Book a session
          </h3>
        </div>
        <p className="mb-[18px] text-[12.5px] text-muted">
          Fee-only. No commission, no booking fee.
        </p>

        <div className="flex flex-col gap-[9px]">
          {sessionTypes.map((s, i) => {
            const on = i === sessionIdx;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => {
                  setSessionIdx(i);
                  setErrorMessage("");
                }}
                className="flex w-full items-center gap-3 rounded-xl px-[15px] py-[14px] text-left transition-all"
                style={{
                  background: on ? "var(--accent-tint)" : "#fff",
                  border: on ? "1.5px solid var(--accent)" : "1.5px solid var(--line)",
                }}
              >
                <span
                  className="h-[17px] w-[17px] flex-none rounded-full box-border transition-all"
                  style={{ border: on ? "5px solid var(--accent)" : "2px solid #cfc9bd" }}
                />
                <span className="flex-1">
                  <span className="block text-[14.5px] font-semibold text-ink">
                    {s.name}
                  </span>
                  <span className="mt-[2px] block text-[12px] text-muted">
                    {s.duration_minutes} min ·{" "}
                    {s.price_cents === 0 ? "get to know each other" : "written plan included"}
                  </span>
                </span>
                <span className="whitespace-nowrap text-[14.5px] font-semibold text-ink">
                  {s.price_cents === 0 ? "Free" : formatPrice(s.price_cents)}
                </span>
              </button>
            );
          })}
        </div>

        {days.length > 0 && (
          <div className="mt-5">
            <div className="mb-[9px] text-xs font-semibold tracking-[0.02em] text-ink">
              Pick a day
            </div>
            <div className="flex gap-[7px]">
              {days.map((d, i) => {
                const on = i === dayIdx;
                return (
                  <button
                    key={d.key}
                    type="button"
                    onClick={() => {
                      setDayIdx(i);
                      setTimeIdx(0);
                      setErrorMessage("");
                    }}
                    className="flex-1 rounded-[11px] py-[9px] text-center transition-all"
                    style={
                      on
                        ? { background: "#191a1c", color: "#fff", border: "1px solid #191a1c" }
                        : { background: "#fff", color: "#3d4147", border: "1px solid #e7e4dd" }
                    }
                  >
                    <span className="block text-[10.5px] opacity-70">
                      {format(d.date, "EEE").toUpperCase()}
                    </span>
                    <span className="mt-[1px] block text-[15px] font-semibold">
                      {format(d.date, "d")}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {selectedDay && (
          <div className="mt-4">
            <div className="mb-[9px] text-xs font-semibold tracking-[0.02em] text-ink">
              Pick a time
            </div>
            <div className="flex flex-wrap gap-[7px]">
              {selectedDay.slots.map((slot, i) => {
                const on = i === timeIdx;
                return (
                  <button
                    key={slot.id}
                    type="button"
                    onClick={() => {
                      setTimeIdx(i);
                      setErrorMessage("");
                    }}
                    className="rounded-full px-[15px] py-[9px] text-[13.5px] font-medium transition-all"
                    style={
                      on
                        ? { background: "#191a1c", color: "#fff", border: "1px solid #191a1c" }
                        : { background: "#fff", color: "#3d4147", border: "1px solid #e7e4dd" }
                    }
                  >
                    {format(new Date(slot.starts_at), "h:mm a")}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <hr className="my-4 border-line" />

        <div className="mb-[9px] flex justify-between text-sm text-ink-2">
          <span>
            {selectedSession?.name}
            {selectedSlot &&
              ` · ${format(new Date(selectedSlot.starts_at), "EEE d, h:mm a")}`}
          </span>
          <span>
            {selectedSession
              ? selectedSession.price_cents === 0
                ? "Free"
                : formatPrice(selectedSession.price_cents)
              : ""}
          </span>
        </div>
        <div className="mb-[9px] flex justify-between text-sm text-ink-2">
          <span>Platform &amp; commission</span>
          <span className="font-semibold text-accent">$0</span>
        </div>
        <hr className="my-[14px] border-line" />
        <div className="mb-[18px] flex items-baseline justify-between">
          <span className="text-[15px] font-semibold text-ink">Total today</span>
          <span className="font-display text-[26px] font-medium text-ink">
            {total ?? "—"}
          </span>
        </div>

        <button
          type="button"
          onClick={handleBook}
          disabled={submitting || !selectedSession || !selectedSlot}
          className="w-full rounded-[9px] bg-accent px-6 py-[15px] text-[15.5px] font-semibold text-white shadow-[0_8px_22px_-12px_rgba(58,90,125,0.75)] transition-all hover:-translate-y-px hover:bg-accent-hover disabled:opacity-60"
        >
          {payLabel}
        </button>

        {errorMessage && (
          <p className="mt-3 text-center text-[13px] text-red-600">{errorMessage}</p>
        )}

        <p className="mt-3 flex items-center justify-center gap-[6px] text-center text-xs text-muted">
          <span className="text-accent">&#128274;</span> Secure checkout ·
          you won&rsquo;t be charged yet
        </p>
      </div>

      <p className="mx-2 mt-[14px] text-center text-[11.5px] leading-[1.55] text-muted">
        Pricing is a placeholder while we finalize rates with our founding
        coaches. It may come down from here.
      </p>
    </aside>
  );
}
