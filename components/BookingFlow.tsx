"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { formatDistanceToNow, format } from "date-fns";
import { Button } from "@/components/Button";
import { useUser } from "@/lib/supabase/use-user";
import { formatPrice, type AvailabilitySlot, type Coach, type SessionType } from "@/lib/types";

type Props = {
  coach: Coach;
  sessionTypes: SessionType[];
  availability: AvailabilitySlot[];
  initialSessionTypeId: string | null;
  stripeConfigured: boolean;
};

type Step = "session" | "time" | "confirm";

export default function BookingFlow({
  coach,
  sessionTypes,
  availability,
  initialSessionTypeId,
  stripeConfigured,
}: Props) {
  const { user, loading, configured: authConfigured } = useUser();

  const [sessionTypeId, setSessionTypeId] = useState<string | null>(
    initialSessionTypeId
  );
  const [slotId, setSlotId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState(user?.email ?? "");
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const step: Step = !sessionTypeId ? "session" : !slotId ? "time" : "confirm";

  const selectedSessionType = useMemo(
    () => sessionTypes.find((s) => s.id === sessionTypeId) ?? null,
    [sessionTypes, sessionTypeId]
  );
  const selectedSlot = useMemo(
    () => availability.find((s) => s.id === slotId) ?? null,
    [availability, slotId]
  );

  const needsSignIn = authConfigured && !loading && !user;

  async function handleConfirm(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedSessionType || !selectedSlot) return;
    setSubmitting(true);
    setErrorMessage("");

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionTypeId: selectedSessionType.id,
          slotId: selectedSlot.id,
          name,
          email,
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
    <div className="grid md:grid-cols-[1fr_280px] gap-10">
      <div>
        {step === "session" && (
          <div>
            <h2 className="font-display text-xl font-semibold text-foreground mb-6">
              1. Choose a session
            </h2>
            <div className="space-y-3">
              {sessionTypes.map((st) => (
                <button
                  key={st.id}
                  onClick={() => setSessionTypeId(st.id)}
                  className="w-full text-left rounded-xl border border-border-subtle bg-surface p-5 hover:border-primary transition-colors flex items-center justify-between gap-4"
                >
                  <div>
                    <p className="font-medium text-foreground">{st.name}</p>
                    <p className="text-sm text-foreground-secondary mt-1">
                      {st.duration_minutes} minutes
                    </p>
                  </div>
                  <span className="font-display font-semibold text-primary shrink-0">
                    {formatPrice(st.price_cents)}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === "time" && selectedSessionType && (
          <div>
            <button
              onClick={() => setSessionTypeId(null)}
              className="text-sm text-foreground-secondary hover:text-foreground mb-4"
            >
              &larr; Change session
            </button>
            <h2 className="font-display text-xl font-semibold text-foreground mb-6">
              2. Choose a time
            </h2>
            {availability.length === 0 ? (
              <p className="text-foreground-secondary text-sm">
                No open times right now — check back soon.
              </p>
            ) : (
              <div className="grid sm:grid-cols-2 gap-3">
                {availability.map((slot) => (
                  <button
                    key={slot.id}
                    onClick={() => setSlotId(slot.id)}
                    className="text-left rounded-xl border border-border-subtle bg-surface p-4 hover:border-primary transition-colors"
                  >
                    <p className="font-medium text-foreground text-sm">
                      {format(new Date(slot.starts_at), "EEEE, MMM d")}
                    </p>
                    <p className="text-sm text-foreground-secondary mt-1">
                      {format(new Date(slot.starts_at), "h:mm a")} &middot;{" "}
                      {formatDistanceToNow(new Date(slot.starts_at), {
                        addSuffix: true,
                      })}
                    </p>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {step === "confirm" && selectedSessionType && selectedSlot && (
          <div>
            <button
              onClick={() => setSlotId(null)}
              className="text-sm text-foreground-secondary hover:text-foreground mb-4"
            >
              &larr; Change time
            </button>
            <h2 className="font-display text-xl font-semibold text-foreground mb-6">
              3. Confirm &amp; pay
            </h2>

            {needsSignIn ? (
              <div className="rounded-xl border border-border-subtle bg-surface p-6">
                <p className="text-foreground-secondary text-sm mb-4">
                  Sign in so this session lands in your account — it makes
                  rebooking one click next time.
                </p>
                <Link
                  href={`/login?next=/book?session=${selectedSessionType.id}`}
                  className="inline-flex items-center justify-center rounded-full bg-primary text-white px-5 py-2.5 text-sm font-medium hover:bg-primary-dark transition-colors"
                >
                  Sign in to continue
                </Link>
              </div>
            ) : (
              <form
                onSubmit={handleConfirm}
                className="rounded-xl border border-border-subtle bg-surface p-6 space-y-4"
              >
                {!authConfigured && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">
                        Name
                      </label>
                      <input
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full rounded-lg border border-border-subtle px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">
                        Email
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full rounded-lg border border-border-subtle px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                      />
                    </div>
                  </>
                )}

                {!stripeConfigured && (
                  <div className="rounded-lg bg-accent-tint p-4 text-sm text-foreground-secondary">
                    Stripe isn&apos;t connected yet, so payment can&apos;t
                    complete — but you can preview the full flow. Add{" "}
                    <code>STRIPE_SECRET_KEY</code> to <code>.env.local</code>{" "}
                    to enable real checkout.
                  </div>
                )}

                {errorMessage && (
                  <p className="text-sm text-red-600">{errorMessage}</p>
                )}

                <Button type="submit" disabled={submitting} className="w-full">
                  {submitting
                    ? "Redirecting to payment..."
                    : `Pay ${formatPrice(selectedSessionType.price_cents)} & Book`}
                </Button>
              </form>
            )}
          </div>
        )}
      </div>

      <aside className="rounded-xl border border-border-subtle bg-surface p-5 h-fit sticky top-24">
        <p className="text-xs font-semibold uppercase tracking-widest text-foreground-tertiary mb-3">
          Summary
        </p>
        <p className="font-medium text-foreground">{coach.full_name}</p>
        {selectedSessionType && (
          <p className="text-sm text-foreground-secondary mt-2">
            {selectedSessionType.name} &middot;{" "}
            {selectedSessionType.duration_minutes} min
          </p>
        )}
        {selectedSlot && (
          <p className="text-sm text-foreground-secondary mt-1">
            {format(new Date(selectedSlot.starts_at), "EEE, MMM d 'at' h:mm a")}
          </p>
        )}
        {selectedSessionType && (
          <p className="font-display font-semibold text-primary text-lg mt-4">
            {formatPrice(selectedSessionType.price_cents)}
          </p>
        )}
      </aside>
    </div>
  );
}
