import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("legal pages, footer links and confirmed operator details on desktop/mobile", async ({ page }) => {
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of ["privacy", "terms"]) {
      await page.goto("/contact?intent=hvac-pilot");
      await page.locator(`footer a[href="/${route}"]`).click();
      await expect(page).toHaveURL(new RegExp(`/${route}$`));
      const legal = page.locator(".legal");
      await expect(legal).toContainText("Yurii Shalygin, Individual Entrepreneur registered in Georgia");
      await expect(legal).toContainText("Business/legal address: Georgia, Kutaisi, Paliashvilli str., 35-34.");
      await expect(legal).not.toContainText(/NEEDS CONFIRMATION|Publication pending|placeholder|TODO|@gmail\.com/i);
      if (route === "privacy") await expect(legal).toContainText("We retain inquiry data only for as long as reasonably necessary");
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      expect((await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze()).violations).toEqual([]);
      await page.screenshot({ path: `qa-reports/legal/${route}-${width}.png`, fullPage: true });
      await legal.getByRole("link").click();
      await expect(page).toHaveURL(new RegExp(`/${route === "privacy" ? "terms" : "privacy"}$`));
    }
  }
});
