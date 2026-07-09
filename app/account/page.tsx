import Link from "next/link";
import { redirect } from "next/navigation";
import { format } from "date-fns";
import Container from "@/components/Container";
import { ButtonLink } from "@/components/Button";
import { getCurrentUserBookings } from "@/lib/bookings-data";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export default async function AccountPage() {
  if (!isSupabaseConfigured) {
    return (
      <Container className="py-20 max-w-lg">
        <h1 className="font-display text-2xl font-semibold text-foreground mb-3">
          Accounts aren&apos;t connected yet
        </h1>
        <p className="text-foreground-secondary leading-relaxed">
          Your booking history and one-click rebooking live here once
          Supabase is configured. See <code>README.md</code> for setup.
        </p>
      </Container>
    );
  }

  const supabase = await createClient();
  const { data } = (await supabase?.auth.getUser()) ?? { data: { user: null } };
  if (!data.user) {
    redirect("/login?next=/account");
  }

  const bookings = await getCurrentUserBookings();
  const upcoming = bookings.filter(
    (b) => new Date(b.starts_at) > new Date() && b.status !== "canceled"
  );
  const past = bookings.filter(
    (b) => new Date(b.starts_at) <= new Date() || b.status === "canceled"
  );

  return (
    <Container className="py-16">
      <h1 className="font-display text-2xl md:text-3xl font-semibold text-foreground mb-10">
        My Account
      </h1>

      <section className="mb-14">
        <h2 className="font-display text-lg font-semibold text-foreground mb-4">
          Upcoming sessions
        </h2>
        {upcoming.length === 0 ? (
          <div className="rounded-xl border border-border-subtle bg-surface p-6">
            <p className="text-sm text-foreground-secondary mb-4">
              Nothing on the calendar yet.
            </p>
            <ButtonLink href="/tony">Book a Session</ButtonLink>
          </div>
        ) : (
          <div className="space-y-3">
            {upcoming.map((b) => (
              <div
                key={b.id}
                className="rounded-xl border border-border-subtle bg-surface p-5 flex items-center justify-between gap-4"
              >
                <div>
                  <p className="font-medium text-foreground">
                    {b.session_types?.name ?? "Coaching session"}
                  </p>
                  <p className="text-sm text-foreground-secondary mt-1">
                    {format(new Date(b.starts_at), "EEE, MMM d 'at' h:mm a")} &middot;{" "}
                    {b.status === "confirmed" ? "Confirmed" : "Awaiting payment"}
                  </p>
                </div>
                {b.status === "confirmed" && (
                  <Link
                    href={`/session/${b.id}`}
                    className="text-sm font-medium text-primary hover:text-primary-dark shrink-0"
                  >
                    View session &rarr;
                  </Link>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {past.length > 0 && (
        <section>
          <h2 className="font-display text-lg font-semibold text-foreground mb-4">
            Past sessions
          </h2>
          <div className="space-y-3">
            {past.map((b) => (
              <div
                key={b.id}
                className="rounded-xl border border-border-subtle bg-surface/60 p-5 flex items-center justify-between gap-4"
              >
                <div>
                  <p className="font-medium text-foreground">
                    {b.session_types?.name ?? "Coaching session"}
                  </p>
                  <p className="text-sm text-foreground-secondary mt-1">
                    {format(new Date(b.starts_at), "EEE, MMM d, yyyy")}
                  </p>
                </div>
                <Link
                  href={`/book?session=${b.session_type_id}`}
                  className="text-sm font-medium text-accent hover:text-accent-dark shrink-0"
                >
                  Rebook &rarr;
                </Link>
              </div>
            ))}
          </div>
        </section>
      )}
    </Container>
  );
}
