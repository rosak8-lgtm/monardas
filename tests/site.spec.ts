import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
const routes = [
  "/",
  "/ai",
  "/systems",
  "/ventures",
  "/capital",
  "/commerce",
  "/nature",
  "/strategy",
  "/founder",
  "/roofing",
  "/hvac",
  "/how-it-works",
  "/pricing",
  "/contact",
  "/privacy",
  "/terms",
];
test("public routes, metadata, links, accessibility and browser errors", async ({
  page,
  request,
}) => {
  const errors: string[] = [];
  const links = new Set<string>();
  const titles = new Set<string>();
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });
  for (const route of routes) {
    const response = await page.goto(route);
    expect(response?.status(), route).toBe(200);
    await expect(page.locator("h1")).toHaveCount(1);
    const title = await page.title();
    expect(titles.has(title), `Unique title for ${route}`).toBe(false);
    titles.add(title);
    expect(
      await page.locator('meta[name="description"]').getAttribute("content"),
    ).toBeTruthy();
    expect(await page.locator('meta[property="og:title"]').count()).toBe(1);
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(
      results.violations,
      `${route}: ${JSON.stringify(results.violations.map((v) => ({ id: v.id, nodes: v.nodes.map((n) => n.target) })))}`,
    ).toEqual([]);
    for (const href of await page
      .locator("a[href]")
      .evaluateAll((els) => els.map((el) => el.getAttribute("href") || ""))) {
      if (href.startsWith("/")) links.add(href.split("#")[0]);
      if (href.startsWith("#"))
        expect(
          await page.locator(href).count(),
          `${route} ${href}`,
        ).toBeGreaterThan(0);
    }
  }
  for (const href of links)
    expect((await request.get(href)).status(), href).toBe(200);
  expect((await request.get("/not-a-real-route")).status()).toBe(404);
  expect(errors).toEqual([]);
});
test("all requested responsive widths across every page", async ({ page }) => {
  for (const width of [375, 390, 430, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    for (const route of routes) {
      await page.goto(route);
      await page.evaluate(() => document.fonts.ready);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        `${route} at ${width}px`,
      ).toBe(true);
      const outside = await page.locator("main a.button").evaluateAll((els) =>
        els
          .filter((e) => {
            const r = e.getBoundingClientRect();
            return r.left < 0 || r.right > innerWidth;
          })
          .map((e) => e.textContent),
      );
      expect(outside, `${route} buttons at ${width}px`).toEqual([]);
    }
    await page.goto("/");
    await page.screenshot({
      path: `test-results/home-${width}.png`,
      fullPage: true,
    });
  }
  await page.goto("/ai");
  await page.screenshot({
    path: "test-results/ai-desktop.png",
    fullPage: true,
  });
});
test("desktop and mobile navigation support keyboard and dismissal", async ({
  page,
}) => {
  await page.goto("/");
  await page.setViewportSize({ width: 1440, height: 1000 });
  const build = page.getByRole("button", { name: "Build", exact: true });
  await build.focus();
  await page.keyboard.press("Enter");
  await expect(build).toHaveAttribute("aria-expanded", "true");
  await page.keyboard.press("Tab");
  await expect(
    page.locator("#nav-Build").getByRole("link", { name: "AI", exact: true }),
  ).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(build).toBeFocused();
  await expect(build).toHaveAttribute("aria-expanded", "false");
  await build.click();
  await page.locator("h1").click();
  await expect(build).toHaveAttribute("aria-expanded", "false");
  await page.setViewportSize({ width: 390, height: 844 });
  const menu = page.getByRole("button", { name: "Open navigation" });
  await menu.click();
  await expect(page.locator("#mobile-navigation")).toBeVisible();
  expect(
    (await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze())
      .violations,
  ).toEqual([]);
  await page.keyboard.press("Escape");
  await expect(menu).toBeFocused();
  await menu.click();
  await page
    .locator("#mobile-navigation")
    .getByRole("link", { name: "Capital", exact: true })
    .click();
  await expect(page).toHaveURL("/capital");
  await expect(page.locator("#mobile-navigation")).toHaveCount(0);
});
test("calculator scenarios, bounds and reduced motion", async ({ page }) => {
  await page.goto("/ai");
  await expect(page.locator(".big-result strong")).toHaveText("$42,000");
  await expect(page.locator(".small-result").nth(1)).toContainText("3.5");
  await page.locator("#calc-0").fill("0");
  await expect(page.locator(".big-result strong")).toHaveText("$0");
  await page.locator("#calc-0").fill("100");
  await page.locator("#calc-2").fill("100");
  await expect(page.locator(".big-result strong")).toHaveText("$0");
  await page.locator("#calc-2").fill("0");
  await page.locator("#calc-3").fill("200");
  await expect(page.locator("#calc-3")).toHaveValue("100");
  await expect(page.locator(".big-result strong")).toHaveText("$1,200,000");
  await page.locator("#calc-1").fill("-1");
  await expect(page.locator("#calc-1")).toHaveValue("0");
  await page.emulateMedia({ reducedMotion: "reduce" });
  expect(
    await page
      .locator("h1")
      .evaluate((el) => getComputedStyle(el).animationName),
  ).toBe("none");
  expect(
    await page.evaluate(
      () => getComputedStyle(document.documentElement).scrollBehavior,
    ),
  ).toBe("auto");
});
test("form validation and honest delivery state", async ({ page, request }) => {
  await page.goto("/contact");
  await page
    .getByRole("button", { name: "Request a Revenue Recovery Audit" })
    .click();
  await expect(page.locator("#firstName")).toBeFocused();
  await expect(page.locator("#email-error")).toContainText("required");
  await page.locator("#firstName").fill("Test");
  await page.locator("#lastName").fill("Operator");
  await page.locator("#company").fill("QA Company");
  await page.locator("#email").fill("invalid");
  await page.locator("#phone").fill("1234567890");
  await page.locator("#industry").selectOption("Roofing");
  await page.locator("#volume").selectOption("50–100");
  await page
    .getByRole("button", { name: "Request a Revenue Recovery Audit" })
    .click();
  await expect(page.locator("#email-error")).toContainText("valid email");
  await page.locator("#email").fill("test@example.com");
  await page.locator("#crm").fill("CSV export");
  const submitted = page.waitForResponse("/api/contact");
  await page
    .getByRole("button", { name: "Request a Revenue Recovery Audit" })
    .click();
  const response = await submitted;
  expect(response.status()).toBe(503);
  await expect(page.getByRole("status")).toContainText(
    "temporarily unavailable",
  );
  const bad = await request.post("/api/contact", { data: { email: "bad" } });
  expect(bad.status()).toBe(400);
});
