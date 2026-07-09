"use client";

import { useRef, useTransition } from "react";
import { addSessionType } from "./actions";

export default function AddSessionTypeForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();

  return (
    <form
      ref={formRef}
      action={(formData) =>
        startTransition(async () => {
          await addSessionType(formData);
          formRef.current?.reset();
        })
      }
      className="rounded-xl border border-border-subtle bg-surface p-5 space-y-3"
    >
      <p className="text-sm font-medium text-foreground">Add a session type</p>
      <input
        name="name"
        placeholder="Session name"
        required
        className="w-full rounded-lg border border-border-subtle px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
      />
      <textarea
        name="description"
        placeholder="Short description a client will see"
        rows={2}
        className="w-full rounded-lg border border-border-subtle px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
      />
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-foreground-secondary mb-1">
            Minutes
          </label>
          <input
            name="duration_minutes"
            type="number"
            min={5}
            required
            className="w-full rounded-lg border border-border-subtle px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-foreground-secondary mb-1">
            Price (USD)
          </label>
          <input
            name="price_dollars"
            type="number"
            min={0}
            step="0.01"
            required
            className="w-full rounded-lg border border-border-subtle px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>
      </div>
      <button
        type="submit"
        disabled={isPending}
        className="rounded-full bg-accent text-white px-4 py-2 text-sm font-medium hover:bg-accent-dark transition-colors disabled:opacity-50"
      >
        {isPending ? "Adding..." : "Add session type"}
      </button>
    </form>
  );
}
