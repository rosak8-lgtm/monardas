import fs from "node:fs";
import { chromium } from "@playwright/test";
fs.mkdirSync("qa-reports", { recursive: true });
const browser = await chromium.launch({ channel: "msedge", headless: true });
try {
  const page = await browser.newPage();
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    for (const route of ["/", "/ai", "/nature", "/strategy", "/contact"]) {
      await page.goto(`http://127.0.0.1:3000${route}`);
      await page.evaluate(() => document.fonts.ready);
      await page.screenshot({
        path: `qa-reports/${route.slice(1) || "home"}-${width}.png`,
      });
    }
  }
} finally {
  await browser.close();
}
