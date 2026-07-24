import { chromium } from "playwright";

(async () => {
  const browser = await chromium.launch({
    executablePath: "/opt/pw-browsers/chromium",
  });
  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
  });
  await page.goto("http://localhost:3111/", { waitUntil: "networkidle" });
  // let fonts + reveal animations settle
  await page.waitForTimeout(1200);
  await page.evaluate(() =>
    document
      .querySelectorAll(".reveal")
      .forEach((el) => el.classList.add("revealed", "is-visible", "in-view"))
  );
  await page.screenshot({ path: "/tmp/home-hero.png" });

  // footer (dark surface, tone=dark mark)
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(900);
  await page.screenshot({ path: "/tmp/home-footer.png" });

  // mark specimen page: glyph at large / lockup / small sizes on both surfaces
  await page.setContent(`
    <html><head><style>
      @font-face { font-family: N; src: local("Georgia"); }
      body { margin:0; font-family: Georgia, serif; }
      .row { display:flex; align-items:center; gap:56px; padding:44px 56px; }
      .light { background:#f5f4f1; color:#191a1c; }
      .dark { background:#15171b; color:#f5f4f1; }
      .lockup { display:flex; align-items:center; gap:12px; font-size:26px; font-weight:500; letter-spacing:-0.01em; }
      .lockup em { font-style: italic; font-weight: 400; }
      .cap { font-family: ui-monospace, monospace; font-size:11px; letter-spacing:.08em; opacity:.55; margin-top:10px; text-transform:uppercase }
    </style></head><body>
      <div class="row light">
        <div><svg width="112" height="112" viewBox="0 0 32 32" fill="none"><path d="M9.5 28.5 16 15.5V4" stroke="#3a5a7d" stroke-width="4.4" stroke-linecap="round" stroke-linejoin="round"/><path d="M25 27 16 15.5" stroke="#9c5b3c" stroke-width="4.4" stroke-linecap="round" stroke-linejoin="round"/></svg><div class="cap">mark</div></div>
        <div><div class="lockup"><svg width="30" height="30" viewBox="0 0 32 32" fill="none"><path d="M9.5 28.5 16 15.5V4" stroke="#3a5a7d" stroke-width="4.4" stroke-linecap="round" stroke-linejoin="round"/><path d="M25 27 16 15.5" stroke="#9c5b3c" stroke-width="4.4" stroke-linecap="round" stroke-linejoin="round"/></svg>12th <em>&amp;</em> Good</div><div class="cap">lockup</div></div>
        <div><img width="16" height="16" src="http://localhost:3111/icon.svg"/><div class="cap">16px favicon</div></div>
        <div><img width="48" height="48" src="http://localhost:3111/icon.svg"/><div class="cap">48px app icon</div></div>
      </div>
      <div class="row dark">
        <div><svg width="112" height="112" viewBox="0 0 32 32" fill="none"><path d="M9.5 28.5 16 15.5V4" stroke="#f5f4f1" stroke-width="4.4" stroke-linecap="round" stroke-linejoin="round"/><path d="M25 27 16 15.5" stroke="#c98a63" stroke-width="4.4" stroke-linecap="round" stroke-linejoin="round"/></svg><div class="cap">on dark</div></div>
        <div><div class="lockup"><svg width="30" height="30" viewBox="0 0 32 32" fill="none"><path d="M9.5 28.5 16 15.5V4" stroke="#f5f4f1" stroke-width="4.4" stroke-linecap="round" stroke-linejoin="round"/><path d="M25 27 16 15.5" stroke="#c98a63" stroke-width="4.4" stroke-linecap="round" stroke-linejoin="round"/></svg>12th <em>&amp;</em> Good</div><div class="cap">footer lockup</div></div>
      </div>
    </body></html>`);
  await page.waitForTimeout(500);
  await page.screenshot({ path: "/tmp/mark-specimen.png", fullPage: true });

  await browser.close();
  console.log("done");
})();
