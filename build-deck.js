const pptxgen = require("pptxgenjs");

const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE"; // 13.3" × 7.5"
pres.author = "12th & Good Street";
pres.title = "12th & Good Street — Financial Wellness for Your Team";

// ── Brand colors ──
const C = {
  ink: "1e2d3d",
  accent: "3a5a7d",
  accentLight: "e8eef4",
  white: "FFFFFF",
  offWhite: "f5f4f1",
  muted: "8a9aab",
  green: "2d8a5e",
  amber: "b87a1e",
  coral: "c0523e",
  teal: "1a7a7a",
};

// ── Reusable styles ──
const BODY = { fontFace: "Cambria", fontSize: 15, color: C.muted, lineSpacingMultiple: 1.5 };
const H1 = { fontFace: "Cambria", fontSize: 40, color: C.ink, bold: true };
const H2 = { fontFace: "Cambria", fontSize: 32, color: C.ink, bold: true };
const H3 = { fontFace: "Cambria", fontSize: 20, color: C.ink, bold: true };
const LABEL = { fontFace: "Calibri", fontSize: 11, color: C.muted };
const STAT_NUM = { fontFace: "Cambria", fontSize: 48, color: C.accent, bold: true };
const STAT_LABEL = { fontFace: "Calibri", fontSize: 13, color: C.muted, lineSpacingMultiple: 1.3 };

function addDot(slide, x, y, size = 0.12) {
  slide.addShape(pres.ShapeType.ellipse, {
    x, y, w: size, h: size, fill: { color: C.accent },
  });
}

// ═══════════════════════════════════════════════════════════════════
// SLIDE 1 — Title
// ═══════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { fill: C.ink };

  // Dot logo
  s.addShape(pres.ShapeType.roundRect, {
    x: 0.8, y: 0.7, w: 0.45, h: 0.45, rectRadius: 0.08,
    fill: { color: C.white },
  });
  s.addShape(pres.ShapeType.ellipse, {
    x: 0.93, y: 0.83, w: 0.18, h: 0.18,
    fill: { color: C.ink },
  });

  s.addText("12th & Good", {
    x: 1.4, y: 0.62, w: 3, h: 0.6,
    fontFace: "Cambria", fontSize: 24, color: C.white, bold: true, margin: 0,
  });

  s.addText("Financial Wellness\nfor Your Team", {
    x: 0.8, y: 2.2, w: 7, h: 2.2,
    fontFace: "Cambria", fontSize: 52, color: C.white, bold: true,
    lineSpacingMultiple: 1.1, margin: 0,
  });

  s.addText("The marketplace for better money conversations.", {
    x: 0.8, y: 4.5, w: 7, h: 0.7,
    fontFace: "Calibri", fontSize: 20, color: C.muted, margin: 0,
  });

  s.addText("12thandgood.com", {
    x: 0.8, y: 6.6, w: 3, h: 0.4,
    fontFace: "Calibri", fontSize: 14, color: C.muted, margin: 0,
  });

  s.addNotes("Opening slide. Introduce 12th & Good Street as a financial wellness program, not a fintech product.");
}

// ═══════════════════════════════════════════════════════════════════
// SLIDE 2 — The Problem
// ═══════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { fill: C.white };

  s.addText("THE PROBLEM", {
    x: 0.8, y: 0.6, w: 4, h: 0.3,
    fontFace: "Calibri", fontSize: 11, color: C.accent, bold: true,
    charSpacing: 3, margin: 0,
  });

  s.addText("Your team's money\nstress is already\ncosting you.", {
    x: 0.8, y: 1.1, w: 6.5, h: 2.4,
    fontFace: "Cambria", fontSize: 42, color: C.ink, bold: true,
    lineSpacingMultiple: 1.05, margin: 0,
  });

  // Stats on right side
  const stats = [
    { num: "59%", label: "of employees report\nfinancial stress", source: "PwC 2026" },
    { num: "3.3 hrs", label: "per week lost to money\nissues at work", source: "Valoir 2025" },
    { num: "2×", label: "more likely to job-search\nwhen financially stressed", source: "PwC 2026" },
  ];

  stats.forEach((st, i) => {
    const yBase = 1.2 + i * 1.9;
    s.addText(st.num, {
      x: 8.2, y: yBase, w: 4.5, h: 0.7,
      fontFace: "Cambria", fontSize: 44, color: C.accent, bold: true, margin: 0,
    });
    s.addText(st.label, {
      x: 8.2, y: yBase + 0.65, w: 4.5, h: 0.6,
      fontFace: "Calibri", fontSize: 14, color: C.muted, lineSpacingMultiple: 1.25, margin: 0,
    });
    s.addText(st.source, {
      x: 8.2, y: yBase + 1.25, w: 4.5, h: 0.3,
      fontFace: "Calibri", fontSize: 10, color: C.muted, italic: true, margin: 0,
    });
  });

  s.addNotes("Key message: financial stress isn't just a personal problem — it shows up at work as distraction, turnover, and disengagement. These are conservative numbers from credible sources.");
}

// ═══════════════════════════════════════════════════════════════════
// SLIDE 3 — What Most Programs Get Wrong
// ═══════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { fill: C.offWhite };

  s.addText("WHAT MOST PROGRAMS GET WRONG", {
    x: 0.8, y: 0.6, w: 6, h: 0.3,
    fontFace: "Calibri", fontSize: 11, color: C.accent, bold: true,
    charSpacing: 3, margin: 0,
  });

  s.addText("A portal nobody logs into isn't\nfinancial wellness.", {
    x: 0.8, y: 1.2, w: 11, h: 1.4,
    fontFace: "Cambria", fontSize: 36, color: C.ink, bold: true,
    lineSpacingMultiple: 1.1, margin: 0,
  });

  const problems = [
    { title: "Self-serve portals", desc: "Employees get a login to a tool. Usage drops off after month one. The stress stays." },
    { title: "Product-backed advice", desc: "The 'advisor' earns commission. Employees sense it and stop trusting the guidance." },
    { title: "One-size webinars", desc: "A lunch-and-learn that doesn't address anyone's specific situation. Polite attendance, zero behavior change." },
  ];

  problems.forEach((p, i) => {
    const x = 0.8 + i * 4.0;
    addDot(s, x, 3.15, 0.14);
    s.addText(p.title, {
      x: x + 0.25, y: 3.05, w: 3.5, h: 0.35,
      ...H3, margin: 0,
    });
    s.addText(p.desc, {
      x: x + 0.25, y: 3.5, w: 3.5, h: 1.2,
      ...BODY, fontSize: 14, margin: 0,
    });
  });

  s.addText("What actually works is simpler: give people access to a real person\nthey can trust, and let them talk about what's on their mind.", {
    x: 0.8, y: 5.3, w: 11, h: 0.9,
    fontFace: "Cambria", fontSize: 17, color: C.ink, italic: true,
    lineSpacingMultiple: 1.4, margin: 0,
  });

  s.addNotes("Frame the competition as broken — portals, commission-based advisors, generic webinars. Position 12th & Good Street as the alternative.");
}

// ═══════════════════════════════════════════════════════════════════
// SLIDE 4 — What 12th & Good Street Is
// ═══════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { fill: C.white };

  s.addText("WHAT 12TH & GOOD IS", {
    x: 0.8, y: 0.6, w: 6, h: 0.3,
    fontFace: "Calibri", fontSize: 11, color: C.accent, bold: true,
    charSpacing: 3, margin: 0,
  });

  s.addText("Human-first\nfinancial wellness.", {
    x: 0.8, y: 1.2, w: 6, h: 1.6,
    fontFace: "Cambria", fontSize: 42, color: C.ink, bold: true,
    lineSpacingMultiple: 1.05, margin: 0,
  });

  const points = [
    { title: "A person, not a portal", desc: "Real conversations with real people. It gets used because it actually helps." },
    { title: "No product behind the advice", desc: "Fee-only coaches. No commission, no product sales. That changes what they recommend." },
    { title: "Private by default", desc: "You sponsor the access. What someone discusses stays between them and their coach." },
  ];

  points.forEach((p, i) => {
    const yBase = 3.2 + i * 1.3;
    // Card background
    s.addShape(pres.ShapeType.roundRect, {
      x: 0.8, y: yBase, w: 11.7, h: 1.1, rectRadius: 0.1,
      fill: { color: C.accentLight },
    });
    addDot(s, 1.1, yBase + 0.4, 0.14);
    s.addText(p.title, {
      x: 1.45, y: yBase + 0.15, w: 3, h: 0.35,
      ...H3, fontSize: 17, margin: 0,
    });
    s.addText(p.desc, {
      x: 4.6, y: yBase + 0.15, w: 7.5, h: 0.8,
      ...BODY, fontSize: 14, margin: 0,
    });
  });

  s.addNotes("Three differentiators that matter to HR buyers: real humans, no conflicts of interest, and privacy that builds trust.");
}

// ═══════════════════════════════════════════════════════════════════
// SLIDE 5 — What Your Team Gets
// ═══════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { fill: C.white };

  s.addText("THE PROGRAM", {
    x: 0.8, y: 0.6, w: 6, h: 0.3,
    fontFace: "Calibri", fontSize: 11, color: C.accent, bold: true,
    charSpacing: 3, margin: 0,
  });

  s.addText("What your team gets access to.", {
    x: 0.8, y: 1.1, w: 10, h: 0.7,
    ...H2, margin: 0,
  });

  const items = [
    { title: "1:1 coaching sessions", desc: "Over video, with a vetted, fee-only coach." },
    { title: "Free intro call", desc: "No commitment — a way to see if coaching helps." },
    { title: "Group sessions", desc: "Lunch-and-learns on topics your team cares about." },
    { title: "AI Money Coach", desc: "24/7 AI chat trained in our coaching approach." },
    { title: "Written action plans", desc: "Every session ends with something concrete." },
    { title: "Benefits navigation", desc: "Help employees use the benefits you already pay for." },
  ];

  items.forEach((item, i) => {
    const col = i % 3;
    const row = Math.floor(i / 3);
    const x = 0.8 + col * 4.1;
    const y = 2.2 + row * 2.3;

    s.addShape(pres.ShapeType.roundRect, {
      x, y, w: 3.8, h: 2.0, rectRadius: 0.12,
      fill: { color: C.offWhite },
    });
    addDot(s, x + 0.25, y + 0.35, 0.12);
    s.addText(item.title, {
      x: x + 0.25, y: y + 0.55, w: 3.3, h: 0.35,
      ...H3, fontSize: 16, margin: 0,
    });
    s.addText(item.desc, {
      x: x + 0.25, y: y + 1.0, w: 3.3, h: 0.7,
      ...BODY, fontSize: 13, margin: 0,
    });
  });

  s.addNotes("Walk through the full program. Emphasize this is comprehensive — not just one tool or one webinar.");
}

// ═══════════════════════════════════════════════════════════════════
// SLIDE 6 — Benefits Navigation
// ═══════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { fill: C.offWhite };

  s.addText("BENEFITS NAVIGATION", {
    x: 0.8, y: 0.6, w: 6, h: 0.3,
    fontFace: "Calibri", fontSize: 11, color: C.accent, bold: true,
    charSpacing: 3, margin: 0,
  });

  s.addText("Your team has benefits\nthey're not fully using.", {
    x: 0.8, y: 1.2, w: 6, h: 1.5,
    fontFace: "Cambria", fontSize: 36, color: C.ink, bold: true,
    lineSpacingMultiple: 1.08, margin: 0,
  });

  s.addText("A 12th & Good Street coach helps employees understand and use the benefits\nyou're already paying for. That means better ROI on your existing\nbenefits spend — not just another line item.", {
    x: 0.8, y: 2.8, w: 6, h: 1.2,
    ...BODY, fontSize: 15, margin: 0,
  });

  // Right side card
  s.addShape(pres.ShapeType.roundRect, {
    x: 7.5, y: 1.2, w: 5.2, h: 5.5, rectRadius: 0.15,
    fill: { color: C.white },
    shadow: { type: "outer", blur: 15, offset: 4, angle: 270, color: "000000", opacity: 0.08 },
  });

  s.addText("Common gaps coaches help close", {
    x: 7.9, y: 1.5, w: 4.5, h: 0.4,
    ...H3, fontSize: 15, margin: 0,
  });

  const gaps = [
    "Not contributing enough to get the full employer match",
    "HSA or FSA available but unused",
    "Life and disability coverage not understood",
    "EAP exists but nobody knows about it",
    "Tuition reimbursement going unclaimed",
  ];

  gaps.forEach((g, i) => {
    const y = 2.2 + i * 0.85;
    addDot(s, 8.0, y + 0.08, 0.1);
    s.addText(g, {
      x: 8.25, y: y - 0.05, w: 4.1, h: 0.7,
      fontFace: "Calibri", fontSize: 13, color: C.muted, lineSpacingMultiple: 1.3, margin: 0,
    });
  });

  s.addNotes("Key selling point for HR: coaching helps employees use existing benefits, which improves ROI on what the employer is already spending.");
}

// ═══════════════════════════════════════════════════════════════════
// SLIDE 7 — The Business Case / ROI
// ═══════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { fill: C.ink };

  s.addText("THE BUSINESS CASE", {
    x: 0.8, y: 0.6, w: 6, h: 0.3,
    fontFace: "Calibri", fontSize: 11, color: C.muted, bold: true,
    charSpacing: 3, margin: 0,
  });

  s.addText("$5.50 return\nfor every $1 invested.", {
    x: 0.8, y: 1.2, w: 9, h: 1.7,
    fontFace: "Cambria", fontSize: 44, color: C.white, bold: true,
    lineSpacingMultiple: 1.08, margin: 0,
  });

  s.addText("PFEEF independent study, 8,233 participants. Conservative estimate.", {
    x: 0.8, y: 2.9, w: 9, h: 0.4,
    fontFace: "Calibri", fontSize: 13, color: C.muted, italic: true, margin: 0,
  });

  // Savings categories
  const savings = [
    { title: "Productivity\nrecovery", desc: "Stressed workers lose 3.3 hrs/week.\nCoaching recovers productive time.", color: C.accent },
    { title: "Turnover\nreduction", desc: "Replacing an employee costs\n50-200% of their salary.", color: C.green },
    { title: "Reduced\nabsenteeism", desc: "Participants average 5 fewer\nunscheduled absence days.", color: C.teal },
    { title: "Healthcare\ncost savings", desc: "Costs decreased 4.5% for users\nvs. increased 19.4% for non-users.", color: C.amber },
  ];

  savings.forEach((sv, i) => {
    const x = 0.8 + i * 3.1;
    s.addShape(pres.ShapeType.roundRect, {
      x, y: 3.8, w: 2.85, h: 2.8, rectRadius: 0.12,
      fill: { color: "2a3d52" },
    });
    s.addShape(pres.ShapeType.ellipse, {
      x: x + 0.25, y: 4.15, w: 0.14, h: 0.14,
      fill: { color: sv.color },
    });
    s.addText(sv.title, {
      x: x + 0.25, y: 4.45, w: 2.4, h: 0.7,
      fontFace: "Cambria", fontSize: 16, color: C.white, bold: true,
      lineSpacingMultiple: 1.1, margin: 0,
    });
    s.addText(sv.desc, {
      x: x + 0.25, y: 5.3, w: 2.4, h: 0.9,
      fontFace: "Calibri", fontSize: 12, color: C.muted, lineSpacingMultiple: 1.3, margin: 0,
    });
  });

  s.addText("Sources: PwC 2026, Valoir 2025, Financial Finesse/PFEEF, Fortune 100 case study", {
    x: 0.8, y: 6.9, w: 12, h: 0.3,
    fontFace: "Calibri", fontSize: 10, color: "4a5a6a", margin: 0,
  });

  s.addNotes("The strongest slide for CFO-types. $5.50:1 ROI is the conservative number — optimistic is $15:1. All sourced from independent studies.");
}

// ═══════════════════════════════════════════════════════════════════
// SLIDE 8 — How It Works
// ═══════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { fill: C.white };

  s.addText("HOW IT WORKS", {
    x: 0.8, y: 0.6, w: 6, h: 0.3,
    fontFace: "Calibri", fontSize: 11, color: C.accent, bold: true,
    charSpacing: 3, margin: 0,
  });

  s.addText("Getting started is a conversation,\nnot a procurement cycle.", {
    x: 0.8, y: 1.2, w: 10, h: 1.4,
    ...H2, fontSize: 34, lineSpacingMultiple: 1.1, margin: 0,
  });

  const steps = [
    { n: "01", title: "We scope the\nprogram together", desc: "We talk about your team's size, what you're already offering, and what would actually be useful. No standard package." },
    { n: "02", title: "Your team\nbooks privately", desc: "Employees choose a coach and book on their own time. The cost is covered by you, and nobody has to ask permission." },
    { n: "03", title: "You see the impact,\nnot the details", desc: "Aggregate reporting — participation rates, session counts, topics by category. Never an individual's conversation." },
  ];

  steps.forEach((step, i) => {
    const x = 0.8 + i * 4.1;
    s.addText(step.n, {
      x, y: 3.2, w: 1.2, h: 0.7,
      fontFace: "Cambria", fontSize: 36, color: C.accentLight, bold: true, margin: 0,
    });
    s.addText(step.title, {
      x, y: 3.9, w: 3.7, h: 0.8,
      ...H3, fontSize: 18, lineSpacingMultiple: 1.15, margin: 0,
    });
    s.addText(step.desc, {
      x, y: 4.9, w: 3.7, h: 1.3,
      ...BODY, fontSize: 13, margin: 0,
    });
  });

  s.addNotes("Emphasize simplicity. This isn't a 6-month implementation. It's a conversation, then you're live.");
}

// ═══════════════════════════════════════════════════════════════════
// SLIDE 9 — Pricing
// ═══════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { fill: C.offWhite };

  s.addText("PRICING", {
    x: 0.8, y: 0.6, w: 6, h: 0.3,
    fontFace: "Calibri", fontSize: 11, color: C.accent, bold: true,
    charSpacing: 3, margin: 0,
  });

  s.addText("Two ways to fund the program.", {
    x: 0.8, y: 1.2, w: 10, h: 0.7,
    ...H2, margin: 0,
  });

  s.addText("We're building this with our founding employer partners, so pricing\nis flexible. Let's figure out what makes sense for your team.", {
    x: 0.8, y: 2.0, w: 10, h: 0.7,
    ...BODY, fontSize: 15, margin: 0,
  });

  // Session pool card
  s.addShape(pres.ShapeType.roundRect, {
    x: 0.8, y: 3.2, w: 5.7, h: 3.6, rectRadius: 0.15,
    fill: { color: C.white },
    shadow: { type: "outer", blur: 12, offset: 3, angle: 270, color: "000000", opacity: 0.06 },
  });
  s.addText("Session Pool", {
    x: 1.2, y: 3.5, w: 4.8, h: 0.45,
    ...H3, fontSize: 22, margin: 0,
  });
  s.addText("Fund a block of sessions your team draws from.\nGood way to start and see how people use it.", {
    x: 1.2, y: 4.1, w: 4.8, h: 0.7,
    ...BODY, fontSize: 13, margin: 0,
  });

  const poolItems = ["No per-employee commitment", "Top up anytime", "Includes group sessions", "Aggregate usage reporting"];
  poolItems.forEach((item, i) => {
    addDot(s, 1.3, 5.1 + i * 0.4, 0.08);
    s.addText(item, {
      x: 1.55, y: 5.0 + i * 0.4, w: 4.4, h: 0.35,
      fontFace: "Calibri", fontSize: 13, color: C.muted, margin: 0,
    });
  });

  // Per-seat card
  s.addShape(pres.ShapeType.roundRect, {
    x: 6.8, y: 3.2, w: 5.7, h: 3.6, rectRadius: 0.15,
    fill: { color: C.white },
    shadow: { type: "outer", blur: 15, offset: 4, angle: 270, color: C.accent, opacity: 0.15 },
  });

  // "Full program" badge
  s.addShape(pres.ShapeType.roundRect, {
    x: 10.1, y: 3.45, w: 2.0, h: 0.35, rectRadius: 0.17,
    fill: { color: C.accentLight },
  });
  s.addText("Full program", {
    x: 10.1, y: 3.42, w: 2.0, h: 0.4,
    fontFace: "Calibri", fontSize: 10, color: C.accent, bold: true, align: "center", margin: 0,
  });

  s.addText("Per-Seat", {
    x: 7.2, y: 3.5, w: 4, h: 0.45,
    ...H3, fontSize: 22, margin: 0,
  });
  s.addText("Every employee gets standing access to\nthe full financial wellness program.", {
    x: 7.2, y: 4.1, w: 4.8, h: 0.7,
    ...BODY, fontSize: 13, margin: 0,
  });

  const seatItems = ["Every employee covered", "Free intro call for everyone", "Group sessions & lunch-and-learns", "Onboarding & comms support"];
  seatItems.forEach((item, i) => {
    addDot(s, 7.3, 5.1 + i * 0.4, 0.08);
    s.addText(item, {
      x: 7.55, y: 5.0 + i * 0.4, w: 4.4, h: 0.35,
      fontFace: "Calibri", fontSize: 13, color: C.muted, margin: 0,
    });
  });

  s.addNotes("Founding-partner pricing = flexibility. Emphasize this is negotiable and custom-scoped, not a fixed PEPM number.");
}

// ═══════════════════════════════════════════════════════════════════
// SLIDE 10 — Let's Talk
// ═══════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { fill: C.ink };

  s.addText("Financial wellness\nthat people actually use.", {
    x: 0.8, y: 1.5, w: 9, h: 2.0,
    fontFace: "Cambria", fontSize: 46, color: C.white, bold: true,
    lineSpacingMultiple: 1.08, margin: 0,
  });

  s.addText("Most programs sit on a shelf. This one is a conversation —\nand that's why it works.", {
    x: 0.8, y: 3.6, w: 9, h: 0.8,
    fontFace: "Calibri", fontSize: 18, color: C.muted, lineSpacingMultiple: 1.4, margin: 0,
  });

  // Contact info
  s.addShape(pres.ShapeType.roundRect, {
    x: 0.8, y: 5.0, w: 5, h: 1.7, rectRadius: 0.12,
    fill: { color: "2a3d52" },
  });
  s.addText("Let's talk about your team", {
    x: 1.15, y: 5.15, w: 4.3, h: 0.4,
    fontFace: "Cambria", fontSize: 17, color: C.white, bold: true, margin: 0,
  });
  s.addText("12thandgood.com/employers\ntony@12thandgood.com", {
    x: 1.15, y: 5.65, w: 4.3, h: 0.7,
    fontFace: "Calibri", fontSize: 14, color: C.muted, lineSpacingMultiple: 1.4, margin: 0,
  });

  s.addText("A real person will reply. It's probably Tony.", {
    x: 1.15, y: 6.3, w: 4.3, h: 0.3,
    fontFace: "Calibri", fontSize: 12, color: C.muted, italic: true, margin: 0,
  });

  // Dot logo bottom right
  s.addShape(pres.ShapeType.roundRect, {
    x: 11.85, y: 6.3, w: 0.45, h: 0.45, rectRadius: 0.08,
    fill: { color: C.white },
  });
  s.addShape(pres.ShapeType.ellipse, {
    x: 11.98, y: 6.43, w: 0.18, h: 0.18,
    fill: { color: C.ink },
  });

  s.addNotes("Close with the human touch. This is a conversation, not a contract negotiation.");
}

// ── Generate ──
pres.writeFile({ fileName: "/home/claude/marketplace-poc/TwelfthAndGoodStreet_Employer_Deck.pptx" })
  .then(() => console.log("Deck saved."))
  .catch(err => console.error(err));
