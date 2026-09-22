import { test, expect } from "@playwright/test";

const routes = ["/", "/ai", "/hvac", "/roofing", "/current-focus"];
const headings: Record<string, RegExp> = {
  "/": /Intelligence\.Systems\.Ownership\./,
  "/ai": /Recover revenue from opportunities you already paid to generate\./,
  "/hvac":
    /Recover revenue from HVAC opportunities you’ve already paid to generate\./,
  "/roofing": /Roofing UnsoldEstimate Recovery\./,
  "/current-focus": /HVAC revenue recovery\.Our first commercial focus\./,
};

test("commercial routes return HTML on direct and refresh-equivalent requests for both hosts", async ({
  request,
}) => {
  for (const host of ["monardas.com", "www.monardas.com"]) {
    for (const route of routes) {
      for (let attempt = 0; attempt < 2; attempt++) {
        const response = await request.get(route, {
          headers: { Host: host, "Cache-Control": "no-cache" },
        });
        expect(
          response.status(),
          `${host}${route}, request ${attempt + 1}`,
        ).toBe(200);
        expect(await response.text()).toContain("<h1");
      }
    }
  }
  expect((await request.get("/not-a-real-route")).status()).toBe(404);
});

for (const route of routes) {
  test(`fresh context, external entry, metadata and refresh: ${route}`, async ({
    page,
  }) => {
    expect(
      (await page.goto(route, { referer: "https://example.org/" }))?.status(),
    ).toBe(200);
    await expect(page.locator("h1")).toHaveText(headings[route]);
    const canonical = await page
      .locator('link[rel="canonical"]')
      .getAttribute("href");
    expect(new URL(canonical!).pathname).toBe(route);
    expect(new URL(canonical!).hostname).toBe("monardas.com");
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute(
      "content",
      canonical!,
    );
    expect((await page.reload())?.status()).toBe(200);
    await expect(page.locator("h1")).toHaveText(headings[route]);
    if (route !== "/") {
      await expect(page.locator('a[href="/nature"]')).toHaveCount(0);
    }
  });
}

test("holding to AI to HVAC and secondary roofing use client navigation", async ({
  page,
}) => {
  await page.goto("/");
  await page.evaluate(() => {
    document.documentElement.dataset.navigationCheck = "retained";
  });
  await page
    .locator("main")
    .getByRole("link", { name: "Explore MONARDAS AI", exact: true })
    .first()
    .click();
  await expect(page).toHaveURL("/ai");
  await page
    .getByRole("link", { name: "Explore HVAC Revenue Recovery", exact: true })
    .first()
    .click();
  await expect(page).toHaveURL("/hvac");
  await expect(page.locator("h1")).toHaveText(headings["/hvac"]);
  await expect(page.locator("html")).toHaveAttribute(
    "data-navigation-check",
    "retained",
  );
  await page.locator(".header .logo").click();
  await expect(page).toHaveURL("/");
  await expect(page.locator(".header-cta")).toHaveAttribute(
    "href",
    "/current-focus",
  );
  await page.locator(".header-cta").click();
  await expect(page).toHaveURL("/current-focus");
  await page
    .locator("main")
    .getByRole("link", { name: "Explore MONARDAS AI", exact: true })
    .click();
  await page
    .getByRole("link", { name: "Explore the roofing direction" })
    .click();
  await expect(page).toHaveURL("/roofing");
  await expect(page.locator("html")).toHaveAttribute(
    "data-navigation-check",
    "retained",
  );
  expect((await page.reload())?.status()).toBe(200);
});

test("founding partner CTA preserves application intent in the existing form", async ({
  page,
}) => {
  await page.goto("/hvac");
  await page
    .getByRole("link", { name: "Apply as a Founding Partner", exact: true })
    .click();
  await expect(page).toHaveURL(/\/contact\?intent=founding-partner$/);
  await expect(page.locator(".contact-form h2")).toHaveText(
    "Apply as a Founding Partner.",
  );
  await expect(page.locator("#industry")).toHaveValue("HVAC");
  await expect(page.locator("#message")).toHaveValue(
    "I’d like to apply as an HVAC Founding Partner.",
  );
});

test("sitemap includes explicit commercial routes once", async ({
  request,
}) => {
  const response = await request.get("/sitemap.xml");
  expect(response.status()).toBe(200);
  const xml = await response.text();
  for (const route of routes.slice(1)) {
    expect(
      xml.split(`<loc>https://monardas.com${route}</loc>`).length - 1,
    ).toBe(1);
  }
});
