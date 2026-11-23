import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("legal pages, footer links and confirmed operator details on desktop/mobile", async ({
  page,
}) => {
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of ["privacy", "terms"]) {
      await page.goto("/contact?intent=hvac-pilot");
      await page.locator(`footer a[href="/${route}"]`).click();
      await expect(page).toHaveURL(new RegExp(`/${route}$`));
      const legal = page.locator("main");
      await expect(legal).toContainText(
        "Individual Entrepreneur Iurii Shalygin",
      );
      await expect(legal).toContainText(
        "Georgia",
      );
      await expect(legal).toContainText("yurii@monardas.com");
      await expect(legal).not.toContainText(
        /NEEDS CONFIRMATION|Publication pending|placeholder|TODO|@gmail\.com/i,
      );
      if (route === "privacy")
        await expect(legal).toContainText(
          "Inquiry communications are retained for the time reasonably needed",
        );
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      expect(
        (
          await new AxeBuilder({ page })
            .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
            .analyze()
        ).violations,
      ).toEqual([]);
      await page.screenshot({
        path: `qa-reports/legal/${route}-${width}.png`,
        fullPage: true,
      });
      await page.getByRole("navigation", { name: "Commercial and legal information" })
        .getByRole("link", { name: route === "privacy" ? "Terms" : "Privacy", exact: true }).click();
      await expect(page).toHaveURL(
        new RegExp(`/${route === "privacy" ? "terms" : "privacy"}$`),
      );
    }
  }
});

test("free founding program terms, privacy and cancellation policy agree", async ({ page }) => {
  await page.goto("/terms");
  const terms = page.locator("main");
  await expect(terms).toContainText("30-day free pilot");
  await expect(terms).toContainText("limited, manually supported");
  await expect(terms).toContainText("up to 25 agreed eligible estimates");
  await expect(terms).toContainText("message drafts subject to contractor approval");
  await expect(terms).toContainText("There are no payment details to submit");
  await expect(terms).toContainText("no automatic conversion to a paid plan");
  await expect(terms).toContainText("further written authorization");
  await expect(terms).not.toContainText("Any pilot is paid and custom");

  await page.goto("/refund-policy");
  const refunds = page.locator("main");
  await expect(refunds).toContainText("does not convert into a paid plan");
  await expect(refunds).toContainText("No paid software subscription is currently on sale");
  await expect(refunds).toContainText("no pilot payment to refund");

  await page.goto("/privacy");
  const privacy = page.locator("main");
  await expect(privacy).toContainText("Submitting a form does not subscribe you to marketing emails");
  await expect(privacy).toContainText("Please do not send homeowner names");

  await page.goto("/hvac/free-pilot");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("30 days free");
  await expect(page.locator("main")).toContainText("25");

  await page.goto("/contact?intent=hvac-free-pilot");
  const form = page.locator("form.contact-form");
  await expect(form.getByRole("link", { name: "Privacy Policy" })).toHaveAttribute("href", "/privacy");
  await expect(form.getByRole("link", { name: "Website & Pilot Terms" })).toHaveAttribute("href", "/terms");
  await expect(form.getByRole("link", { name: "Free Pilot FAQ" })).toHaveAttribute("href", "/hvac/free-pilot#pilot-faq");
});
