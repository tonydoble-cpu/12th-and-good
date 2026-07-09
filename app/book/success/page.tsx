import Container from "@/components/Container";
import { ButtonLink } from "@/components/Button";

export default function BookingSuccessPage() {
  return (
    <Container className="py-24 max-w-lg text-center">
      <div className="w-14 h-14 rounded-full bg-primary-tint text-primary flex items-center justify-center mx-auto mb-6 text-2xl">
        &#10003;
      </div>
      <h1 className="font-display text-2xl font-semibold text-foreground mb-3">
        You&apos;re booked
      </h1>
      <p className="text-foreground-secondary leading-relaxed">
        Payment went through and your session is confirmed. A confirmation
        and the video link will land in your inbox — you can also find both
        in your account.
      </p>
      <div className="mt-8">
        <ButtonLink href="/account">View My Account</ButtonLink>
      </div>
    </Container>
  );
}
