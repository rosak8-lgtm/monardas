import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { validate, type ContactData } from "../src/lib/contact";
import { createResendPayload } from "../src/lib/contact-delivery";

const pilot: ContactData = {
  intent: "hvac-pilot",
  firstName: "Test",
  company: "Test HVAC",
  companyWebsite: "example.com",
  email: "test@example.com",
  lastName: "",
  phone: "",
  industry: "HVAC",
  volume: "",
  crm: "",
  message: "",
  website: "",
};

test("pilot validation and delivery preserve the company website and intent", () => {
  expect(validate(pilot)).toEqual({});
  expect(validate({ ...pilot, companyWebsite: "" })).toEqual({});
  for (const companyWebsite of [
    "invalid",
    "javascript:alert(1)",
    "https://user:pass@example.com",
    "https://example.com bad",
  ]) {
    expect(validate({ ...pilot, companyWebsite }).companyWebsite).toContain(
      "valid",
    );
  }
  expect(validate({ ...pilot, volume: "-1" }).volume).toBeTruthy();
  expect(validate({ ...pilot, volume: "25.5" }).volume).toBeTruthy();
  expect(validate({ ...pilot, volume: "50" })).toEqual({});
  const payload = createResendPayload(pilot, {
    to: "test@example.com",
    from: "website@example.com",
  });
  expect(payload.subject).toBe(
    "MONARDAS HVAC Revenue Recovery Assessment — Test HVAC",
  );
  expect(payload.text).toContain("Free initial review");
  expect(payload.text).toContain("Company website: example.com");
  expect(payload.text).not.toContain("Monthly estimate volume");
  expect(payload.html).toContain("MONARDAS HVAC Revenue Recovery Assessment");
  const { intent: _intent, companyWebsite: _website, ...ordinary } = pilot;
  void _intent;
  void _website;
  expect(validate(ordinary)).toEqual({});
});

test("pilot API rejects missing email, invalid intent and honeypot", async ({
  request,
}) => {
  for (const data of [
    { ...pilot, email: "" },
    { ...pilot, companyWebsite: "invalid" },
    { ...pilot, intent: "unknown" },
    { ...pilot, website: "bot" },
  ])
    expect((await request.post("/api/contact", { data })).status()).toBe(400);
});

test("HVAC anchors, pilot form validation, failure and success", async ({
  page,
}) => {
  await page.goto("/hvac");
  await expect(page.locator("h1")).toHaveText(
    "Recover revenue from HVAC replacement estimates that never closed.",
  );
  await expect(page.locator(".hvac-hero-baseline li")).toHaveText([
    "25–50 estimates",
    "Founder-led managed pilot",
    "No CRM migration required",
    "Your sales team closes",
  ]);
  await expect(page.locator(".hvac-page > section")).toHaveCount(10);
  await expect(page.locator(".product-hero")).toContainText(
    "Free initial review. No commitment to a paid pilot.",
  );
  await expect(page.locator("#system .hvac-sequence > li")).toHaveCount(5);
  await expect(page.locator("#system .hvac-handoff")).toContainText(
    "Illustrative example only. Not a customer case study or recorded result.",
  );
  await expect(page.locator("#calc-rate")).toHaveValue("");
  await expect(page.locator(".header-cta")).toHaveAttribute(
    "href",
    "/contact?intent=hvac-pilot",
  );
  await expect(page.locator(".header-cta")).toHaveText(
    "Get a Free Estimate Recovery Assessment",
  );
  await expect(
    page
      .locator(".product-hero")
      .getByRole("link", { name: "Get a Free Estimate Recovery Assessment" }),
  ).toHaveAttribute("href", "/contact?intent=hvac-pilot");
  await page
    .getByRole("link", { name: "See How It Works", exact: true })
    .click();
  await expect(page).toHaveURL(/#system$/);
  await expect(page.locator("#system")).toBeInViewport();
  await page.goto("/current-focus");
  await page
    .getByRole("link", {
      name: "Explore the Founder-led Recovery Pilot",
      exact: true,
    })
    .click();
  await expect(page).toHaveURL(/\/hvac#founding-partners$/);
  await expect(page.locator("#founding-partners")).toBeInViewport();
  await page
    .locator("#founding-partners")
    .getByRole("link", { name: "Discuss a Recovery Pilot" })
    .click();
  await expect(page).toHaveURL(/intent=hvac-pilot$/);
  await page.reload();
  await expect(page.locator('input[name="intent"]')).toHaveValue("hvac-pilot");
  await page.locator(".form-submit").click();
  await expect(page.locator("#firstName")).toBeFocused();
  await expect(page.locator("#companyWebsite")).not.toHaveAttribute(
    "required",
    "",
  );
  await page.locator("#firstName").fill(pilot.firstName);
  await page.locator("#company").fill(pilot.company);
  await page.locator("#email").fill(pilot.email);
  await page.locator("#companyWebsite").fill("invalid");
  await page.locator(".form-submit").click();
  await expect(page.locator("#companyWebsite")).toBeFocused();
  await page.locator("#companyWebsite").fill("example.com");
  let attempts = 0;
  await page.route("**/api/contact", async (route) => {
    expect(route.request().postDataJSON()).toMatchObject(pilot);
    attempts++;
    await route.fulfill({
      status: attempts === 1 ? 503 : 201,
      json: { message: attempts === 1 ? "Unavailable" : "Sent" },
    });
  });
  await page.locator(".form-submit").click();
  await expect(page.getByRole("status")).toContainText("We couldn't send");
  await expect(page.locator(".form-submit")).toBeEnabled();
  await page.screenshot({
    path: "qa-reports/hvac-next-step/form-error.png",
    fullPage: true,
  });
  await page.locator(".form-submit").click();
  await expect(page.getByRole("status")).toContainText(
    "Thanks — your assessment request has been received.",
  );
  await expect(page.getByRole("status")).toContainText(
    "I’ll review your current estimate follow-up process and get back to you directly.",
  );
  await expect(page.locator(".form-submit")).toBeDisabled();
  await page.screenshot({
    path: "qa-reports/hvac-next-step/form-success.png",
    fullPage: true,
  });
  expect(attempts).toBe(2);
});

test("free assessment entry explains the transition to a paid pilot on desktop and mobile", async ({
  page,
}) => {
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: width === 390 ? 844 : 1000 });
    await page.goto("/hvac");
    const next = page.getByRole("region", {
      name: "A simple path from backlog review to a focused pilot.",
    });
    await expect(next.getByRole("heading", { level: 3 })).toHaveCount(3);
    await expect(next).toContainText("before any homeowner outreach begins.");
    await next.screenshot({
      path: `qa-reports/hvac-next-step/next-steps-${width}.png`,
    });
    for (const question of [
      "How long does the pilot run?",
      "How will homeowners be contacted?",
      "How much does the pilot cost?",
    ]) {
      const detail = page
        .locator(".hvac-faq details")
        .filter({ has: page.getByText(question, { exact: true }) });
      await detail.locator("summary").click();
      await expect(detail.locator("p")).toBeVisible();
    }
    await page
      .locator(".product-hero")
      .getByRole("link", {
        name: "Get a Free Estimate Recovery Assessment",
        exact: true,
      })
      .click();
    await expect(page).toHaveURL(/intent=hvac-pilot$/);
    await expect(page.locator("h1")).toHaveText(
      "Get a Free Estimate Recovery Assessment",
    );
    await expect(page.locator(".hvac-pilot-contact")).toContainText(
      "The initial review is free. Submitting the form does not commit you to a paid engagement.",
    );
    await expect(page.locator(".form-submit")).toHaveText(
      "Get a Free Estimate Recovery Assessment",
    );
    await expect(
      page.getByLabel("CRM/FSM or export format (optional)"),
    ).toBeVisible();
    await expect(page.getByLabel("Notes (optional)")).toBeVisible();
  }
});

test("HVAC desktop/mobile accessibility and screenshots", async ({ page }) => {
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: width === 390 ? 844 : 1000 });
    for (const [route, name] of [
      ["/hvac", "hvac"],
      ["/contact?intent=hvac-pilot", "hvac-contact"],
    ]) {
      await page.goto(route);
      await page.evaluate(() => document.fonts.ready);
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
        path: `qa-reports/hvac-next-step/${name}-${width}.png`,
        fullPage: true,
      });
      if (name === "hvac") {
        await page.screenshot({
          path: `qa-reports/hvac-next-step/hvac-hero-${width}.png`,
        });
        const faq = page.locator(".hvac-faq summary").first();
        await faq.focus();
        await page.keyboard.press("Enter");
        await expect(page.locator(".hvac-faq details").first()).toHaveAttribute(
          "open",
          "",
        );
      }
    }
  }
});

test("founder-led recovery pilot form keeps legacy intent behavior", async ({
  page,
}) => {
  await page.goto("/contact?intent=founding-partner");
  await expect(page.locator(".contact-form h2")).toHaveText(
    "Discuss a Founder-led Recovery Pilot",
  );
  await expect(page.locator('input[name="industry"]')).toHaveValue("HVAC");
  await expect(page.locator("#message")).toHaveValue(
    "I’d like to discuss an HVAC Recovery Pilot.",
  );
});

test("direct entry to HVAC anchors lands on the target", async ({ page }) => {
  for (const anchor of ["system", "founding-partners"]) {
    await page.goto("about:blank");
    await page.goto("/hvac#" + anchor);
    await expect(page.locator("#" + anchor)).toBeInViewport();
  }
});
