import { test, expect } from "@playwright/test";

test("calculator inputs stay local and reset after reload", async ({
  page,
}) => {
  await page.goto("/hvac");
  await page.waitForLoadState("networkidle");
  const outgoing: string[] = [];
  page.on("request", (request) => {
    if (["fetch", "xhr"].includes(request.resourceType()))
      outgoing.push(request.url());
  });
  const readStorage = () =>
    page.evaluate(() =>
      JSON.stringify({
        local: { ...localStorage },
        session: { ...sessionStorage },
      }),
    );
  const before = await readStorage();
  await page
    .getByLabel("Unsold estimates per month", { exact: true })
    .fill("20");
  await page
    .getByLabel("Average replacement ticket (USD)", { exact: true })
    .fill("10000");
  await page
    .getByLabel("Illustrative recovery rate (%)", { exact: true })
    .fill("10");
  await expect(page.locator(".big-result strong")).toHaveText("$20,000");
  expect(await readStorage()).toBe(before);
  expect(outgoing).toEqual([]);
  await page.reload();
  await expect(page.locator(".big-result strong")).toHaveText("$42,500");
});

test("successful form delivery is announced and duplicate submissions are blocked", async ({
  page,
}) => {
  let submissions = 0;
  let release!: () => void;
  const pending = new Promise<void>((resolve) => {
    release = resolve;
  });
  await page.route("**/api/contact", async (route) => {
    submissions++;
    await pending;
    await route.fulfill({
      status: 201,
      json: { id: "local-test", message: "Sent" },
    });
  });
  await page.goto("/contact");
  await page.locator("#firstName").fill("Test");
  await page.locator("#lastName").fill("Operator");
  await page.locator("#company").fill("Test HVAC");
  await page.locator("#email").fill("test@example.com");
  await page.locator("#phone").fill("1234567890");
  await page.locator("#industry").selectOption("HVAC");
  await page.locator("#volume").selectOption("50–100");
  await page
    .getByRole("button", { name: "Request a Revenue Recovery Audit" })
    .click();
  await expect.poll(() => submissions).toBe(1);
  await expect(page.locator(".form-submit")).toBeDisabled();
  await page
    .locator("form")
    .evaluate((form) =>
      form.dispatchEvent(
        new Event("submit", { bubbles: true, cancelable: true }),
      ),
    );
  release();
  await expect(page.getByRole("status")).toContainText("Request received.");
  await expect(page.getByRole("status")).toContainText(
    "Thanks — we’ll review your revenue recovery opportunities and get back to you shortly.",
  );
  await page
    .locator("form")
    .evaluate((form) =>
      form.dispatchEvent(
        new Event("submit", { bubbles: true, cancelable: true }),
      ),
    );
  await expect(page.locator(".form-submit")).toBeDisabled();
  expect(submissions).toBe(1);
});

test("contact API keeps origin, payload limit, honeypot and content-type protections", async ({
  request,
}) => {
  const data = {
    firstName: "Test",
    lastName: "Operator",
    company: "Test HVAC",
    email: "test@example.com",
    phone: "1234567890",
    industry: "HVAC",
    volume: "50–100",
    crm: "",
    message: "",
    website: "bot",
  };
  expect((await request.post("/api/contact", { data })).status()).toBe(400);
  expect(
    (
      await request.post("/api/contact", {
        data,
        headers: { Origin: "https://example.org" },
      })
    ).status(),
  ).toBe(403);
  expect(
    (
      await request.post("/api/contact", {
        data: "x".repeat(12001),
        headers: { "Content-Type": "application/json" },
      })
    ).status(),
  ).toBe(413);
  expect(
    (
      await request.post("/api/contact", {
        data: "text",
        headers: { "Content-Type": "text/plain" },
      })
    ).status(),
  ).toBe(415);
});
