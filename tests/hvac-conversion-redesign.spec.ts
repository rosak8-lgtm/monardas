import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const choices = [
  ["Apply for a free pilot", "/hvac/free-pilot"],
  ["Check your process", "/hvac/scorecard"],
  ["Explore the demo", "/hvac/demo"],
  ["View the workflow", "/hvac#system"],
  ["Explore partnerships", "/contact?intent=agency-partner"],
  ["Read pilot FAQs", "/hvac/free-pilot#pilot-faq"],
] as const;

test("conversion hub has six distinct real destinations", async ({ page }) => {
  await page.goto("/hvac");
  const hub = page.locator('[aria-label="Explore MONARDAS HVAC"]');
  await expect(hub.locator("article")).toHaveCount(6);
  for (const [label, href] of choices) {
    await expect(hub.getByRole("link", { name: label, exact: true })).toHaveAttribute("href", href);
  }
  await expect(page.getByRole("link", { name: "Apply — 30 days free" })).toHaveAttribute("href", "/hvac/free-pilot");
  await expect(page.getByRole("link", { name: "Take the 3-minute check" })).toHaveAttribute("href", "/hvac/scorecard");
  await expect(page.locator("img[alt*='Illustration of a residential heat pump']")).toBeVisible();
});

test("pilot, checklist and agency routes are live and distinct", async ({page}) => {
  await page.goto("/hvac");
  await page.getByRole("link", { name: "Apply — 30 days free" }).click();
  await expect(page).toHaveURL(/\/hvac\/free-pilot$/);
  await expect(page.getByRole("heading", { level:1 })).toContainText("30 days free.");
  await page.goto("/hvac");
  await page.locator('[aria-label="Explore MONARDAS HVAC"]').getByRole("link", { name:"Explore partnerships" }).click();
  await expect(page).toHaveURL(/intent=agency-partner$/);
  await expect(page.locator('input[name="intent"]')).toHaveValue("agency-partner");
  await page.goto("/hvac");
  await page.getByRole("link", { name: "Check your process" }).click();
  await expect(page).toHaveURL(/\/hvac\/scorecard$/);
  await expect(page.getByLabel("How many unsold replacement estimates are you reviewing?")).toBeVisible();
  await page.goto("/hvac/free-pilot#pilot-faq");
  await expect(page.locator("#pilot-faq")).toBeInViewport();
});

test("mobile and desktop conversion page have no overflow and basic accessibility", async ({page}) => {
  for (const width of [390,768,1440]) {
    await page.setViewportSize({width,height:width===390?844:900});
    await page.goto("/hvac");
    await page.evaluate(() => document.fonts.ready);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    const results = await new AxeBuilder({page}).withTags(["wcag2a","wcag2aa","wcag21aa"]).analyze();
    expect(results.violations).toEqual([]);
    await expect(page.locator('[aria-label="Explore MONARDAS HVAC"]').locator("article")).toHaveCount(6);
  }
});

test("trust boundaries: free and paid options stay distinct", async ({page}) => {
  await page.goto("/hvac");
  await expect(page.locator(".product-hero")).toContainText("Free initial review. No commitment to a paid pilot.");
  await expect(page.locator(".product-hero")).toContainText("Separate paid offering — not included in the free founding pilot");
  await expect(page.locator(".product-hero")).toContainText("No homeowner outreach by MONARDAS without separate written authorization");
  await expect(page.locator(".product-hero")).toContainText("Concept illustration");
});
