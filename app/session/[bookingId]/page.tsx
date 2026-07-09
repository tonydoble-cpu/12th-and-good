import Link from "next/link";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import Container from "@/components/Container";
import { ButtonLink } from "@/components/Button";
import { getBookingById } from "@/lib/bookings-data";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export default async function SessionPage({
  params,
}: {
  params: Promise<{ bookingId: string }>;
}) {
  const { bookingId } = await params;

  if (!isSupabaseConfigured) {
    return (
      <Container className="py-20 max-w-lg">
        <h1 className="font-display text-2xl font-semibold text-foreground mb-3">
          Live session page
        </h1>
        <p className="text-foreground-secondary leading-relaxed">
          This page shows the Zoom join link for a real, paid booking. It
          needs Supabase and Stripe connected to have a real booking to show
          — see README.md.
        </p>
      </Container>
    );
  }

  const booking = await getBookingById(bookingId);
  if (!booking) notFound();

  return (
    <Container className="py-20 max-w-lg">
      <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">
        {booking.status === "confirmed" ? "Confirmed session" : booking.status}
      </p>
      <h1 className="font-display text-2xl font-semibold text-foreground mb-2">
        {booking.session_types?.name ?? "Coaching session"}
      </h1>
      <p className="text-foreground-secondary mb-8">
        {format(new Date(booking.starts_at), "EEEE, MMMM d 'at' h:mm a")} with{" "}
        {booking.coaches?.full_name}
      </p>

      {booking.status !== "confirmed" ? (
        <p className="text-sm text-foreground-secondary">
          This session isn&apos;t confirmed yet. If you just paid, give it a
          moment and refresh.
        </p>
      ) : booking.zoom_join_url ? (
        <ButtonLink href={booking.zoom_join_url}>Join Video Session</ButtonLink>
      ) : (
        <div className="rounded-xl bg-accent-tint p-5 text-sm text-foreground-secondary">
          Your session is confirmed. The video link will appear here shortly
          before the session — if it&apos;s close to your session time and
          you don&apos;t see it, reach out and we&apos;ll send it directly.
        </div>
      )}

      {booking.coach_notes && (
        <div className="mt-10 pt-8 border-t border-border-subtle">
          <h2 className="font-display font-semibold text-foreground mb-2">
            Notes from your coach
          </h2>
          <p className="text-sm text-foreground-secondary leading-relaxed whitespace-pre-wrap">
            {booking.coach_notes}
          </p>
        </div>
      )}

      <div className="mt-10">
        <Link href="/account" className="text-sm text-foreground-secondary hover:text-foreground">
          &larr; Back to my account
        </Link>
      </div>
    </Container>
  );
}
