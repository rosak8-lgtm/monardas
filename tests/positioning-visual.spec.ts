import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const routes = [
  "/",
  "/ai",
  "/hvac",
  "/current-focus",
  "/contact",
  "/contact?intent=hvac-pilot",
  "/privacy",
  "/terms",
  "/refund-policy",
];

test("commercial and legal pages: responsive layout, mobile axe and visual evidence", async ({
  page,
}) => {
  test.setTimeout(180000);
  // Safety: visual QA must never deliver a contact request.
  await page.route("**/api/contact", (route) => route.abort());
  for (const width of [1440, 1280, 768, 390]) {
    await page.setViewportSize({ width, height: width === 390 ? 844 : 900 });
    for (const route of routes) {
      expect((await page.goto(route))?.status()).toBe(200);
      await page.evaluate(() => document.fonts.ready);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        `${route} at ${width}`,
      ).toBe(true);
      if (width === 390) {
        const result = await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
          .analyze();
        expect(result.violations, `${route} mobile axe`).toEqual([]);
      }
      if (width === 390 || width === 1440) {
        const name =
          route === "/"
            ? "home"
            : route.includes("?")
              ? "pilot-form"
              : route.slice(1);
        await page.screenshot({
          path: `test-results/v1-1/${name}-${width}.png`,
          fullPage: true,
        });
        await page.screenshot({
          path: `test-results/v1-1/${name}-${width}-hero.png`,
        });
      }
    }
  }
});
