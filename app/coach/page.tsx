import { redirect } from "next/navigation";
import { format } from "date-fns";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Container from "@/components/Container";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getAllUpcomingAvailability, getCoachForUser, getSessionTypes } from "@/lib/coach-data";
import { getCoachBookings } from "@/lib/bookings-data";
import { formatPrice } from "@/lib/types";
import BookingRow from "./BookingRow";
import AddSessionTypeForm from "./AddSessionTypeForm";
import AddAvailabilityForm from "./AddAvailabilityForm";

export default async function CoachDashboardPage() {
  if (!isSupabaseConfigured) {
    return (
      <div className="flex min-h-full flex-col">
        <Header cta={null} />
        <Container className="flex-1 py-20 max-w-lg">
          <h1 className="font-display text-2xl font-semibold text-foreground mb-3">
            Coach dashboard isn&apos;t live yet
          </h1>
          <p className="text-foreground-secondary leading-relaxed">
            This requires Supabase to be configured and a coach account
            signed in. Run <code>supabase/schema.sql</code> against your
            project, create a Supabase auth user for Tony, and set that
            user&apos;s <code>id</code> as <code>coaches.user_id</code>. See
            README.md.
          </p>
        </Container>
        <Footer variant="simple" />
      </div>
    );
  }

  const supabase = await createClient();
  const { data } = (await supabase?.auth.getUser()) ?? { data: { user: null } };
  if (!data.user) {
    redirect("/login?next=/coach");
  }

  const coach = await getCoachForUser(data.user.id);
  if (!coach) {
    return (
      <div className="flex min-h-full flex-col">
        <Header cta={null} />
        <Container className="flex-1 py-20 max-w-lg">
          <h1 className="font-display text-2xl font-semibold text-foreground mb-3">
            No coach profile linked
          </h1>
          <p className="text-foreground-secondary leading-relaxed">
            You&apos;re signed in, but this account isn&apos;t linked to a
            coach row. Set <code>coaches.user_id</code> to this user&apos;s
            ID in Supabase.
          </p>
        </Container>
        <Footer variant="simple" />
      </div>
    );
  }

  const [bookings, sessionTypes, availability] = await Promise.all([
    getCoachBookings(),
    getSessionTypes(coach.id),
    getAllUpcomingAvailability(coach.id),
  ]);

  const upcomingBookings = bookings.filter(
    (b) => new Date(b.starts_at) > new Date() && b.status !== "canceled"
  );
  const pastBookings = bookings.filter(
    (b) => new Date(b.starts_at) <= new Date() && b.status !== "canceled"
  );

  return (
    <div className="flex min-h-full flex-col">
      <Header cta={null} />
      <Container className="flex-1 py-16">
      <h1 className="font-display text-2xl md:text-3xl font-semibold text-foreground mb-2">
        Coach Dashboard
      </h1>
      <p className="text-foreground-secondary mb-10">
        Signed in as {coach.full_name}
      </p>

      <div className="grid lg:grid-cols-[1fr_320px] gap-10">
        <div>
          <section className="mb-12">
            <h2 className="font-display text-lg font-semibold text-foreground mb-4">
              Upcoming bookings
            </h2>
            {upcomingBookings.length === 0 ? (
              <p className="text-sm text-foreground-secondary">
                No upcoming bookings yet.
              </p>
            ) : (
              <div className="space-y-3">
                {upcomingBookings.map((b) => (
                  <BookingRow key={b.id} booking={b} />
                ))}
              </div>
            )}
          </section>

          {pastBookings.length > 0 && (
            <section>
              <h2 className="font-display text-lg font-semibold text-foreground mb-4">
                Past bookings
              </h2>
              <div className="space-y-3">
                {pastBookings.map((b) => (
                  <BookingRow key={b.id} booking={b} />
                ))}
              </div>
            </section>
          )}
        </div>

        <div className="space-y-8">
          <section>
            <h2 className="font-display text-lg font-semibold text-foreground mb-4">
              Session types
            </h2>
            <div className="space-y-2 mb-4">
              {sessionTypes.map((st) => (
                <div
                  key={st.id}
                  className="rounded-lg border border-border-subtle bg-surface px-4 py-3 flex items-center justify-between text-sm"
                >
                  <span className="text-foreground">{st.name}</span>
                  <span className="text-primary font-medium">
                    {formatPrice(st.price_cents)}
                  </span>
                </div>
              ))}
            </div>
            <AddSessionTypeForm />
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold text-foreground mb-4">
              Availability
            </h2>
            <div className="space-y-2 mb-4">
              {availability.length === 0 ? (
                <p className="text-sm text-foreground-secondary">
                  No open times published.
                </p>
              ) : (
                availability.slice(0, 8).map((slot) => (
                  <div
                    key={slot.id}
                    className="rounded-lg border border-border-subtle bg-surface px-4 py-3 text-sm flex items-center justify-between"
                  >
                    <span className="text-foreground">
                      {format(new Date(slot.starts_at), "EEE, MMM d 'at' h:mm a")}
                    </span>
                    <span
                      className={
                        slot.is_booked ? "text-accent" : "text-foreground-tertiary"
                      }
                    >
                      {slot.is_booked ? "Booked" : "Open"}
                    </span>
                  </div>
                ))
              )}
            </div>
            <AddAvailabilityForm />
          </section>
        </div>
      </div>
      </Container>
      <Footer variant="simple" />
    </div>
  );
}
