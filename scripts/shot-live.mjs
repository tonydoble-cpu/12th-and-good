import { chromium } from "playwright";

const TARGET = process.argv[2] || "https://12thandgood.com";
const PREFIX = process.argv[3] || "live";

const browser = await chromium.launch({
  executablePath: "/opt/pw-browsers/chromium",
});

// Desktop
const desktop = await browser.newPage({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 2,
});
await desktop.goto(TARGET, { waitUntil: "networkidle", timeout: 45000 });
await desktop.waitForTimeout(1500);
await desktop.evaluate(() =>
  document.querySelectorAll(".reveal").forEach((el) =>
    el.classList.add("revealed", "is-visible", "in-view")
  )
);
await desktop.screenshot({ path: `/tmp/${PREFIX}-desktop-hero.png` });
await desktop.screenshot({ path: `/tmp/${PREFIX}-desktop-full.png`, fullPage: true });

// Mobile
const mobile = await browser.newPage({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 2,
  isMobile: true,
});
await mobile.goto(TARGET, { waitUntil: "networkidle", timeout: 45000 });
await mobile.waitForTimeout(1500);
await mobile.screenshot({ path: `/tmp/${PREFIX}-mobile-hero.png` });

await browser.close();
console.log("done:", PREFIX);
