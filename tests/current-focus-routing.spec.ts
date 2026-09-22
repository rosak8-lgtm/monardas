import { test, expect } from "@playwright/test";

const headline =
  "Recover missed HVAC leads and unsold estimates automatically.";

test("direct requests resolve without cookies, client state or a referrer", async ({
  request,
}) => {
  expect((await request.get("/")).status()).toBe(200);
  for (const host of ["monardas.com", "www.monardas.com"]) {
    for (let attempt = 0; attempt < 2; attempt++) {
      const response = await request.get("/current-focus", {
        headers: { Host: host, "Cache-Control": "no-cache" },
      });
      expect(response.status(), `${host}, request ${attempt + 1}`).toBe(200);
      const html = await response.text();
      expect(html).toContain("Recover missed HVAC leads and unsold estimates");
      expect(html).toContain("Current Focus — HVAC Revenue Recovery");
    }
  }
  expect((await request.get("/ai")).status()).toBe(200);
  expect((await request.get("/not-a-real-route")).status()).toBe(404);
});

test("fresh browser context, external entry and refresh retain the page and metadata", async ({
  page,
}) => {
  // Playwright supplies a new isolated browser context for each test.
  const response = await page.goto("/current-focus", {
    referer: "https://example.org/",
  });
  expect(response?.status()).toBe(200);
  await expect(page.locator("h1")).toHaveText(headline);
  await expect(page).toHaveTitle(
    "Current Focus — HVAC Revenue Recovery | MONARDAS",
  );
  const description = await page
    .locator('meta[name="description"]')
    .getAttribute("content");
  expect(description).toContain(
    "Recover missed HVAC leads and unsold estimates automatically.",
  );
  const canonicalLink = page.locator('link[rel="canonical"]');
  const canonical = (await canonicalLink.count())
    ? await canonicalLink.getAttribute("href")
    : null;
  if (canonical) {
    expect(new URL(canonical).pathname).toBe("/current-focus");
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute(
      "content",
      canonical,
    );
  }
  const refreshed = await page.reload();
  expect(refreshed?.status()).toBe(200);
  await expect(page.locator("h1")).toHaveText(headline);
  await page.goto("/ai");
  await expect(page.locator("h1")).toHaveText(headline);
  await expect(page.locator('meta[name="description"]')).toHaveAttribute(
    "content",
    description!,
  );
  const legacyCanonical = page.locator('link[rel="canonical"]');
  expect(await legacyCanonical.count()).toBe(canonical ? 1 : 0);
  if (canonical) {
    expect(new URL((await legacyCanonical.getAttribute("href"))!).origin).toBe(
      new URL(canonical).origin,
    );
  }
});

test("Current Focus link uses client navigation and survives reload", async ({
  page,
}) => {
  await page.goto("/");
  // A full-document navigation would clear this marker.
  await page.evaluate(() => {
    document.documentElement.dataset.navigationCheck = "retained";
  });
  await page.locator(".header-cta").click();
  await expect(page).toHaveURL(/\/current-focus$/);
  await expect(page.locator("h1")).toHaveText(headline);
  await expect(page.locator("html")).toHaveAttribute(
    "data-navigation-check",
    "retained",
  );
  expect((await page.reload())?.status()).toBe(200);
  await expect(page.locator("h1")).toHaveText(headline);
});
