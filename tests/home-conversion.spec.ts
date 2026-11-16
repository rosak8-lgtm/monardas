import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { validFunnelEvent } from "../src/lib/funnel";

test("homepage explicitly sells a real, limited HVAC service", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/HVAC Estimate Follow-Up/i);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("The estimate went out.");
  await expect(page.getByRole("link", { name: "Apply for 30 days free" }).first()).toHaveAttribute("href", "/hvac/free-pilot");
  await expect(page.getByRole("link", { name: "Explore the interactive demo" })).toHaveAttribute("href", "/hvac/demo");
  await expect(page.locator(".corporate-hero")).toContainText("Up to 25 eligible estimates");
  await expect(page.locator(".corporate-hero")).toContainText("No card or auto-renewal");
  await expect(page.getByRole("group", { name: "Fictional example of MONARDAS estimate follow-up tracking" })).toContainText("Fictional records");
  await expect(page.locator("main")).toContainText("No invented success stories");
  await expect(page.locator("main")).toContainText("No guaranteed sales");
});

test("homepage buttons navigate to real qualified pilot, demo, scorecard and partner form", async ({ page, request }) => {
  await page.goto("/");
  const header = page.locator("header");
  await expect(header.locator(".header-cta")).toHaveAttribute("href", "/hvac/free-pilot");
  for (const url of ["/hvac", "/hvac/free-pilot", "/hvac/demo", "/hvac/scorecard", "/contact?intent=agency-partner", "/strategy", "/ai"]) {
    expect((await request.get(url)).status(), url).toBe(200);
  }
  await page.locator(".corporate-hero").getByRole("link", { name: "Apply for 30 days free" }).click();
  await expect(page).toHaveURL(/\/hvac\/free-pilot$/);
  await page.getByRole("link", { name: /Apply for the Free 30-Day Pilot/ }).click();
  await expect(page).toHaveURL(/\/contact\?intent=hvac-free-pilot/);
  await expect(page.locator('input[name="intent"]')).toHaveValue("hvac-free-pilot");
  await page.goto("/");
  await page.getByRole("link", { name: "Discuss a partnership" }).click();
  await expect(page).toHaveURL(/intent=agency-partner/);
  await expect(page.locator('input[name="intent"]')).toHaveValue("agency-partner");
});

test("homepage responsive width, keyboard navigation and WCAG smoke", async ({ page }) => {
  test.setTimeout(90000);
  for (const width of [375, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: width < 600 ? 844 : 900 });
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), `overflow at ${width}`).toBe(true);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    if (width === 390 || width === 1440) {
      const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
      expect(results.violations, `axe at ${width}`).toEqual([]);
    }
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const menu = page.getByRole("button", { name: "Open navigation" });
  await menu.click();
  await expect(page.getByRole("navigation", { name: "Mobile navigation" })).toBeVisible();
  await page.getByRole("navigation", { name: "Mobile navigation" }).getByRole("link", { name: "Interactive demo" }).click();
  await expect(page).toHaveURL(/\/hvac\/demo$/);
});

test("homepage conversion events stay first-party and do not carry personal data", async () => {
  for (const event of ["home_page_view", "home_free_pilot_cta_click", "home_demo_cta_click", "home_scorecard_cta_click"]) {
    expect(validFunnelEvent(event, "/")).toBe(true);
    expect(validFunnelEvent(event, "/contact")).toBe(false);
    expect(validFunnelEvent(event, "/hvac")).toBe(false);
  }
});
