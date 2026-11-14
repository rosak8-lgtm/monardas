import { test, expect } from "@playwright/test";
import { sanitizeAttribution } from "../src/lib/attribution";
import { validFunnelEvent } from "../src/lib/funnel";
import { validate, type ContactData } from "../src/lib/contact";
import { createResendPayload } from "../src/lib/contact-delivery";

const partner: ContactData = {
  intent: "agency-partner",
  firstName: "Example", lastName: "", company: "Example HVAC Agency",
  email: "example@example.com", companyWebsite: "example.com",
  phone: "", industry: "HVAC", volume: "", crm: "",
  message: "We serve HVAC installers.", website: "", preferredChannel: "email",
};

test("partner intent is distinct, validates and produces distinct notification", () => {
  expect(validate(partner)).toEqual({});
  expect(validate({ ...partner, companyWebsite: "javascript:alert(1)" }).companyWebsite).toBeTruthy();
  expect(validate({ ...partner, companyWebsite: "https://user:pass@example.com" }).companyWebsite).toBeTruthy();
  const payload = createResendPayload(partner, { to: "inbound@monardas.com", from: "website@send.monardas.com" });
  expect(payload.subject).toContain("Agency Partnership Inquiry");
  expect(payload.text).toContain("Company website: example.com");
  expect(payload.text).toContain("referral or co-service partnership");
  expect(payload.reply_to).toBe(partner.email);
});

test("scorecard first-touch attribution and funnel event paths are narrow", () => {
  expect(sanitizeAttribution({ landing_page: "/hvac/scorecard", utm_source: "agency" })).toEqual({
    landing_page: "/hvac/scorecard", utm_source: "agency",
  });
  expect(validFunnelEvent("scorecard_page_view", "/hvac/scorecard")).toBe(true);
  expect(validFunnelEvent("scorecard_share_click", "/hvac/scorecard")).toBe(true);
  expect(validFunnelEvent("scorecard_partner_cta_click", "/hvac/scorecard")).toBe(true);
  expect(validFunnelEvent("scorecard_page_view", "/hvac")).toBe(false);
  expect(validFunnelEvent("scorecard_share_click", "/contact")).toBe(false);
});

test("self-check clearly separates unknown, yes and no; no homeowner data required", async ({ page }) => {
  await page.goto("/hvac/scorecard");
  await expect(page.getByRole("heading", { name: "Complete the checks to see priorities" })).toBeVisible();
  await expect(page.getByText("0 of 5 checks answered")).toBeVisible();
  await expect(page.locator('input[type="number"]')).toHaveValue("25");
  await page.locator("fieldset").nth(0).getByRole("radio", { name: "Yes" }).check();
  await page.locator("fieldset").nth(1).getByRole("radio", { name: "No" }).check();
  await expect(page.getByText("2 of 5 checks answered")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Follow-up gaps to address" })).toBeVisible();
  await expect(page.getByText("Improve: Assign one person responsible for the next step.")).toBeVisible();
  await page.locator('input[type="number"]').fill("-1");
  await expect(page.locator('input[type="number"]')).toHaveAttribute("aria-invalid", "true");
  await expect(page.getByText("Unsold estimates reviewed").locator("..").locator("strong")).toHaveText("—");
  await expect(page.getByText("No upload")).toBeVisible();
});

test("agency CTA opens agency-specific form; submission is mocked and sent once", async ({ page }) => {
  await page.goto("/hvac/scorecard");
  await page.getByRole("link", { name: /Discuss a partner introduction/ }).click();
  await expect(page).toHaveURL(/intent=agency-partner/);
  await expect(page.getByRole("heading", { name: "Partner With MONARDAS" })).toBeVisible();
  await expect(page.locator('input[name="intent"]')).toHaveValue("agency-partner");
  await expect(page.getByRole("heading", { name: "Discuss an HVAC Agency Partnership" })).toBeVisible();
  await page.locator("#firstName").fill("Example");
  await page.locator("#company").fill("Example HVAC Agency");
  await page.locator("#email").fill("example@example.com");
  let submissions = 0;
  await page.route("**/api/contact", async (route) => {
    submissions++;
    expect(route.request().postDataJSON()).toMatchObject({
      intent: "agency-partner", firstName: "Example", company: "Example HVAC Agency",
    });
    await route.fulfill({ status: 201, json: { message: "Received", id: "test-only" } });
  });
  await page.locator(".form-submit").click();
  await expect(page.locator(".form-submit")).toBeDisabled();
  expect(submissions).toBe(1);
});

test("scorecard is keyboard and mobile accessible at basic navigation level", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/hvac/scorecard");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.locator("fieldset")).toHaveCount(5);
  await expect(page.getByRole("button", { name: "Share tool" })).toBeVisible();
  await expect(page.getByRole("link", { name: /Discuss a Free Backlog Assessment/ })).toBeVisible();
  await expect(page.locator("body")).toHaveJSProperty("scrollWidth", await page.locator("body").evaluate(el => el.clientWidth));
});
