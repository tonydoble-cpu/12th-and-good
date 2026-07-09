import Container from "@/components/Container";
import { ButtonLink } from "@/components/Button";

const steps = [
  {
    title: "Book a session",
    body: "Pick what you need help with and a time that works. No sales call first — you go straight to the calendar.",
  },
  {
    title: "Pay securely",
    body: "You pay per session, right on the platform. One flat price. Nothing added later.",
  },
  {
    title: "Meet on video",
    body: "Talk it through face to face, from wherever you are. The session and everything you decide stays in your account.",
  },
];

const whyItMatters = [
  {
    title: "Nothing to sell",
    body: "Your coach doesn't earn a commission on anything you buy. No products, no policies, no funds. Just your questions and your plan.",
  },
  {
    title: "Plain English",
    body: "No jargon, no 15-page statements. If a word needs a finance degree to understand, we don't use it here.",
  },
  {
    title: "Built for everyone",
    body: "Honest money help shouldn't be a luxury. This is built with a strong focus on communities that get left out of financial advice — and it's open to anyone who wants it.",
  },
];

export default function Home() {
  return (
    <div>
      <section className="bg-primary-tint">
        <Container className="py-24 md:py-32">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-5">
            Conflict-free financial coaching
          </p>
          <h1 className="font-display text-4xl md:text-6xl font-semibold text-foreground max-w-3xl leading-tight">
            Nothing to sell. No commission. Just honest help with your money.
          </h1>
          <p className="mt-6 text-lg text-foreground-secondary max-w-xl">
            Book a real, 1:1 session with a fee-only coach. Build a budget,
            make a plan, and know exactly what to do next — with someone who
            doesn&apos;t earn a cent from what you buy.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <ButtonLink href="/tony">Book a Session</ButtonLink>
            <ButtonLink href="/tony" variant="ghost">
              Meet Your Coach
            </ButtonLink>
          </div>
        </Container>
      </section>

      <section>
        <Container className="py-20">
          <h2 className="font-display text-2xl md:text-3xl font-semibold text-foreground mb-12">
            How it works
          </h2>
          <div className="grid md:grid-cols-3 gap-10">
            {steps.map((step, i) => (
              <div key={step.title}>
                <div className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center font-display font-semibold text-sm mb-4">
                  {i + 1}
                </div>
                <h3 className="font-display font-semibold text-lg text-foreground mb-2">
                  {step.title}
                </h3>
                <p className="text-foreground-secondary text-sm leading-relaxed">
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-surface border-y border-border-subtle">
        <Container className="py-20">
          <h2 className="font-display text-2xl md:text-3xl font-semibold text-foreground mb-12">
            Why &quot;conflict-free&quot; matters
          </h2>
          <div className="grid md:grid-cols-3 gap-10">
            {whyItMatters.map((item) => (
              <div key={item.title}>
                <h3 className="font-display font-semibold text-lg text-foreground mb-2">
                  {item.title}
                </h3>
                <p className="text-foreground-secondary text-sm leading-relaxed">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section>
        <Container className="py-20">
          <div className="rounded-3xl bg-accent-tint p-10 md:p-14 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div>
              <h2 className="font-display text-2xl md:text-3xl font-semibold text-foreground">
                Ready to see where you actually stand?
              </h2>
              <p className="mt-3 text-foreground-secondary max-w-md">
                One session is enough to get clear. Book time with Tony and
                bring whatever&apos;s on your mind.
              </p>
            </div>
            <ButtonLink href="/tony" className="shrink-0">
              Book a Session
            </ButtonLink>
          </div>
        </Container>
      </section>
    </div>
  );
}
