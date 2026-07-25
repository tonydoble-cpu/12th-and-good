// Verify the Good Street journey + intake booking + The Corner, locally.
import { chromium } from "playwright";
import { mkdirSync } from "fs";

const BASE = process.argv[2] ?? "http://localhost:3111";
const SHOTS = "/tmp/v3-shots";
mkdirSync(SHOTS, { recursive: true });

const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const page = await browser.newPage({ viewport: { width: 430, height: 900 } });
// Headless Chromium reports prefers-reduced-motion: reduce, which (correctly)
// skips the reveal flash — emulate a normal user so we can test the flash.
await page.emulateMedia({ reducedMotion: "no-preference" });
const results = [];
const check = (name, ok) => results.push(`${ok ? "PASS" : "FAIL"} ${name}`);

async function clickAnswer(text) {
  await page.getByRole("button", { name: text }).click();
  await page.waitForTimeout(800);
}

// ---- The walk up Good Street ----
await page.goto(`${BASE}/blueprint`, { waitUntil: "networkidle" });
await page.getByRole("button", { name: /Take the quiz/ }).click();
await page.waitForTimeout(900);

let body = await page.locator("body").innerText();
check("Q1 shows street sign 4th & Good", /4TH & GOOD/i.test(body));
check("Q1 shows blocks-to-go", /8 BLOCKS TO 12TH/i.test(body));
await page.screenshot({ path: `${SHOTS}/01-q1-street.png` });

await clickAnswer("Helping my family while I build my own future");
body = await page.locator("body").innerText();
check("Q2 street sign advanced to 5th", /5TH & GOOD/i.test(body));

await clickAnswer("I'm the one people lean on for money help");
// Third answer: sample DURING the color flash (walk 420ms + flash 900ms)
await page.getByRole("button", { name: "I'm carrying money worries for more than just me" }).click();
await page.waitForTimeout(650);
body = await page.locator("body").innerText();
check("Reveal flash frames 7th & Good", /7th & Good/i.test(body));
await page.waitForTimeout(1400);
body = await page.locator("body").innerText();
check("Reveal mentions blocks left", /Five blocks left/i.test(body));

await page.getByRole("button", { name: /Unlock your full Blueprint/ }).click();
await page.waitForTimeout(700);
body = await page.locator("body").innerText();
check("Email gate speaks the street", /7th & Good/i.test(body));
await page.getByPlaceholder("Email address").fill("e2e-v3@example.com");
await page.getByRole("button", { name: /Get my Blueprint/ }).click();
await page.waitForTimeout(900);

// Q4 income — SCALE UI
body = await page.locator("body").innerText();
check("Q4 street sign at 7th (walking to 8th)", /7TH & GOOD/i.test(body));
check("Q4 scale hint present", /ballpark/i.test(body));
await page.screenshot({ path: `${SHOTS}/02-q4-scale.png` });
await clickAnswer("$100k – $200k");

// Q5 stage — CHIPS
await page.screenshot({ path: `${SHOTS}/03-q5-chips.png` });
await clickAnswer("Juggling work and family");
// Q6 goal — CHIPS
await clickAnswer("Get a clear plan for my money");
// Q7 multi
await page.getByRole("button", { name: "They really know their stuff" }).click();
await page.getByRole("button", { name: /Next block/ }).click();
await page.waitForTimeout(800);
// Q8 multi — last block
body = await page.locator("body").innerText();
check("Q8 street sign at 11th", /11TH & GOOD/i.test(body));
await page.getByRole("button", { name: "They have nothing to sell me" }).click();
await page.getByRole("button", { name: /Next block/ }).click();
await page.waitForTimeout(1800);

// ---- Blueprint result: welcome, book, Corner, toolkit ----
const html = await page.content();
check("Result welcomes to 12th & Good", html.includes("Welcome to 12th &amp; Good") || html.includes("Welcome to 12th & Good"));
check("Primary CTA books a session", html.includes("Book your session"));
check("Guarantee present on result", html.includes("worth every dollar"));
check("The Corner join present", html.includes("Join the Corner"));
check("Toolkit present", html.includes("Free tools for"));
check("Toolkit links to real tools", html.includes("/resources/budget-builder"));
check("No free-intro references", !html.includes("free intro call") && !html.includes("free 20-minute"));
await page.screenshot({ path: `${SHOTS}/04-result.png`, fullPage: true });

// ---- Corner join works ----
await page.getByRole("button", { name: "Count me in" }).click();
await page.waitForTimeout(800);
check("Corner join confirms", (await page.locator("body").innerText()).includes("Welcome to the corner"));

// ---- Booking card: intake + guarantee (local = demo mode w/ mock data) ----
await page.setViewportSize({ width: 1280, height: 950 });
await page.goto(`${BASE}/tony`, { waitUntil: "networkidle" });
const tonyHtml = await page.content();
check("Intake textarea present", tonyHtml.includes("What do you want to work on?"));
check("Win question present", tonyHtml.includes("make this session a win"));
check("Guarantee on booking card", tonyHtml.includes("12th &amp; Good promise") || tonyHtml.includes("12th & Good promise"));
check("No placeholder pricing", !tonyHtml.includes("placeholder while we finalize"));
await page.screenshot({ path: `${SHOTS}/05-booking.png` });

// Intake required: pick nothing, try booking without write-up
const bookBtn = page.getByRole("button", { name: /Reserve my session|Continue to secure payment|Book this session/ });
await bookBtn.click();
await page.waitForTimeout(400);
check(
  "Booking blocks without write-up",
  (await page.locator("body").innerText()).includes("Tell Tony what you want to work on")
);

console.log(results.join("\n"));
const fails = results.filter((r) => r.startsWith("FAIL"));
console.log(`\n${results.length - fails.length}/${results.length} passed`);
await browser.close();
process.exit(fails.length ? 1 : 0);
