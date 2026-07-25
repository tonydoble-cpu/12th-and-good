import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Container from "@/components/Container";

export const metadata = {
  title: "How we make money | 12th & Good Street",
  description:
    "The full business model, in plain English. If you can't find how a financial company gets paid, that's the product. Here's ours.",
};

// This page IS the trust product. The people we serve have watched
// "advisors" get paid by everyone except the person across the table.
// Every claim here must stay literally true — update it before the model
// changes, not after.

const ROWS = [
  {
    q: "Do coaches earn commissions on anything?",
    a: "No. Every coach on this platform is fee-only: their entire pay is the session fee you see on the page. They cannot accept commissions, product fees, referral kickbacks, or bonuses from anyone else. It's the condition of being listed here.",
  },
  {
    q: "Does 12th & Good Street sell financial products?",
    a: "No. We don't sell insurance, investments, loans, or credit cards, and we never will. No company pays us to put their product in front of you.",
  },
  {
    q: "Do you sell my data?",
    a: "No. Your quiz answers and booking details exist so your coach can help you — not to be packaged for advertisers or lead brokers. See our privacy page for the plain-English version.",
  },
  {
    q: "So how does the platform make money?",
    a: "Two ways, both from services — never from products: (1) In time, a flat, disclosed platform fee on paid sessions — shown on your receipt as its own line, never hidden in the price. During our founding phase it's $0: 100% of your session fee goes to your coach. (2) Employers who bring coaching to their teams pay us directly for the program.",
  },
  {
    q: "What does 'fiduciary standard' mean here?",
    a: "It's a promise, in plain words: your coach acts in YOUR interest, not a product's, not ours. Coaching here is guidance and education — your coach helps you think and plan; they don't take control of your money or sell you investments.",
  },
];

export default function HowWeMakeMoneyPage() {
  return (
    <div className="flex min-h-full flex-col">
      <Header />
      <Container width="narrow" className="flex-1 pt-16 pb-24">
        <p className="text-[11.5px] font-semibold uppercase tracking-[0.17em] text-accent">
          Our model
        </p>
        <h1 className="mt-4 font-display text-[34px] md:text-[44px] font-normal leading-[1.08] tracking-[-0.02em] text-ink">
          How we make money.
        </h1>
        <p className="mt-6 text-[17px] leading-[1.7] text-ink-2">
          Most financial &ldquo;advice&rdquo; is a sales pitch in disguise —
          the person helping you is often paid a commission on what they sell
          you. If you can&rsquo;t find how a financial company gets paid,
          you&rsquo;re the product. So here&rsquo;s ours, all of it, in plain
          English.
        </p>

        <div className="mt-10 flex flex-col gap-7">
          {ROWS.map((r) => (
            <div key={r.q} className="border-t border-line pt-6">
              <h2 className="font-display text-[20px] md:text-[22px] font-medium leading-[1.25] text-ink">
                {r.q}
              </h2>
              <p className="mt-3 text-[15.5px] leading-[1.7] text-ink-2">{r.a}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-[16px] border border-line bg-surface p-[22px]">
          <p className="text-[15px] leading-[1.65] text-ink">
            <b>The test we invite you to run:</b> ask any financial
            professional — including ours — &ldquo;If I say no to everything
            you suggest, do you still get paid the same?&rdquo; Here, the
            answer is yes. That&rsquo;s the whole model.
          </p>
        </div>
      </Container>
      <Footer variant="simple" />
    </div>
  );
}
