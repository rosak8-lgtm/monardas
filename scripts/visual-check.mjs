import fs from "node:fs";
import { chromium } from "@playwright/test";
fs.mkdirSync("qa-reports", { recursive: true });
const browser = await chromium.launch({ channel: "msedge", headless: true });
try {
  const page = await browser.newPage();
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const width of [375, 390, 430, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    for (const route of [
      "/",
      "/ai",
      "/hvac",
      "/roofing",
      "/current-focus",
      "/contact",
    ]) {
      await page.goto(
        `${process.env.QA_BASE_URL || "http://127.0.0.1:3000"}${route}`,
      );
      await page.evaluate(() => document.fonts.ready);
      await page.screenshot({
        path: `qa-reports/${route.slice(1) || "home"}-${width}.png`,
      });
      if (route === "/hvac" && [390, 1440].includes(width)) {
        await page.screenshot({
          path: `qa-reports/hvac-full-${width}.png`,
          fullPage: true,
        });
      }
    }
  }
} finally {
  await browser.close();
}
