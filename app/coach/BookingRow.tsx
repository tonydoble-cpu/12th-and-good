"use client";

import { useState, useTransition } from "react";
import { format } from "date-fns";
import { formatPrice } from "@/lib/types";
import type { BookingWithDetails } from "@/lib/bookings-data";
import { updateBookingNotes, updateBookingZoomLink } from "./actions";

export default function BookingRow({ booking }: { booking: BookingWithDetails }) {
  const [notes, setNotes] = useState(booking.coach_notes ?? "");
  const [zoomUrl, setZoomUrl] = useState(booking.zoom_join_url ?? "");
  const [editing, setEditing] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSave() {
    startTransition(async () => {
      await Promise.all([
        updateBookingNotes(booking.id, notes),
        updateBookingZoomLink(booking.id, zoomUrl),
      ]);
      setEditing(false);
    });
  }

  return (
    <div className="rounded-xl border border-border-subtle bg-surface p-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="font-medium text-foreground">
            {booking.session_types?.name ?? "Coaching session"}
          </p>
          <p className="text-sm text-foreground-secondary mt-1">
            {format(new Date(booking.starts_at), "EEE, MMM d 'at' h:mm a")} &middot;{" "}
            {formatPrice(booking.price_cents)} &middot; {booking.status}
          </p>
        </div>
        <button
          onClick={() => setEditing((e) => !e)}
          className="text-sm font-medium text-primary hover:text-primary-dark shrink-0"
        >
          {editing ? "Close" : "Add notes / link"}
        </button>
      </div>

      {editing && (
        <div className="mt-4 pt-4 border-t border-border-subtle space-y-3">
          <div>
            <label className="block text-xs font-medium text-foreground-secondary mb-1">
              Zoom join link (fallback if auto-scheduling isn&apos;t on)
            </label>
            <input
              value={zoomUrl}
              onChange={(e) => setZoomUrl(e.target.value)}
              placeholder="https://zoom.us/j/..."
              className="w-full rounded-lg border border-border-subtle px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-foreground-secondary mb-1">
              Notes for the client (visible in their account)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full rounded-lg border border-border-subtle px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>
          <button
            onClick={handleSave}
            disabled={isPending}
            className="rounded-full bg-primary text-white px-4 py-2 text-sm font-medium hover:bg-primary-dark transition-colors disabled:opacity-50"
          >
            {isPending ? "Saving..." : "Save"}
          </button>
        </div>
      )}
    </div>
  );
}
