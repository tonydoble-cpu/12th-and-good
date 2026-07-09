import { notFound } from "next/navigation";
import Container from "@/components/Container";
import BookingFlow from "@/components/BookingFlow";
import { getCoachBySlug, getOpenAvailability, getSessionTypes } from "@/lib/coach-data";
import { isStripeConfigured } from "@/lib/stripe";

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
    <Container className="py-16">
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
  );
}
