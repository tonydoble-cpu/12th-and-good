// Verify every overnight change on the local build: quiz → blueprint with
// new CTA, profile with credentials + honest empty state, new pages,
// employer pilot + haircut ROI.
import { chromium } from "playwright";
import { mkdirSync } from "fs";

const BASE = process.argv[2] ?? "http://localhost:3111";
const SHOTS = "/tmp/overnight-shots";
mkdirSync(SHOTS, { recursive: true });

const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const page = await browser.newPage({ viewport: { width: 430, height: 900 } });
const results = [];
const check = (name, ok) => results.push(`${ok ? "PASS" : "FAIL"} ${name}`);

async function clickAnswer(text) {
  await page.getByRole("button", { name: text }).click();
  await page.waitForTimeout(650);
}

// ---- Quiz through to Blueprint ----
await page.goto(`${BASE}/blueprint`, { waitUntil: "networkidle" });
check("intro shows 2-minute honesty copy", (await page.content()).includes("about 2 minutes"));
await page.getByRole("button", { name: /Take the quiz/ }).click();
await page.waitForTimeout(800);

await clickAnswer("Helping my family while I build my own future");
await clickAnswer("I'm the one people lean on for money help");
await clickAnswer("I'm carrying money worries for more than just me");
await page.waitForTimeout(1800);
await page.getByRole("button", { name: /Unlock your full Blueprint/ }).click();
await page.waitForTimeout(700);
await page.getByPlaceholder("Email address").fill("e2e-overnight@example.com");
await page.getByRole("button", { name: /Get my Blueprint/ }).click();
await page.waitForTimeout(900);

await clickAnswer("$100k – $200k");
// New life-stage option present?
check(
  "life stage has 'Between jobs or starting over'",
  await page.getByRole("button", { name: "Between jobs or starting over" }).isVisible()
);
await clickAnswer("Juggling work and family");
// New retirement goal present?
check(
  "goal list has retirement option",
  await page.getByRole("button", { name: /through — retirement/ }).isVisible()
);
await clickAnswer("Get a clear plan for my money");
await page.getByRole("button", { name: "They really know their stuff" }).click();
await page.getByRole("button", { name: /Next/ }).click();
await page.waitForTimeout(650);
await page.getByRole("button", { name: "They have nothing to sell me" }).click();
await page.getByRole("button", { name: /Next/ }).click();
await page.waitForTimeout(1600);

const bpHtml = await page.content();
check("blueprint primary CTA = free intro call", bpHtml.includes("Book your free intro call"));
check("blueprint CTA links to /tony#book", bpHtml.includes('href="/tony#book"'));
check("waitlist demoted to secondary", bpHtml.includes("Rather wait for a different coach"));
check("no false email promise (screenshot copy)", bpHtml.includes("screenshot your three moves"));
check("email promise absent when unconfigured", !bpHtml.includes("on its way to"));
await page.screenshot({ path: `${SHOTS}/01-blueprint-cta.png`, fullPage: true });

// ---- Profile page ----
await page.setViewportSize({ width: 1280, height: 900 });
await page.goto(`${BASE}/tony`, { waitUntil: "networkidle" });
const tonyHtml = await page.content();
check("credentials section renders", tonyHtml.includes("Background & how I get paid") || tonyHtml.includes("Background &amp; how I get paid"));
check("fee model sentence present", tonyHtml.includes("100% of how I"));
check("placeholder-pricing line REMOVED", !tonyHtml.includes("placeholder while we finalize"));
check("self-issued vetted badge replaced", !tonyHtml.includes("Vetted &amp; conflict-free") && !tonyHtml.includes("Vetted & conflict-free"));
// Local has demo availability (mock data) — free intro should be default
check("free intro is default selection", (await page.locator("aside").innerText()).includes("Total today"));
const asideText = await page.locator("aside").innerText();
check("default total is Free (not $150)", /Total today\s*Free/.test(asideText.replace(/\n/g, " ")));
await page.screenshot({ path: `${SHOTS}/02-profile.png`, fullPage: true });

// Guest fields appear for free intro? (auth not configured locally so
// signedOut=false → fields hidden locally; just record aside text)
await page.screenshot({ path: `${SHOTS}/03-booking-card.png` });

// ---- New pages ----
for (const [path, marker] of [
  ["/about", "Why this corner exists"],
  ["/how-we-make-money", "If I say no to everything"],
  ["/privacy", "plain English"],
  ["/become-a-coach", "Coach people, not products"],
]) {
  await page.goto(`${BASE}${path}`, { waitUntil: "networkidle" });
  check(`${path} renders marker copy`, (await page.content()).includes(marker));
}
await page.goto(`${BASE}/about`, { waitUntil: "networkidle" });
await page.screenshot({ path: `${SHOTS}/04-about.png` });

// ---- Employers ----
await page.goto(`${BASE}/employers`, { waitUntil: "networkidle" });
const empHtml = await page.content();
check("founding pilot box present", empHtml.includes("Founding Employer Pilot"));
check("'flexible and negotiable' removed", !empHtml.includes("flexible and negotiable"));
await page.goto(`${BASE}/employers/roi-calculator`, { waitUntil: "networkidle" });
await page.waitForTimeout(600);
const roiText = await page.locator("body").innerText();
const roiMatch = roiText.match(/([\d.]+):1 ROI/);
check(`ROI now conservative (got ${roiMatch?.[1] ?? "none"}:1, want < 8)`, roiMatch ? parseFloat(roiMatch[1]) < 8 : false);
check("haircut disclosure shown", roiText.includes("25% of research-modeled"));
await page.screenshot({ path: `${SHOTS}/05-roi.png`, fullPage: true });

// ---- Footer links ----
await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
const footerHtml = await page.content();
check("footer has no dead # links", !/href="#"/.test(footerHtml.split("<footer")[1] ?? ""));

console.log(results.join("\n"));
const fails = results.filter((r) => r.startsWith("FAIL"));
console.log(`\n${results.length - fails.length}/${results.length} passed`);
await browser.close();
process.exit(fails.length ? 1 : 0);
