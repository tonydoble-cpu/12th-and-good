// Bespoke illustration system for the free tools — replaces the striped
// "un-shot imagery" placeholder swatches that made /resources read as
// under-construction. One hand-drawn-feeling SVG scene per tool, all on
// the same geometry (340×150 viewBox, 2px strokes, rounded joins) and the
// same constrained palette (paper, hero-green ink, terracotta, soft clay),
// so the set reads as one commissioned family rather than stock icons.
//
// Server component — no state, no client JS. Add a new scene by adding a
// case; unknown slugs fall back to the mark motif so a new tool never
// renders an empty box.

const P = {
  paper: "#f1efe6", // card art background
  paperHi: "#faf9f4",
  ink: "#16291d", // hero-green as the drawing ink
  inkSoft: "#4e7259",
  terra: "#b8502b",
  terraSoft: "#e08b56",
  tint: "#f7ece1",
  greenTint: "#e4e9e2",
};

function Frame({ children }: { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 340 150"
      className="h-full w-full"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      focusable="false"
    >
      <rect width="340" height="150" fill={P.paper} />
      {children}
    </svg>
  );
}

/* Shared bits */
const stroke = {
  stroke: P.ink,
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

function QuestionsArt() {
  // A stack of answer cards, top one lifted — echoes the hero question stack.
  return (
    <Frame>
      <circle cx="285" cy="20" r="58" fill={P.greenTint} />
      <rect x="86" y="52" width="168" height="76" rx="10" fill={P.paperHi} {...stroke} />
      <rect x="76" y="40" width="168" height="76" rx="10" fill="#fff" {...stroke} />
      <line x1="94" y1="62" x2="196" y2="62" {...stroke} strokeWidth={2.5} />
      <line x1="94" y1="78" x2="226" y2="78" stroke={P.inkSoft} strokeWidth={2} strokeLinecap="round" />
      <line x1="94" y1="92" x2="210" y2="92" stroke={P.inkSoft} strokeWidth={2} strokeLinecap="round" />
      <circle cx="244" cy="40" r="17" fill={P.terra} />
      <text x="244" y="47" textAnchor="middle" fontFamily="Georgia, serif" fontSize="20" fill="#fff">
        ?
      </text>
    </Frame>
  );
}

function CoachAiArt() {
  // Two voices in conversation — one paper, one terracotta reply.
  return (
    <Frame>
      <circle cx="52" cy="132" r="56" fill={P.greenTint} />
      <path
        d="M74 38h118a10 10 0 0 1 10 10v22a10 10 0 0 1-10 10H98l-16 14v-14h-8a10 10 0 0 1-10-10V48a10 10 0 0 1 10-10z"
        fill="#fff"
        {...stroke}
      />
      <line x1="92" y1="56" x2="182" y2="56" stroke={P.inkSoft} strokeWidth={2} strokeLinecap="round" />
      <line x1="92" y1="68" x2="160" y2="68" stroke={P.inkSoft} strokeWidth={2} strokeLinecap="round" />
      <path
        d="M266 74H188a10 10 0 0 0-10 10v18a10 10 0 0 0 10 10h56l16 14v-14h6a10 10 0 0 0 10-10V84a10 10 0 0 0-10-10z"
        fill={P.terra}
        stroke={P.terra}
        strokeWidth={2}
      />
      <line x1="196" y1="92" x2="258" y2="92" stroke="#f6d9c8" strokeWidth={2.5} strokeLinecap="round" />
      <line x1="196" y1="102" x2="240" y2="102" stroke="#f6d9c8" strokeWidth={2.5} strokeLinecap="round" />
      <circle cx="284" cy="46" r="3.5" fill={P.terraSoft} />
      <circle cx="298" cy="38" r="2.5" fill={P.inkSoft} />
    </Frame>
  );
}

function MatchCalculatorArt() {
  // Your bar, plus the employer match stacked on top — the whole point.
  return (
    <Frame>
      <circle cx="300" cy="128" r="60" fill={P.tint} />
      <line x1="60" y1="122" x2="280" y2="122" {...stroke} />
      <rect x="84" y="86" width="34" height="36" fill="#fff" {...stroke} />
      <rect x="146" y="66" width="34" height="56" fill="#fff" {...stroke} />
      <rect x="146" y="44" width="34" height="22" fill={P.terraSoft} stroke={P.ink} strokeWidth={2} />
      <rect x="208" y="52" width="34" height="70" fill="#fff" {...stroke} />
      <rect x="208" y="22" width="34" height="30" fill={P.terra} stroke={P.ink} strokeWidth={2} />
      <path d="M258 34l14-12 14 12" stroke={P.terra} strokeWidth={2.5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="272" y1="24" x2="272" y2="58" stroke={P.terra} strokeWidth={2.5} strokeLinecap="round" />
    </Frame>
  );
}

function DebtPayoffArt() {
  // Balances stepping down to zero, with the path drawn over them.
  return (
    <Frame>
      <circle cx="40" cy="24" r="52" fill={P.greenTint} />
      <line x1="56" y1="122" x2="292" y2="122" {...stroke} />
      <rect x="70" y="44" width="32" height="78" fill="#fff" {...stroke} />
      <rect x="122" y="64" width="32" height="58" fill="#fff" {...stroke} />
      <rect x="174" y="84" width="32" height="38" fill="#fff" {...stroke} />
      <rect x="226" y="102" width="32" height="20" fill="#fff" {...stroke} />
      <path d="M86 34c40 8 96 34 156 62 14 7 26 12 34 15" stroke={P.terra} strokeWidth={2.5} fill="none" strokeLinecap="round" strokeDasharray="1 7" />
      <circle cx="276" cy="111" r="8" fill={P.terra} />
      <path d="M272.5 111l2.6 2.6 4.6-5.2" stroke="#fff" strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </Frame>
  );
}

function EmergencyFundArt() {
  // An umbrella over a small stack of savings — weather, covered.
  return (
    <Frame>
      <circle cx="296" cy="26" r="54" fill={P.tint} />
      <path d="M96 66c0-30 28-44 74-44s74 14 74 44c-12-8-24-10-37-4-12-8-25-10-37-4-12-6-25-4-37 4-13-6-25-4-37 4z" fill={P.terraSoft} stroke={P.ink} strokeWidth={2} strokeLinejoin="round" />
      <line x1="170" y1="66" x2="170" y2="104" {...stroke} />
      <path d="M170 104c0 8-6 12-12 10" fill="none" {...stroke} />
      <rect x="140" y="112" width="60" height="12" rx="6" fill="#fff" {...stroke} />
      <rect x="148" y="98" width="44" height="12" rx="6" fill="#fff" {...stroke} opacity="0.9" />
      <path d="M64 34l-6 12M76 52l-6 12M52 60l-6 12" stroke={P.inkSoft} strokeWidth={2} strokeLinecap="round" />
      <path d="M282 70l-6 12M296 88l-6 12" stroke={P.inkSoft} strokeWidth={2} strokeLinecap="round" />
    </Frame>
  );
}

function BudgetBuilderArt() {
  // One month, divided on purpose — a stacked bar with a hand-labeled feel.
  return (
    <Frame>
      <circle cx="34" cy="130" r="50" fill={P.tint} />
      <rect x="62" y="58" width="216" height="34" rx="8" fill="#fff" {...stroke} />
      <path d="M62 66a8 8 0 0 1 8-8h78v34H70a8 8 0 0 1-8-8z" fill={P.terra} />
      <rect x="148" y="58" width="62" height="34" fill={P.terraSoft} />
      <rect x="210" y="58" width="40" height="34" fill={P.greenTint} />
      <rect x="62" y="58" width="216" height="34" rx="8" fill="none" {...stroke} />
      <line x1="148" y1="58" x2="148" y2="92" {...stroke} />
      <line x1="210" y1="58" x2="210" y2="92" {...stroke} />
      <line x1="250" y1="58" x2="250" y2="92" {...stroke} />
      <line x1="80" y1="110" x2="120" y2="110" stroke={P.inkSoft} strokeWidth={2} strokeLinecap="round" />
      <line x1="160" y1="110" x2="196" y2="110" stroke={P.inkSoft} strokeWidth={2} strokeLinecap="round" />
      <line x1="222" y1="110" x2="244" y2="110" stroke={P.inkSoft} strokeWidth={2} strokeLinecap="round" />
      <line x1="80" y1="38" x2="132" y2="38" stroke={P.inkSoft} strokeWidth={2} strokeLinecap="round" />
    </Frame>
  );
}

function BenefitsCheckupArt() {
  // The benefits list most people never finish reading — with finds circled.
  return (
    <Frame>
      <circle cx="300" cy="120" r="58" fill={P.greenTint} />
      <rect x="92" y="20" width="156" height="112" rx="10" fill="#fff" {...stroke} />
      <line x1="112" y1="44" x2="208" y2="44" stroke={P.inkSoft} strokeWidth={2} strokeLinecap="round" />
      <line x1="112" y1="66" x2="196" y2="66" stroke={P.inkSoft} strokeWidth={2} strokeLinecap="round" />
      <line x1="112" y1="88" x2="214" y2="88" stroke={P.inkSoft} strokeWidth={2} strokeLinecap="round" />
      <line x1="112" y1="110" x2="188" y2="110" stroke={P.inkSoft} strokeWidth={2} strokeLinecap="round" />
      <ellipse cx="158" cy="66" rx="58" ry="14" stroke={P.terra} strokeWidth={2.5} fill="none" transform="rotate(-2 158 66)" />
      <circle cx="252" cy="102" r="20" fill={P.tint} stroke={P.ink} strokeWidth={2} />
      <line x1="266" y1="117" x2="282" y2="133" {...stroke} strokeWidth={3} />
    </Frame>
  );
}

function WellnessArt() {
  // A pulse settling into calm — stress on the left, steadiness on the right.
  return (
    <Frame>
      <circle cx="46" cy="30" r="54" fill={P.tint} />
      <path
        d="M32 84h44l12-30 16 56 14-42 12 22h30c24 0 44-2 62-2 26 0 52 0 86-4"
        stroke={P.ink}
        strokeWidth={2.5}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="236" cy="84" r="6" fill={P.terra} />
      <circle cx="278" cy="83" r="4" fill={P.terraSoft} />
      <circle cx="308" cy="81" r="3" fill={P.inkSoft} />
    </Frame>
  );
}

function PlanBenchmarkArt() {
  // Your plan measured against the field — one bar clearly benchmarked.
  return (
    <Frame>
      <circle cx="290" cy="30" r="56" fill={P.greenTint} />
      <line x1="58" y1="122" x2="288" y2="122" {...stroke} />
      <rect x="76" y="82" width="30" height="40" fill="#fff" {...stroke} />
      <rect x="126" y="64" width="30" height="58" fill="#fff" {...stroke} />
      <rect x="176" y="40" width="30" height="82" fill={P.terra} stroke={P.ink} strokeWidth={2} />
      <rect x="226" y="72" width="30" height="50" fill="#fff" {...stroke} />
      <line x1="58" y1="64" x2="288" y2="64" stroke={P.inkSoft} strokeWidth={2} strokeDasharray="2 7" strokeLinecap="round" />
      <text x="296" y="68" fontFamily="ui-monospace, Menlo, monospace" fontSize="10" fill={P.inkSoft}>
        avg
      </text>
      <path d="M181 30l10-10 10 10" stroke={P.terra} strokeWidth={2.5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </Frame>
  );
}

function RoiArt() {
  // Cost in, more out — the employer math in one gesture.
  return (
    <Frame>
      <circle cx="42" cy="120" r="54" fill={P.tint} />
      <line x1="60" y1="122" x2="288" y2="122" {...stroke} />
      <path d="M74 104c36-4 70-16 102-38 30-20 62-32 96-34" stroke={P.terra} strokeWidth={2.5} fill="none" strokeLinecap="round" />
      <path d="M258 30h16v16" stroke={P.terra} strokeWidth={2.5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="122" cy="88" r="5" fill="#fff" stroke={P.ink} strokeWidth={2} />
      <circle cx="188" cy="58" r="5" fill="#fff" stroke={P.ink} strokeWidth={2} />
    </Frame>
  );
}

function MarkArt() {
  // Fallback — the rotated-square "dot" from the design system, enlarged.
  return (
    <Frame>
      <circle cx="170" cy="75" r="52" fill={P.greenTint} />
      <rect x="152" y="57" width="36" height="36" rx="8" fill={P.terra} transform="rotate(45 170 75)" />
    </Frame>
  );
}

const ART: Record<string, () => React.ReactElement> = {
  "401k-questions": QuestionsArt,
  "coach-ai": CoachAiArt,
  "401k-calculator": MatchCalculatorArt,
  "debt-payoff": DebtPayoffArt,
  "emergency-fund": EmergencyFundArt,
  "budget-builder": BudgetBuilderArt,
  "benefits-checkup": BenefitsCheckupArt,
  "wellness-assessment": WellnessArt,
  "plan-benchmark": PlanBenchmarkArt,
  "roi-calculator": RoiArt,
};

export default function ToolArt({ slug }: { slug: string }) {
  const Art = ART[slug] ?? MarkArt;
  return <Art />;
}
