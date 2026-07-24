import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Container from "@/components/Container";
import BookingFlow from "@/components/BookingFlow";
import { getCoachBySlug, getOpenAvailability, getSessionTypes } from "@/lib/coach-data";
import { isStripeConfigured } from "@/lib/stripe";

// Legacy multi-step booking flow. The coach profile page now hosts booking
// inline via components/BookingCard.tsx (see the design handoff), but this
// route is kept working for anyone with an old link.
export default async function BookPage({
  searchParams,
}: {
  searchParams: Promise<{ session?: string }>;
}) {
  const { session } = await searchParams;

  // Single-coach POC: always Tony. A multi-coach marketplace would take
  // the coach slug from the route instead.
  const coach = await getCoachBySlug("tony");
  if (!coach) notFound();

  const [sessionTypes, availability] = await Promise.all([
    getSessionTypes(coach.id),
    getOpenAvailability(coach.id),
  ]);

  return (
    <div className="flex min-h-full flex-col">
      <Header cta={null} />
      <Container className="flex-1 py-16">
        <h1 className="font-display text-2xl md:text-3xl font-semibold text-foreground mb-10">
          Book with {coach.full_name}
        </h1>
        <BookingFlow
          coach={coach}
          sessionTypes={sessionTypes}
          availability={availability}
          initialSessionTypeId={session ?? null}
          stripeConfigured={isStripeConfigured}
        />
      </Container>
      <Footer variant="simple" />
    </div>
  );
}
