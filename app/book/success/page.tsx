import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Container from "@/components/Container";
import { ButtonLink } from "@/components/Button";

export default async function BookingSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ free?: string; reserved?: string; mailed?: string }>;
}) {
  const { free, reserved, mailed } = await searchParams;
  const isFree = free === "1";
  const isReserved = reserved === "1";
  const wasMailed = mailed === "1";

  // Copy rule: only promise an email when one actually went out (mailed=1).
  let copy: string;
  if (isReserved) {
    copy = wasMailed
      ? "Your session is reserved and a confirmation just landed in your email. Nothing was charged today — Tony will send your secure payment link before the session, and the video link with it. He's already reading what you wrote."
      : "Your session is reserved — nothing was charged today. Tony will email you a secure payment link before the session, along with the video link. He's already reading what you wrote.";
  } else if (isFree) {
    copy = wasMailed
      ? "Your session is confirmed — nothing to pay. A confirmation just landed in your email, and Tony will send the video link from the same address before the call."
      : "Your session is confirmed — nothing to pay. Tony will email you the video link before the call.";
  } else {
    copy =
      "Payment went through and your session is confirmed. You'll get a confirmation and the video link by email, and both will show up in your account too.";
  }

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
        <p className="mx-auto max-w-[460px] text-ink-2 leading-relaxed">{copy}</p>
        {(isReserved || isFree) && (
          <p className="mx-auto mt-4 max-w-[460px] text-sm text-muted leading-relaxed">
            The 12th &amp; Good promise stands: if your first session
            isn&rsquo;t worth every dollar, say so — you don&rsquo;t pay.
          </p>
        )}
        <div className="mt-8">
          {isReserved || isFree ? (
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
