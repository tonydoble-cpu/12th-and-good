import BlueprintQuiz from "@/components/blueprint/BlueprintQuiz";

// Server component wrapper. All interactivity lives in BlueprintQuiz.
// This page is intentionally sparse — the quiz owns the entire viewport.

export default function BlueprintPage() {
  return <BlueprintQuiz />;
}
