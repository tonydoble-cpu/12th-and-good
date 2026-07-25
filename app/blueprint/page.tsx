import type { Metadata } from "next";
import BlueprintQuiz from "@/components/blueprint/BlueprintQuiz";
import { ARCHETYPES, type ArchetypeId } from "@/lib/archetypes";

// Server component wrapper. All interactivity lives in BlueprintQuiz.
// This page is intentionally sparse — the quiz owns the entire viewport.
//
// Share cards: when someone shares their result, the link carries
// ?style=<id> and the link preview unfurls with that style's card
// (public/og/<id>.png) instead of a bare text link. The quiz itself
// ignores the param — everyone walks their own walk.

type Props = {
  searchParams: Promise<{ style?: string }>;
};

const SITE = "https://12thandgood.com";

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { style } = await searchParams;
  const archetype =
    style && style in ARCHETYPES ? ARCHETYPES[style as ArchetypeId] : null;

  const title = archetype
    ? `${archetype.name} — ${archetype.tagline} | 12th & Good Street`
    : "Your Money Blueprint | 12th & Good Street";
  const description = archetype
    ? `My money style is ${archetype.name}. Walk 8 blocks and find yours — free, no email needed.`
    : "Walk from 4th & Good to 12th & Good — 8 questions, about 2 minutes, and see what's driving your money choices.";
  const image = `${SITE}/og/${archetype ? archetype.id : "blueprint"}.png`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: image, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export default function BlueprintPage() {
  return <BlueprintQuiz />;
}
