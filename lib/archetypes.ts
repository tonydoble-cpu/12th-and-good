// The six Money Orientations — the soul of the Blueprint quiz.
// Framed as current-state orientations, not fixed personalities. Someone may
// relate to several; the quiz reveals which one is leading right now.
//
// Written for 12th & Good Street by Tony (voice) — respected and capable tone, no bad
// archetypes, each has genuine strength + risk when overused + path forward.

export type ArchetypeId =
  | "bridge"
  | "builder"
  | "guardian"
  | "reclaimer"
  | "steward"
  | "pathfinder";

export type Archetype = {
  id: ArchetypeId;
  name: string;
  tagline: string;
  motivation: string;
  strength: string;
  origin: string; // Framed as possibilities, not diagnoses
  blindSpot: string;
  needNow: string;
  nextSteps: [string, string, string];
  // For the share card + gate 1 reveal
  shareLine: string;
  // Color accent for the reveal card
  accent: string;
};

export const ARCHETYPES: Record<ArchetypeId, Archetype> = {
  bridge: {
    id: "bridge",
    name: "The Bridge",
    tagline: "You think in generations, not quarters.",
    motivation: "Access and responsibility",
    strength:
      "You see money as a tool for opening doors — for yourself and for the people you love. You take the long view. You understand that wealth isn't only about you, and that gives you a clarity most people never develop.",
    origin:
      "Orientations like yours often form when you grew up watching someone work hard without full access to what money can build. Or when you became the first in your family to reach a level of income, education, or opportunity that changes what's possible. Or when you learned early that supporting the people around you was part of what money was for.",
    blindSpot:
      "You carry a lot. Sometimes so much that your own progress waits while everyone else's moves forward. Being the safety net is a strength — until it quietly costs you the future you were building the bridge toward.",
    needNow:
      "Permission to build for yourself in parallel, not after. Clear lines around what you can offer and what you can't yet. A coach who understands that family money and personal money often blur, and helps you draw the lines without guilt.",
    nextSteps: [
      "Write down what you're currently supporting — money, time, or emotional bandwidth. See it on paper.",
      "Set one financial goal that is only for you and put a real number on it.",
      "Have one conversation with a family member about money boundaries — even a small one.",
    ],
    shareLine: "I think in generations, not quarters.",
    accent: "#3a5a7d",
  },

  builder: {
    id: "builder",
    name: "The Builder",
    tagline: "You're always building the next level.",
    motivation: "Growth",
    strength:
      "You see opportunity where others see obstacles. You're wired to grow — income, assets, ownership, freedom. You take action while other people are still gathering information, and that momentum compounds.",
    origin:
      "Orientations like yours often form when you learned early that opportunity doesn't wait, or when you watched someone stay stuck because they didn't move when they could have. Sometimes it forms from ambition that had to be self-taught — because nobody in your circle had built what you're building.",
    blindSpot:
      "You rarely define enough. The next level keeps moving. You may be building toward something, but if you haven't named what you're building toward, growth can start to feel like a treadmill instead of a path.",
    needNow:
      "A definition. Not a limit — a definition. A coach who can help you translate ambition into specific numbers, timelines, and milestones — so the growth actually accumulates toward something.",
    nextSteps: [
      "Name one specific arrived milestone — a number, an asset, a level of freedom.",
      "Audit whether your current spending and investing actually align with that milestone.",
      "Set one growth move for the next 90 days that gets you materially closer.",
    ],
    shareLine: "I'm always building the next level.",
    accent: "#2f5741",
  },

  guardian: {
    id: "guardian",
    name: "The Guardian",
    tagline: "You protect what matters.",
    motivation: "Security",
    strength:
      "You create stability. You think ahead, you plan for what could go wrong, and you build financial foundations that let the people you love feel safe. That's not caution — that's stewardship in the most human sense.",
    origin:
      "Orientations like yours often form when you experienced a moment where security was threatened — a job loss, a health event, a family crisis. Or when you watched someone you love lose something they couldn't get back. Sometimes it forms from the quiet responsibility of being the one people counted on.",
    blindSpot:
      "Caution can become its own risk. If safety is your only lens, you may hold cash when you should invest, avoid opportunities that would compound, or under-live your own life because you're always preparing for the worst.",
    needNow:
      "A framework for calculated risk — not risk for its own sake, but risk in service of security. A coach who can show you where safe is actually keeping you small, and where prudent growth would make you more secure over the long run.",
    nextSteps: [
      "Look at your cash reserves. If they're over 6-9 months of expenses, that surplus is likely holding you back.",
      "Identify one calculated risk you've been avoiding — investing, launching, hiring, buying.",
      "Model what happens to your family's security in 10 years if you take that risk versus don't.",
    ],
    shareLine: "I protect what matters.",
    accent: "#6b4423",
  },

  reclaimer: {
    id: "reclaimer",
    name: "The Reclaimer",
    tagline: "You're rewriting the story.",
    motivation: "Freedom and repair",
    strength:
      "You know what most people don't — that money is emotional, historical, and personal. Because you've done real work to move past a setback, bad advice, or a pattern you inherited, you approach money with a depth and self-awareness that pays dividends most people never get.",
    origin:
      "Orientations like yours often form after a hard money chapter — a setback you didn't choose, a job that ended, a plan that fell through, or a season that took more than it gave. Sometimes it forms from watching family patterns you promised yourself you wouldn't repeat.",
    blindSpot:
      "The past can quietly keep making today's decisions. You may over-correct — refusing to invest because you lost money before, over-saving because you were once broke, avoiding financial conversations because they hurt. Repair is important. But repair isn't the same as building.",
    needNow:
      "Someone who can help you separate the wound from the wisdom. A coach who honors your history without letting it drive the car — so you can start building forward instead of only building away.",
    nextSteps: [
      "Name one financial decision you're currently making from the past, not the present.",
      "Write down what freedom actually looks like for you in dollar terms.",
      "Take one forward-facing action this month — investing, saving toward something new, planning for the next chapter, not just recovery from the last one.",
    ],
    shareLine: "I'm rewriting the story.",
    accent: "#7a3b3b",
  },

  steward: {
    id: "steward",
    name: "The Steward",
    tagline: "You're building something that lasts.",
    motivation: "Purpose and legacy",
    strength:
      "You think beyond yourself. You've built something — or you're on the way — and you want it to matter beyond your own lifetime. That mindset changes every financial decision you make. It's rare, and it's how meaningful wealth actually gets transferred and used.",
    origin:
      "Orientations like yours often form when you've reached a level of financial stability where preservation matters more than acquisition. Or when you saw wealth mishandled or lost, and decided you'd do it differently. Sometimes it forms from a personal purpose — a family, a community, a cause — that money is meant to serve.",
    blindSpot:
      "Preservation can quietly become paralysis. If everything is being protected for later, you may struggle to use money now — for joy, for impact, for the very things you were preserving it for. Legacy that never gets deployed isn't legacy.",
    needNow:
      "A plan for deployment, not just preservation. A coach who can help you draw the line between wise stewardship and hoarded potential — so what you've built actually gets used the way you intended.",
    nextSteps: [
      "Identify one specific way you'd like your wealth to create impact — for family, community, or cause.",
      "Set a deployment plan with real timelines: how much, when, to whom or what.",
      "Have one conversation this quarter with the people who will inherit or steward what you've built.",
    ],
    shareLine: "I'm building something that lasts.",
    accent: "#4a3a5c",
  },

  pathfinder: {
    id: "pathfinder",
    name: "The Pathfinder",
    tagline: "You're finding your own direction.",
    motivation: "Clarity and discovery",
    strength:
      "You're open. You're not locked into a pattern someone else taught you. That openness is a real advantage — you can build financial habits shaped by your values, not inherited ones. Most people never get that clean slate.",
    origin:
      "Orientations like yours often form when you're at a transition point — a first real income, a career pivot, a life change. Sometimes it forms because financial conversations weren't part of your upbringing, and you're figuring it out from scratch as an adult. Sometimes it forms because you've decided none of the paths you were shown fit.",
    blindSpot:
      "Gathering can quietly replace choosing. Podcasts, books, another opinion — the more information you take in, the more paralyzed a decision can feel. At some point, still figuring it out becomes the pattern instead of the phase.",
    needNow:
      "Someone who can help you make your first real financial decision with confidence, so the pattern shifts from gathering to acting. A coach who meets you where you are without judgment and helps you build the foundation your way.",
    nextSteps: [
      "Pick one financial system to build this month — a budget, an emergency fund, a first investment account. One.",
      "Set a decision deadline for it. Not when I'm ready — a date.",
      "Skip the next three finance podcasts you'd normally listen to and use that time to actually set the system up.",
    ],
    shareLine: "I'm finding my own direction.",
    accent: "#2f5760",
  },
};

// -----------------------------------------------------------------------------
// Question architecture
//
// 3 pre-gate questions, 5 post-gate. Each pre-gate question is engineered so
// Bridge can surface — Bridge is the signature archetype and needs a real
// chance to land, not just an edge case.
//
// Scoring: each answer maps to one or more archetypes with weights. We sum
// across the three pre-gate answers and pick the highest total. Ties broken
// in favor of Bridge (signature), then Reclaimer, then Pathfinder — the
// three orientations most under-served by mainstream financial services.
// -----------------------------------------------------------------------------

export type Weight = Partial<Record<ArchetypeId, number>>;

export type QuizAnswer = {
  id: string;
  label: string;
  weights: Weight;
};

export type QuizQuestion = {
  id: string;
  prompt: string;
  answers: QuizAnswer[];
  /**
   * Multi-select: user can pick several answers, then taps Next.
   * Only used on post-gate personalization questions (no scoring weights),
   * never on pre-gate questions — those drive the archetype math and need
   * exactly one answer each.
   */
  multi?: boolean;
  /**
   * Interaction style, so eight screens don't feel like the same test:
   *   "cards" (default) — tall tap cards, for the emotional questions
   *   "scale"           — one connected row of segments (ranges/brackets)
   *   "chips"           — compact two-column grid of short answers
   * Pure presentation; ids and weights are untouched.
   */
  ui?: "cards" | "scale" | "chips";
};

export const PRE_GATE_QUESTIONS: QuizQuestion[] = [
  {
    id: "q1_driver",
    prompt: "What's driving your money choices right now?",
    answers: [
      {
        id: "q1_a",
        label: "Helping my family while I build my own future",
        weights: { bridge: 3 },
      },
      {
        id: "q1_b",
        label: "Growing my income and what I own",
        weights: { builder: 3, steward: 1 },
      },
      {
        id: "q1_c",
        label: "Keeping the people I love safe",
        weights: { guardian: 3, bridge: 1 },
      },
      {
        id: "q1_d",
        label: "Getting past debt, a setback, or old habits",
        weights: { reclaimer: 3 },
      },
      {
        id: "q1_e",
        label: "Taking care of what I've built so it lasts",
        weights: { steward: 3 },
      },
      {
        id: "q1_f",
        label: "Figuring out what's right for me",
        weights: { pathfinder: 3 },
      },
    ],
  },
  {
    id: "q2_relationship",
    prompt: "Think about money and the people close to you. Which sounds most like you?",
    answers: [
      {
        id: "q2_a",
        label: "I'm the one people lean on for money help",
        weights: { bridge: 3, guardian: 1 },
      },
      {
        id: "q2_b",
        label: "I want to give more, but I'm still building my own life",
        weights: { bridge: 3, builder: 1 },
      },
      {
        id: "q2_c",
        label: "I want my family safe no matter what",
        weights: { guardian: 3 },
      },
      {
        id: "q2_d",
        label: "I'm still working through what I learned about money growing up",
        weights: { reclaimer: 2, pathfinder: 2 },
      },
      {
        id: "q2_e",
        label: "I want what I build to outlast me",
        weights: { steward: 3 },
      },
      {
        id: "q2_f",
        label: "I'm just starting to figure this part out",
        weights: { pathfinder: 3 },
      },
    ],
  },
  {
    id: "q3_stress",
    prompt: "When money stresses you out, it's mostly because...",
    answers: [
      {
        id: "q3_a",
        label: "I'm carrying money worries for more than just me",
        weights: { bridge: 3 },
      },
      {
        id: "q3_b",
        label: "Even when I hit a goal, I never feel done",
        weights: { builder: 3 },
      },
      {
        id: "q3_c",
        label: "I'm worried about what could go wrong",
        weights: { guardian: 3 },
      },
      {
        id: "q3_d",
        label: "I'm still coming back from something hard",
        weights: { reclaimer: 3 },
      },
      {
        id: "q3_e",
        label: "I'm not sure I'm using what I have well",
        weights: { steward: 3 },
      },
      {
        id: "q3_f",
        label: "I don't know if I'm making the right choices",
        weights: { pathfinder: 3 },
      },
    ],
  },
];

// Post-gate: these DEEPEN within the archetype, not re-diagnose. They
// personalize the Blueprint delivered on-screen and by email.
export const POST_GATE_QUESTIONS: QuizQuestion[] = [
  {
    id: "q4_income",
    prompt: "About how much does your household make in a year?",
    ui: "scale",
    answers: [
      { id: "u1", label: "Under $50k", weights: {} },
      { id: "u2", label: "$50k – $100k", weights: {} },
      { id: "u3", label: "$100k – $200k", weights: {} },
      { id: "u4", label: "$200k – $500k", weights: {} },
      { id: "u5", label: "$500k+", weights: {} },
    ],
  },
  {
    id: "q5_stage",
    prompt: "Where are you in life right now?",
    ui: "chips",
    answers: [
      { id: "s1", label: "Starting out", weights: {} },
      { id: "s2", label: "Building my career", weights: {} },
      { id: "s3", label: "Juggling work and family", weights: {} },
      { id: "s4", label: "Settled, and thinking ahead", weights: {} },
      { id: "s5", label: "Starting a new chapter", weights: {} },
      { id: "s6", label: "Between jobs or starting over", weights: {} },
    ],
  },
  {
    id: "q6_goal",
    prompt: "What's your #1 money goal for the next year?",
    ui: "chips",
    answers: [
      { id: "g1", label: "Pay off debt", weights: {} },
      { id: "g2", label: "Save for a rainy day", weights: {} },
      { id: "g3", label: "Save for something big — a home, a business, school", weights: {} },
      { id: "g4", label: "Invest more often", weights: {} },
      { id: "g5", label: "Make more money", weights: {} },
      { id: "g6", label: "Get a clear plan for my money", weights: {} },
      { id: "g7", label: "Make it to — and through — retirement", weights: {} },
    ],
  },
  {
    id: "q7_coach_fit",
    prompt: "What would you want in a money coach?",
    multi: true,
    answers: [
      { id: "c1", label: "They share my culture or background", weights: {} },
      { id: "c2", label: "They speak my language", weights: {} },
      { id: "c3", label: "They've been where I am", weights: {} },
      { id: "c4", label: "They really know their stuff", weights: {} },
      { id: "c5", label: "They understand how family and money mix", weights: {} },
      { id: "c6", label: "I'm not sure yet", weights: {} },
    ],
  },
  {
    id: "q8_trust",
    prompt: "What would make you trust a money coach?",
    multi: true,
    answers: [
      { id: "t1", label: "They have nothing to sell me", weights: {} },
      { id: "t2", label: "They've worked with people like me", weights: {} },
      { id: "t3", label: "Someone I trust recommends them", weights: {} },
      { id: "t4", label: "They're upfront about how they get paid", weights: {} },
      { id: "t5", label: "I can meet them face to face or on video", weights: {} },
    ],
  },
];

// -----------------------------------------------------------------------------
// Scoring
// -----------------------------------------------------------------------------

const TIE_BREAK_ORDER: ArchetypeId[] = [
  "bridge",
  "reclaimer",
  "pathfinder",
  "guardian",
  "builder",
  "steward",
];

export function scoreArchetype(answers: QuizAnswer[]): ArchetypeId {
  const totals: Record<ArchetypeId, number> = {
    bridge: 0,
    builder: 0,
    guardian: 0,
    reclaimer: 0,
    steward: 0,
    pathfinder: 0,
  };
  for (const a of answers) {
    for (const [k, v] of Object.entries(a.weights)) {
      totals[k as ArchetypeId] += v ?? 0;
    }
  }
  let max = -1;
  let winner: ArchetypeId = "pathfinder";
  for (const id of TIE_BREAK_ORDER) {
    if (totals[id] > max) {
      max = totals[id];
      winner = id;
    }
  }
  return winner;
}
