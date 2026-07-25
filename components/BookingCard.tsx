"use client";

import { useMemo, useState } from "react";
import { format } from "date-fns";
import { useUser } from "@/lib/supabase/use-user";
import { formatPrice, type AvailabilitySlot, type SessionType } from "@/lib/types";

type Props = {
  sessionTypes: SessionType[];
  availability: AvailabilitySlot[];
  /** True while Stripe isn't live: booking reserves the slot and a payment
   * link follows by email. The card must say this plainly. */
  reserveMode?: boolean;
};

// The one place a visitor becomes a client. Rules (persona audit + founder
// direction, July 2026):
//   - No account wall for anyone. Name + email + a short write-up.
//   - The write-up IS the product: Tony walks in prepared, which is why
//     there are no "intro" calls anymore. Book or don't book.
//   - No silent states, no surprise charges: reserve mode says exactly
//     what happens and when.
//   - The guarantee does the risk-taking, not a free call.

export default function BookingCard({
  sessionTypes,
  availability,
  reserveMode = false,
}: Props) {
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
      }))
      .slice(0, 6);
  }, [availability]);

  const [sessionIdx, setSessionIdx] = useState(0);
  const [dayIdx, setDayIdx] = useState(0);
  const [timeIdx, setTimeIdx] = useState(0);
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [intakeGoal, setIntakeGoal] = useState("");
  const [intakeWin, setIntakeWin] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const selectedSession = sessionTypes[sessionIdx];
  const selectedDay = days[dayIdx];
  const selectedSlot = selectedDay?.slots[Math.min(timeIdx, selectedDay.slots.length - 1)];

  const signedOut = authConfigured && !loading && !user;
  const noTimes = days.length === 0;
  const isPlan = (selectedSession?.duration_minutes ?? 0) > 90;

  const total = !selectedSession
    ? null
    : selectedSession.price_cents === 0
      ? "Free"
      : formatPrice(selectedSession.price_cents);

  let payLabel = "Select a session";
  if (selectedSession) {
    payLabel = reserveMode ? "Reserve my session" : "Continue to secure payment";
    if (selectedSession.price_cents === 0) payLabel = "Book this session";
  }
  if (submitting) payLabel = "Booking…";

  async function handleBook() {
    setErrorMessage("");

    if (!selectedSession) {
      setErrorMessage("Pick a session type first.");
      return;
    }
    if (!selectedSlot) {
      setErrorMessage("Pick a day and time first.");
      return;
    }
    if (intakeGoal.trim().length < 10) {
      setErrorMessage(
        "Tell Tony what you want to work on (a sentence or two) — it's how he shows up prepared."
      );
      return;
    }
    if (signedOut && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guestEmail)) {
      setErrorMessage("Add your email so we can confirm your session.");
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
          name: guestName.trim() || undefined,
          email: guestEmail.trim() || undefined,
          intakeGoal: intakeGoal.trim(),
          intakeWin: intakeWin.trim() || undefined,
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
    // max-h + overflow: the card grew (intake fields) and a sticky element
    // taller than the viewport traps its Book button below the fold on
    // short screens — found live, the button was unreachable. The card now
    // scrolls internally when it exceeds the viewport.
    <aside
      className="lg:sticky lg:top-[92px] lg:max-h-[calc(100vh-108px)] lg:overflow-y-auto lg:overscroll-contain rounded-[18px]"
      id="book"
    >
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
                    {s.duration_minutes} min · written plan included
                  </span>
                </span>
                <span className="whitespace-nowrap text-[14.5px] font-semibold text-ink">
                  {s.price_cents === 0 ? "Free" : formatPrice(s.price_cents)}
                </span>
              </button>
            );
          })}
        </div>

        {noTimes ? (
          <div className="mt-5 rounded-[13px] border border-dashed border-[#ddd7cb] bg-[#faf9f6] px-[16px] py-[16px]">
            <p className="text-[13.5px] leading-[1.55] text-ink-2">
              <b className="text-ink">New session times are being added.</b>{" "}
              Take the free Money Blueprint and join the Corner — you&rsquo;ll
              be first to hear when times open.
            </p>
            <a
              href="/blueprint"
              className="mt-3 inline-block text-[13.5px] font-semibold text-accent"
            >
              Get your free Blueprint &rarr;
            </a>
          </div>
        ) : (
          <>
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
                {isPlan && (
                  <p className="mt-[8px] text-[11.5px] leading-[1.5] text-muted">
                    This books your first session — you and Tony will schedule
                    the other two together on the call.
                  </p>
                )}
              </div>
            )}

            {/* The write-up — every booking, guest or signed in */}
            <div className="mt-5 flex flex-col gap-[9px]">
              <div className="text-xs font-semibold tracking-[0.02em] text-ink">
                What do you want to work on?
              </div>
              <textarea
                value={intakeGoal}
                onChange={(e) => setIntakeGoal(e.target.value)}
                placeholder="A sentence or two in your own words — Tony reads this before your session and shows up prepared."
                rows={3}
                className="w-full resize-none rounded-[10px] border border-line bg-white px-[14px] py-[11px] text-[14px] leading-[1.5] text-ink outline-none transition-colors placeholder:text-muted focus:border-accent"
              />
              <input
                type="text"
                value={intakeWin}
                onChange={(e) => setIntakeWin(e.target.value)}
                placeholder="Optional: what would make this session a win?"
                className="w-full rounded-[10px] border border-line bg-white px-[14px] py-[11px] text-[14px] text-ink outline-none transition-colors placeholder:text-muted focus:border-accent"
              />
            </div>

            {signedOut && (
              <div className="mt-4 flex flex-col gap-[9px]">
                <div className="text-xs font-semibold tracking-[0.02em] text-ink">
                  Where should your confirmation go?
                </div>
                <input
                  type="text"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="First name"
                  autoComplete="given-name"
                  className="w-full rounded-[10px] border border-line bg-white px-[14px] py-[11px] text-[14px] text-ink outline-none transition-colors placeholder:text-muted focus:border-accent"
                />
                <input
                  type="email"
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                  placeholder="Email address"
                  autoComplete="email"
                  inputMode="email"
                  className="w-full rounded-[10px] border border-line bg-white px-[14px] py-[11px] text-[14px] text-ink outline-none transition-colors placeholder:text-muted focus:border-accent"
                />
                <p className="text-[11.5px] leading-[1.5] text-muted">
                  No account, no password required.
                </p>
              </div>
            )}
          </>
        )}

        <hr className="my-4 border-line" />

        <div className="mb-[9px] flex justify-between text-sm text-ink-2">
          <span>
            {selectedSession?.name}
            {selectedSlot &&
              !noTimes &&
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
        <div className="mb-[6px] flex items-baseline justify-between">
          <span className="text-[15px] font-semibold text-ink">
            {reserveMode ? "Charged today" : "Total today"}
          </span>
          <span className="font-display text-[26px] font-medium text-ink">
            {reserveMode ? "$0" : (total ?? "—")}
          </span>
        </div>
        {reserveMode && total && total !== "Free" && (
          <p className="mb-[14px] text-[12px] leading-[1.5] text-ink-2">
            Your card isn&rsquo;t charged now — Tony sends a secure payment
            link ({total}) before your session. Your spot holds in the
            meantime.
          </p>
        )}

        <button
          type="button"
          onClick={handleBook}
          disabled={submitting || noTimes}
          className="w-full rounded-[9px] bg-accent px-6 py-[15px] text-[15.5px] font-semibold text-white shadow-[0_8px_22px_-12px_rgba(58,90,125,0.75)] transition-all hover:-translate-y-px hover:bg-accent-hover disabled:opacity-60"
        >
          {noTimes ? "Times coming soon" : payLabel}
        </button>

        {errorMessage && (
          <p className="mt-3 text-center text-[13px] text-red-600">{errorMessage}</p>
        )}

        <p className="mt-3 text-center text-[12px] leading-[1.55] text-muted">
          <b className="text-ink-2">The 12th &amp; Good promise:</b> if your
          first session isn&rsquo;t worth every dollar, say so — you
          don&rsquo;t pay.
        </p>
      </div>
    </aside>
  );
}
