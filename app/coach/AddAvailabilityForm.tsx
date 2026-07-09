"use client";

import { useRef, useTransition } from "react";
import { addAvailabilitySlot } from "./actions";

export default function AddAvailabilityForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();

  return (
    <form
      ref={formRef}
      action={(formData) =>
        startTransition(async () => {
          await addAvailabilitySlot(formData);
          formRef.current?.reset();
        })
      }
      className="rounded-xl border border-border-subtle bg-surface p-5 space-y-3"
    >
      <p className="text-sm font-medium text-foreground">Open a time slot</p>
      <div>
        <label className="block text-xs font-medium text-foreground-secondary mb-1">
          Start time
        </label>
        <input
          name="starts_at"
          type="datetime-local"
          required
          className="w-full rounded-lg border border-border-subtle px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-foreground-secondary mb-1">
          Duration (minutes)
        </label>
        <input
          name="duration_minutes"
          type="number"
          defaultValue={60}
          min={5}
          required
          className="w-full rounded-lg border border-border-subtle px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
        />
      </div>
      <button
        type="submit"
        disabled={isPending}
        className="rounded-full bg-primary text-white px-4 py-2 text-sm font-medium hover:bg-primary-dark transition-colors disabled:opacity-50"
      >
        {isPending ? "Adding..." : "Add time slot"}
      </button>
    </form>
  );
}
