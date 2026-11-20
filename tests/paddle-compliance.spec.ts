import { test, expect } from "@playwright/test";

// Domain-review acceptance: links must work before any Paddle verification.
const paths = ["/pricing", "/terms", "/privacy", "/refund-policy"] as const;
test("Paddle policy and pricing routes are public and linked", async ({ page, request }) => {
  for (const path of paths) {
    const response = await request.get(path);
    expect(response.status(), path).toBe(200);
    await page.goto(path);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /.+/);
    for (const link of paths) {
      await expect(page.locator('footer a[href="' + link + '"]')).toHaveCount(1);
    }
  }
});
test("Public claims stay in pre-launch state", async ({ page }) => {
  await page.goto("/pricing");
  await expect(page.getByRole("heading", { name: "Founding HVAC pilot" })).toBeVisible();
  await expect(page.getByText("30 calendar days", { exact: false })).toBeVisible();
  await expect(page.getByText("Not on sale", { exact: true })).toBeVisible();
  await expect(page.locator('a[href*="checkout"]')).toHaveCount(0);
  await page.goto("/terms");
  await expect(page.getByText("Individual Entrepreneur Iurii Shalygin", { exact: false })).toBeVisible();
  await expect(page.getByText("312796356", { exact: false })).toBeVisible();
  await page.goto("/refund-policy");
  await expect(page.getByText("No paid SaaS subscription", { exact: false })).toBeVisible();
});
