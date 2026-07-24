import type { Metadata } from "next";

// Standalone layout for the Blueprint funnel — no header, no footer.
// This is a paid-ad landing page. One purpose: get through the quiz and
// capture the email. Nothing else on the screen competes with that.

export const metadata: Metadata = {
  title: "Your Money Blueprint | 12th & Good Street",
  description:
    "What's driving your money choices? Discover your money archetype, the strength it gives you, and the pattern that may be holding you back.",
  openGraph: {
    title: "What's Driving Your Money Choices?",
    description:
      "Discover your money archetype in 60 seconds. Personalized Blueprint delivered to your inbox.",
    type: "website",
  },
};

export default function BlueprintLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {children}
    </div>
  );
}
