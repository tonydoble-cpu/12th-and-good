import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Container from "@/components/Container";
import { ButtonLink } from "@/components/Button";

export default async function BookingSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ free?: string; mailed?: string }>;
}) {
  const { free, mailed } = await searchParams;
  const isFree = free === "1";
  const wasMailed = mailed === "1";

  // Copy rule: only promise an email when one actually went out (mailed=1).
  const freeCopy = wasMailed
    ? "Your intro call is confirmed — nothing to pay. A confirmation just landed in your email, and Tony will send the video link from the same address before the call."
    : "Your intro call is confirmed — nothing to pay. Tony will email you the video link before the call. Twenty minutes, no card, no pitch.";

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
        <p className="mx-auto max-w-[440px] text-ink-2 leading-relaxed">
          {isFree
            ? freeCopy
            : "Payment went through and your session is confirmed. You'll get a confirmation and the video link by email, and both will show up in your account too."}
        </p>
        <div className="mt-8">
          {isFree ? (
            <ButtonLink href="/">Back to 12th &amp; Good Street</ButtonLink>
          ) : (
            <ButtonLink href="/account">View My Account</ButtonLink>
          )}
        </div>
      </Container>
      <Footer variant="simple" />
    </div>
  );
}
