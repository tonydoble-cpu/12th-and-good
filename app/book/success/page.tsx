import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Container from "@/components/Container";
import { ButtonLink } from "@/components/Button";

export default async function BookingSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ free?: string }>;
}) {
  const { free } = await searchParams;
  const isFree = free === "1";

  return (
    <div className="flex min-h-full flex-col">
      <Header cta={null} />
      <Container width="narrow" className="flex-1 py-24 text-center">
        <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-accent-tint text-2xl text-accent">
          &#10003;
        </div>
        <h1 className="font-display text-2xl font-semibold text-ink mb-3">
          You&apos;re booked
        </h1>
        <p className="text-ink-2 leading-relaxed">
          {isFree
            ? "Your intro call is confirmed — nothing to pay. You'll get a confirmation and the video link by email, and both will show up in your account too."
            : "Payment went through and your session is confirmed. You'll get a confirmation and the video link by email, and both will show up in your account too."}
        </p>
        <div className="mt-8">
          <ButtonLink href="/account">View My Account</ButtonLink>
        </div>
      </Container>
      <Footer variant="simple" />
    </div>
  );
}
