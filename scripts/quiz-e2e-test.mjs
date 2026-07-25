// Full quiz click-through against a local server, exercising the new
// multi-select questions. Screenshots the multi-select screen in its
// three states (empty, partial, before-Next) for visual review.
import { chromium } from "playwright";

const BASE = process.argv[2] ?? "http://localhost:3111";
const SHOTS = "/tmp/quiz-shots";
import { mkdirSync } from "fs";
mkdirSync(SHOTS, { recursive: true });

const browser = await chromium.launch({
  executablePath: "/opt/pw-browsers/chromium",
});
const page = await browser.newPage({ viewport: { width: 430, height: 900 } });

const logs = [];
page.on("console", (m) => logs.push(`[console:${m.type()}] ${m.text()}`));
const apiCalls = [];
page.on("response", (r) => {
  if (r.url().includes("/api/blueprint"))
    apiCalls.push(`${r.request().method()} ${r.status()}`);
});

async function clickAnswer(text) {
  await page.getByRole("button", { name: text }).click();
  await page.waitForTimeout(700);
}

await page.goto(`${BASE}/blueprint`, { waitUntil: "networkidle" });
await page.screenshot({ path: `${SHOTS}/01-intro.png` });

// Intro → pre-gate
await page.getByRole("button", { name: /Take the quiz/ }).click();
await page.waitForTimeout(800);
await page.screenshot({ path: `${SHOTS}/02-q1.png` });

await clickAnswer("Helping my family while I build my own future");
await clickAnswer("I'm the one people lean on for money help");
await page.screenshot({ path: `${SHOTS}/03-q3.png` });
await clickAnswer("I'm carrying money worries for more than just me");

// Reveal (color flash 1.4s + settle)
await page.waitForTimeout(2200);
await page.screenshot({ path: `${SHOTS}/04-reveal.png` });
await page.getByRole("button", { name: /Unlock your full Blueprint/ }).click();
await page.waitForTimeout(700);

// Email gate
await page.getByPlaceholder("First name (optional)").fill("Local Test");
await page.getByPlaceholder("Email address").fill("local-quiz-test@example.com");
await page.screenshot({ path: `${SHOTS}/05-email.png` });
await page.getByRole("button", { name: /Get my Blueprint/ }).click();
await page.waitForTimeout(1000);

// Post-gate singles: income, stage, goal
await clickAnswer("$100k – $200k");
await clickAnswer("Juggling work and family");
await page.screenshot({ path: `${SHOTS}/06-goal.png` });
await clickAnswer("Get a clear plan for my money");

// Q7 — MULTI. Verify toggle + Next.
await page.waitForTimeout(400);
await page.screenshot({ path: `${SHOTS}/07-multi-empty.png` });
const nextBtn = page.getByRole("button", { name: /Next/ });
const disabledAtStart = await nextBtn.isDisabled();

await page.getByRole("button", { name: "They really know their stuff" }).click();
await page.waitForTimeout(250);
await page.getByRole("button", { name: "They've been where I am" }).click();
await page.waitForTimeout(250);
await page
  .getByRole("button", { name: "They share my culture or background" })
  .click();
await page.waitForTimeout(250);
// Toggle one back OFF to prove deselect works
await page
  .getByRole("button", { name: "They share my culture or background" })
  .click();
await page.waitForTimeout(250);
await page.screenshot({ path: `${SHOTS}/08-multi-2picked.png` });
const counterText = await page
  .locator("text=/picked/")
  .textContent()
  .catch(() => "counter-not-found");
await nextBtn.click();
await page.waitForTimeout(700);

// Q8 — MULTI (trust)
await page.getByRole("button", { name: "They have nothing to sell me" }).click();
await page
  .getByRole("button", { name: "They're upfront about how they get paid" })
  .click();
await page.waitForTimeout(250);
await page.screenshot({ path: `${SHOTS}/09-multi-trust.png` });
await page.getByRole("button", { name: /Next/ }).click();

// Blueprint result (gate2 fires here)
await page.waitForTimeout(2000);
await page.screenshot({ path: `${SHOTS}/10-blueprint.png`, fullPage: true });

console.log("=== RESULTS ===");
console.log("Next disabled with 0 picked:", disabledAtStart);
console.log("Counter after toggles:", counterText?.trim());
console.log("API calls:", apiCalls);
console.log(
  "Console errors:",
  logs.filter((l) => l.includes("error") || l.includes("warn"))
);
await browser.close();
