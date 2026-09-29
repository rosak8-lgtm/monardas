import { test, expect } from "@playwright/test";

const routes = ["/", "/ai", "/hvac", "/roofing", "/current-focus"];
const headings: Record<string, RegExp> = {
  "/": /Intelligence\.Systems\.Ownership\./,
  "/ai": /Recover revenue from opportunities you've already paid to generate\./,
  "/hvac":
    /Recover revenue from HVAC replacement estimates that never closed\./,
  "/roofing": /Roofing UnsoldEstimate Recovery\./,
  "/current-focus": /HVAC estimate recovery\.Our first commercial workflow\./,
};

test("commercial routes serve apex HTML and permanently redirect www", async ({
  request,
}) => {
  for (const host of ["monardas.com", "www.monardas.com"]) {
    for (const route of routes) {
      for (let attempt = 0; attempt < 2; attempt++) {
        const response = await request.get(route, {
          headers: { Host: host, "Cache-Control": "no-cache" },
          maxRedirects: 0,
        });
        if (host === "www.monardas.com") {
          expect(response.status()).toBe(308);
          expect(response.headers().location).toBe(`https://monardas.com${route}`);
          continue;
        }
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

test("AI positioning stays focused on unsold replacement recovery", async ({
  page,
}) => {
  for (const route of ["/ai", "/current-focus"]) {
    await page.goto(route);
    await expect(page.locator("main")).toContainText(
      /unsold replacement estimate/i,
    );
    await expect(
      page.getByRole("heading", { name: "Missed Call Recovery", exact: true }),
    ).toHaveCount(0);
  }
});

test("holding, AI and current focus use client navigation", async ({
  page,
}) => {
  await page.goto("/");
  await page.evaluate(() => {
    document.documentElement.dataset.navigationCheck = "retained";
  });
  await page
    .locator("main")
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
    "/contact?intent=hvac-pilot",
  );
  await expect(page.locator(".header-cta")).toHaveText(
    "Get a Free Estimate Recovery Assessment",
  );
  await page.locator(".header-cta").click();
  await expect(page).toHaveURL("/contact?intent=hvac-pilot");
  await page.goto("/current-focus");
  await page
    .getByRole("link", { name: "Explore HVAC Revenue Recovery", exact: true })
    .click();
  await expect(page).toHaveURL("/hvac");
  await page.goto("/ai");
  await page
    .getByRole("link", { name: "Explore HVAC Revenue Recovery", exact: true })
    .first()
    .click();
  await expect(page).toHaveURL("/hvac");
  expect((await page.reload())?.status()).toBe(200);
});

test("founder pilot CTA preserves HVAC intent in the form", async ({
  page,
}) => {
  await page.goto("/hvac");
  await page
    .locator("#founding-partners")
    .getByRole("link", { name: "Discuss a Recovery Pilot", exact: true })
    .click();
  await expect(page).toHaveURL(/\/contact\?intent=hvac-pilot$/);
  await expect(page.locator(".contact-form h2")).toHaveText(
    "Get a Free Estimate Recovery Assessment",
  );
  await expect(page.locator("#companyWebsite")).toBeVisible();
  await expect(page.locator('input[name="intent"]')).toHaveValue("hvac-pilot");
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
