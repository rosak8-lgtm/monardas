import { test, expect } from "@playwright/test";

function contrast(foreground: string, background: string) {
  const luminance = (color: string) => {
    const channels = color
      .match(/[\d.]+/g)!
      .slice(0, 3)
      .map(Number)
      .map((value) => {
        const s = value / 255;
        return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
      });
    return channels.reduce(
      (sum, value, i) => sum + value * [0.2126, 0.7152, 0.0722][i],
      0,
    );
  };
  const a = luminance(foreground),
    b = luminance(background);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

test("AI keeps teal; HVAC uses a semantic burgundy accent and gold focus on dark", async ({
  page,
}) => {
  for (const [route, accent] of [
    ["/ai", "rgb(83, 110, 108)"],
    ["/hvac", "rgb(91, 32, 39)"],
  ]) {
    await page.goto(route);
    const button = page.locator(".product-hero .button-dark");
    await button.hover();
    await expect(button).toHaveCSS("background-color", accent);
    await button.focus();
    await expect(button).toHaveCSS("outline-color", accent);
    expect(
      await page
        .locator(".product-page")
        .evaluate((el) =>
          getComputedStyle(el).getPropertyValue("--teal").trim(),
        ),
    ).toBe("#536e6c");
    expect(contrast("rgb(243, 240, 232)", accent)).toBeGreaterThanOrEqual(4.5);
  }
  const link = page.locator(".calculator-results a");
  await link.focus();
  await expect(link).toHaveCSS("outline-color", "rgb(184, 155, 94)");
  const surface = await page
    .locator(".calculator-results")
    .evaluate((el) => getComputedStyle(el).backgroundColor);
  expect(contrast("rgb(184, 155, 94)", surface)).toBeGreaterThanOrEqual(3);
  await page.locator("#calc-rate").focus();
  await expect(page.locator("#calc-rate")).toHaveCSS(
    "outline-color",
    "rgb(91, 32, 39)",
  );
});

test("form placeholders and essential field borders meet contrast thresholds", async ({
  page,
}) => {
  for (const route of ["/contact", "/contact?intent=hvac-pilot"]) {
    await page.goto(route);
    const background = await page
      .locator(".contact-form")
      .evaluate((el) => getComputedStyle(el).backgroundColor);
    for (const input of await page
      .locator(".form-grid input, .form-grid select, .form-grid textarea")
      .all()) {
      const style = await input.evaluate((el) => ({
        border: getComputedStyle(el).borderTopColor,
        placeholder: getComputedStyle(el, "::placeholder").color,
        opacity: getComputedStyle(el, "::placeholder").opacity,
      }));
      expect(contrast(style.border, background)).toBeGreaterThanOrEqual(3);
      if (await input.getAttribute("placeholder")) {
        expect(style.opacity).toBe("1");
        expect(contrast(style.placeholder, background)).toBeGreaterThanOrEqual(
          4.5,
        );
      }
    }
  }
  await page.goto("/hvac");
  const inputBackground = await page
    .locator(".calculator-inputs")
    .evaluate((el) => getComputedStyle(el).backgroundColor);
  for (const wrapper of await page.locator(".number-wrap").all()) {
    expect(
      contrast(
        await wrapper.evaluate((el) => getComputedStyle(el).borderTopColor),
        inputBackground,
      ),
    ).toBeGreaterThanOrEqual(3);
  }
});

test("contrast adjustments preserve mobile layout and capture focus", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    for (const [route, name] of [
      ["/hvac", "hvac"],
      ["/contact?intent=hvac-pilot", "form"],
    ]) {
      await page.goto(route);
      await page.evaluate(() => document.fonts.ready);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      if (name === "hvac") {
        await page.locator(".calculator-results a").focus();
        await page
          .locator(".calculator")
          .screenshot({
            path: `qa-reports/hvac-contrast/calculator-focus-${width}.png`,
          });
      } else {
        await page.screenshot({
          path: `qa-reports/hvac-contrast/form-${width}.png`,
          fullPage: true,
        });
      }
    }
  }
});
