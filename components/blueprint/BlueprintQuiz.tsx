"use client";

import { useState, useMemo } from "react";
import {
  ARCHETYPES,
  PRE_GATE_QUESTIONS,
  POST_GATE_QUESTIONS,
  scoreArchetype,
  type ArchetypeId,
  type QuizAnswer,
} from "@/lib/archetypes";
import ArchetypeReveal from "./ArchetypeReveal";
import EmailGate from "./EmailGate";
import BlueprintResult from "./BlueprintResult";
import QuestionCard from "./QuestionCard";
import Intro from "./Intro";

// The three stages of the funnel — the entire quiz is a single client
// component with a state machine. No page navigation, no reloads. Feels
// like a native app experience on Instagram in-app browser.
type Stage =
  | "intro"
  | "preGate"
  | "reveal"
  | "emailGate"
  | "postGate"
  | "blueprint";

export default function BlueprintQuiz() {
  const [stage, setStage] = useState<Stage>("intro");
  const [preGateAnswers, setPreGateAnswers] = useState<QuizAnswer[]>([]);
  const [postGateAnswers, setPostGateAnswers] = useState<QuizAnswer[]>([]);
  const [preIndex, setPreIndex] = useState(0);
  const [postIndex, setPostIndex] = useState(0);
  const [email, setEmail] = useState<string | null>(null);

  // Compute archetype once we have all three pre-gate answers
  const archetypeId: ArchetypeId | null = useMemo(() => {
    if (preGateAnswers.length < PRE_GATE_QUESTIONS.length) return null;
    return scoreArchetype(preGateAnswers);
  }, [preGateAnswers]);

  const archetype = archetypeId ? ARCHETYPES[archetypeId] : null;

  // Both handlers take arrays: single-select questions submit one answer,
  // multi-select questions (coach fit, trust) submit everything picked.
  function handlePreAnswer(answers: QuizAnswer[]) {
    const next = [...preGateAnswers, ...answers];
    setPreGateAnswers(next);
    if (preIndex < PRE_GATE_QUESTIONS.length - 1) {
      setPreIndex(preIndex + 1);
    } else {
      setStage("reveal");
    }
  }

  function handlePostAnswer(answers: QuizAnswer[]) {
    const next = [...postGateAnswers, ...answers];
    setPostGateAnswers(next);
    if (postIndex < POST_GATE_QUESTIONS.length - 1) {
      setPostIndex(postIndex + 1);
    } else {
      setStage("blueprint");
    }
  }

  function handleEmailCaptured(capturedEmail: string) {
    setEmail(capturedEmail);
    setStage("postGate");
  }

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  if (stage === "intro") {
    return <Intro onStart={() => setStage("preGate")} />;
  }

  if (stage === "preGate") {
    const question = PRE_GATE_QUESTIONS[preIndex];
    return (
      <QuestionCard
        key={question.id}
        question={question}
        currentStep={preIndex + 1}
        totalSteps={PRE_GATE_QUESTIONS.length}
        onSubmit={handlePreAnswer}
      />
    );
  }

  if (stage === "reveal" && archetype) {
    return (
      <ArchetypeReveal
        archetype={archetype}
        onContinue={() => setStage("emailGate")}
      />
    );
  }

  if (stage === "emailGate" && archetype) {
    return (
      <EmailGate
        archetype={archetype}
        onCaptured={handleEmailCaptured}
        preGateAnswers={preGateAnswers}
      />
    );
  }

  if (stage === "postGate" && archetype) {
    const question = POST_GATE_QUESTIONS[postIndex];
    return (
      <QuestionCard
        key={question.id}
        question={question}
        currentStep={postIndex + 1}
        totalSteps={POST_GATE_QUESTIONS.length}
        onSubmit={handlePostAnswer}
        accent={archetype.accent}
        subtle
      />
    );
  }

  if (stage === "blueprint" && archetype && email) {
    return (
      <BlueprintResult
        archetype={archetype}
        email={email}
        postGateAnswers={postGateAnswers}
      />
    );
  }

  return null;
}
