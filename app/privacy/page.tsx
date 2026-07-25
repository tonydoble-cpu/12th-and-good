import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Container from "@/components/Container";

export const metadata = {
  title: "Privacy | 12th & Good Street",
  description:
    "What we collect, why, and what we will never do with it — in plain English.",
};

const SECTIONS = [
  {
    h: "What we collect",
    body: [
      "Money Blueprint quiz: your answers, your money style result, and — only if you choose to share it — your first name and email address. The first three questions and your result never require an email.",
      "Booking a session: your name, email, and the session details, so your coach can meet you and follow up.",
      "Employer inquiries: the contact details you submit on the employer form.",
      "That's it. No account is required to take the quiz or book a session. We don't run third-party ad trackers on this site.",
    ],
  },
  {
    h: "What we use it for",
    body: [
      "Delivering what you asked for: your Blueprint, your booking confirmations, your coach match.",
      "Occasional emails from us that you can leave with one click, any time.",
      "Understanding — in aggregate — what visitors need, so we recruit the right coaches.",
    ],
  },
  {
    h: "What we never do",
    body: [
      "We never sell your data. Not to advertisers, not to lead brokers, not to financial product companies. This is the business model, not a marketing line — see How we make money.",
      "We never share your individual quiz answers with an employer. If your company brings 12th & Good Street to your workplace, your employer sees participation in aggregate only — never who said what, never who booked.",
      "We never use your information to sell you financial products. We don't have any.",
    ],
  },
  {
    h: "Who touches the data",
    body: [
      "Our infrastructure providers process data on our behalf: Vercel (site hosting) and Supabase (database). Payments, when enabled, are handled by Stripe — card numbers never touch our servers.",
      "Your coach sees what they need to coach you: your name, contact, and — if you took the quiz — your money style.",
    ],
  },
  {
    h: "Your choices",
    body: [
      "Want your data gone? Email us from the address you used and say \"delete my data\" — we'll remove your quiz record, bookings, and profile, and confirm when it's done.",
      "Every marketing email includes an unsubscribe link that works the first time.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <div className="flex min-h-full flex-col">
      <Header />
      <Container width="narrow" className="flex-1 pt-16 pb-24">
        <p className="text-[11.5px] font-semibold uppercase tracking-[0.17em] text-accent">
          Privacy
        </p>
        <h1 className="mt-4 font-display text-[34px] md:text-[44px] font-normal leading-[1.08] tracking-[-0.02em] text-ink">
          Your information, in plain English.
        </h1>
        <p className="mt-5 text-[15px] leading-[1.65] text-ink-2">
          Last updated July 2026. If we change how any of this works,
          we&rsquo;ll update this page before the change, not after.
        </p>

        <div className="mt-10 flex flex-col gap-9">
          {SECTIONS.map((s) => (
            <section key={s.h} className="border-t border-line pt-6">
              <h2 className="font-display text-[21px] font-medium text-ink">
                {s.h}
              </h2>
              <div className="mt-3 flex flex-col gap-3">
                {s.body.map((p, i) => (
                  <p key={i} className="text-[15px] leading-[1.7] text-ink-2">
                    {p}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>
      </Container>
      <Footer variant="simple" />
    </div>
  );
}
