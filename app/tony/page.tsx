import { notFound } from "next/navigation";
import Container from "@/components/Container";
import SessionTypeCard from "@/components/SessionTypeCard";
import { ButtonLink } from "@/components/Button";
import { getCoachBySlug, getSessionTypes } from "@/lib/coach-data";

export default async function CoachProfilePage() {
  const coach = await getCoachBySlug("tony");
  if (!coach) notFound();

  const sessionTypes = await getSessionTypes(coach.id);

  return (
    <div>
      <section className="bg-primary-tint">
        <Container className="py-16 md:py-20 grid md:grid-cols-[220px_1fr] gap-10 items-start">
          <div className="w-40 h-40 md:w-full md:aspect-square rounded-2xl bg-primary/15 border border-primary/20 flex items-center justify-center text-primary font-display font-semibold text-3xl">
            {coach.full_name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">
              Your Coach
            </p>
            <h1 className="font-display text-3xl md:text-4xl font-semibold text-foreground">
              {coach.full_name}
            </h1>
            <p className="mt-3 text-lg text-foreground-secondary max-w-xl">
              {coach.headline}
            </p>
            <div className="mt-6">
              <ButtonLink href="#session-types">See Session Types</ButtonLink>
            </div>
          </div>
        </Container>
      </section>

      <section>
        <Container className="py-16 grid md:grid-cols-3 gap-10">
          <div className="md:col-span-2">
            <h2 className="font-display text-xl font-semibold text-foreground mb-4">
              About
            </h2>
            <div className="aspect-video w-full rounded-2xl bg-foreground/5 border border-border-subtle flex items-center justify-center text-sm text-foreground-tertiary mb-6">
              {coach.video_intro_url
                ? "Video intro"
                : "Video intro goes here once recorded"}
            </div>
            <p className="text-foreground-secondary leading-relaxed">
              {coach.bio}
            </p>
          </div>
          <div>
            <h2 className="font-display text-xl font-semibold text-foreground mb-4">
              Credentials
            </h2>
            <ul className="space-y-3">
              {coach.credentials.map((c) => (
                <li
                  key={c}
                  className="text-sm text-foreground-secondary flex gap-2"
                >
                  <span className="text-primary mt-0.5">&#10003;</span>
                  <span>{c}</span>
                </li>
              ))}
            </ul>
            <div className="mt-6 rounded-xl bg-accent-tint p-4">
              <p className="text-xs text-foreground-secondary leading-relaxed">
                This is financial coaching and planning — not individualized
                investment advice. Nothing here recommends a specific
                security or product.
              </p>
            </div>
          </div>
        </Container>
      </section>

      <section id="session-types" className="bg-surface border-t border-border-subtle scroll-mt-20">
        <Container className="py-16">
          <h2 className="font-display text-2xl font-semibold text-foreground mb-2">
            Session Types
          </h2>
          <p className="text-foreground-secondary mb-10 max-w-xl">
            Pick what fits where you are right now. Every session is 1:1,
            on video, with {coach.full_name.split(" ")[0]}.
          </p>
          {sessionTypes.length === 0 ? (
            <p className="text-foreground-secondary">
              No session types are published yet.
            </p>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {sessionTypes.map((st) => (
                <SessionTypeCard key={st.id} sessionType={st} />
              ))}
            </div>
          )}
        </Container>
      </section>
    </div>
  );
}
