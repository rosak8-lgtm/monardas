import { test, expect } from "@playwright/test";
import { sanitizeAttribution } from "../src/lib/attribution";
import {
  createResendPayload,
  isValidRuntimeContactConfig,
} from "../src/lib/contact-delivery";
import { validate } from "../src/lib/contact";
import { validFunnelEvent } from "../src/lib/funnel";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import { transpileModule, ModuleKind } from "typescript";
import { NextResponse } from "next/server.js";

test("attribution strips unknown fields, credentials and URL query data", () => {
  expect(
    sanitizeAttribution({
      utm_source: "google",
      utm_campaign: "replacement-q4",
      utm_term: "person@example.com",
      landing_page: "/hvac?email=private",
      referrer: "https://search.example/path?private=yes",
      email: "private@example.com",
    }),
  ).toEqual({
    utm_source: "google",
    utm_campaign: "replacement-q4",
    referrer: "https://search.example",
  });
  expect(
    sanitizeAttribution({
      referrer: "https://user:pass@example.com",
      utm_source: "x".repeat(101),
    }),
  ).toEqual({});
});

test("minimal audit API payload reaches mocked Resend with optional fields and attribution", async () => {
  const calls: Record<string, unknown>[] = [];
  const events: unknown[][] = [];
  let status = 200;
  const modules: Record<string, unknown> = {
    "next/server": { NextResponse },
    "cloudflare:workers": {
      env: {
        RESEND_API_KEY: "test-only",
        CONTACT_FROM: "MONARDAS Leads <website@send.monardas.com>",
        CONTACT_TO: "yurii@monardas.com",
      },
    },
    "@/lib/contact": { validate },
    "@/lib/contact-delivery": {
      createResendPayload,
      isValidRuntimeContactConfig,
    },
    "@/lib/attribution": { sanitizeAttribution },
    "@/lib/funnel": {
      logFunnelEvent: (...args: unknown[]) => events.push(args),
    },
  };
  const exports: { POST?: (request: Request) => Promise<Response> } = {};
  runInNewContext(
    transpileModule(readFileSync("src/app/api/contact/route.ts", "utf8"), {
      compilerOptions: { module: ModuleKind.CommonJS },
    }).outputText,
    {
      exports,
      require: (name: string) => {
        if (!(name in modules)) throw Error(name);
        return modules[name];
      },
      URL,
      crypto,
      process: { env: {} },
      fetch: async (url: string, options: RequestInit) => {
        expect(url).toBe("https://api.resend.com/emails");
        calls.push(JSON.parse(options.body as string));
        return new Response(JSON.stringify({ id: "mock-resend-id" }), {
          status,
        });
      },
    },
  );
  const send = (body: unknown, headers = {}) =>
    exports.POST!(
      new Request("https://monardas.com/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Origin: "https://monardas.com",
          ...headers,
        },
        body: JSON.stringify(body),
      }),
    );
  const minimal = {
    intent: "hvac-pilot",
    firstName: "Owner",
    company: "Test HVAC",
    email: "owner@example.com",
  };
  const response = await send({
    ...minimal,
    attribution: {
      utm_source: "google",
      referrer: "https://search.example/private?q=secret",
    },
  });
  expect(response.status).toBe(201);
  expect(await response.json()).toMatchObject({ id: "mock-resend-id" });
  expect(calls[0]).toMatchObject({
    from: "MONARDAS Leads <website@send.monardas.com>",
    to: "yurii@monardas.com",
    reply_to: "owner@example.com",
    subject: "MONARDAS HVAC Revenue Recovery Audit — Test HVAC",
  });
  expect(calls[0].text).toContain("utm_source: google");
  expect(calls[0].text).toContain("Company website: Not provided");
  expect(calls[0].text).not.toContain("secret");
  expect(events).toEqual([["hvac_audit_submit_success", "/contact"]]);
  expect((await send({ ...minimal, companyWebsite: "invalid" })).status).toBe(
    400,
  );
  expect((await send({ ...minimal, phone: "invalid" })).status).toBe(400);
  expect((await send({ ...minimal, website: "bot" })).status).toBe(400);
  expect(calls).toHaveLength(1);
  status = 422;
  expect((await send(minimal)).status).toBe(502);
  expect(events).toHaveLength(1);
  status = 200;
  expect((await send(minimal, { DNT: "1" })).status).toBe(201);
  expect(events).toHaveLength(1);
});

test("minimal form carries campaign context across navigation and survives analytics failure", async ({
  page,
}) => {
  const events: { event: string; path: string }[] = [];
  await page.route("**/api/events", async (route) => {
    events.push(route.request().postDataJSON());
    await route.fulfill({ status: 503 });
  });
  let submissions = 0;
  await page.route("**/api/contact", async (route) => {
    submissions++;
    expect(route.request().postDataJSON()).toMatchObject({
      intent: "hvac-pilot",
      companyWebsite: "",
      phone: "",
      attribution: {
        utm_source: "google",
        utm_medium: "cpc",
        utm_campaign: "replacement",
        utm_content: "hero",
        utm_term: "hvac",
        landing_page: "/",
      },
    });
    await route.fulfill({ status: 201, json: { id: "mock" } });
  });
  await page.goto(
    "/?utm_source=google&utm_medium=cpc&utm_campaign=replacement&utm_content=hero&utm_term=hvac",
  );
  await expect
    .poll(() =>
      page.evaluate(() => sessionStorage.getItem("monardas:attribution")),
    )
    .toContain("replacement");
  await page
    .locator(".corporate-hero")
    .getByRole("link", { name: "Explore HVAC Revenue Recovery" })
    .click();
  await expect
    .poll(() => events.some((e) => e.event === "hvac_page_view"))
    .toBe(true);
  await page
    .locator(".product-hero")
    .getByRole("link", { name: "Get a Free Estimate Recovery Audit" })
    .click();
  await expect
    .poll(() => events.some((e) => e.event === "contact_form_view"))
    .toBe(true);
  expect(events.some((e) => e.event === "hvac_audit_cta_click")).toBe(true);
  await expect(page.locator("input[required]")).toHaveCount(3);
  await page.locator("#firstName").fill("Owner");
  await page.locator("#company").fill("Test HVAC");
  await page.locator("#email").fill("owner@example.com");
  await page.locator(".form-submit").click();
  await expect(page.getByRole("status")).toContainText(
    "I’ll review your current estimate follow-up process",
  );
  await expect(page.locator(".form-submit")).toBeDisabled();
  expect(submissions).toBe(1);
  expect(events.filter((e) => e.event === "hvac_page_view")).toHaveLength(1);
  expect(events.filter((e) => e.event === "hvac_audit_cta_click")).toHaveLength(
    1,
  );
  expect(events.filter((e) => e.event === "contact_form_view")).toHaveLength(1);
  expect(
    await page.evaluate(() => sessionStorage.getItem("monardas:attribution")),
  ).not.toContain("owner@example.com");
});

test("measurement opt-out and JavaScript-only form guard", async ({
  browser,
  page,
}) => {
  await page.addInitScript(() =>
    Object.defineProperty(navigator, "globalPrivacyControl", { value: true }),
  );
  const events: string[] = [];
  await page.route("**/api/events", (r) => {
    events.push(r.request().url());
    return r.abort();
  });
  await page.goto("/hvac?utm_source=private");
  await page.waitForLoadState("networkidle");
  expect(events).toEqual([]);
  expect(
    await page.evaluate(() => sessionStorage.getItem("monardas:attribution")),
  ).toBeNull();
  const context = await browser.newContext({ javaScriptEnabled: false });
  const noJS = await context.newPage();
  await noJS.goto(new URL("/contact?intent=hvac-pilot", page.url()).href);
  await expect(noJS.locator(".form-submit")).toBeDisabled();
  await expect(noJS.locator("noscript")).toBeVisible();
  expect(
    await noJS.locator("noscript").evaluate((el) => el.textContent),
  ).toContain("yurii@monardas.com");
  await context.close();
});

test("event endpoint rejects arbitrary payloads and accepts only funnel pairs", async ({
  request,
  baseURL,
}) => {
  expect(validFunnelEvent("hvac_page_view", "/hvac")).toBe(true);
  expect(validFunnelEvent("hvac_audit_submit_success", "/contact")).toBe(false);
  const headers = { Origin: new URL(baseURL!).origin };
  expect(
    (
      await request.post("/api/events", {
        headers,
        data: { event: "hvac_page_view", path: "/hvac" },
      })
    ).status(),
  ).toBe(204);
  expect(
    (
      await request.post("/api/events", {
        headers,
        data: { event: "email", path: "private@example.com" },
      })
    ).status(),
  ).toBe(400);
  expect(
    (
      await request.post("/api/events", {
        headers: { Origin: "https://other.example" },
        data: {},
      })
    ).status(),
  ).toBe(403);
  expect(
    (
      await request.post("/api/events", {
        headers,
        data: { x: "x".repeat(257) },
      })
    ).status(),
  ).toBe(413);
});

test("www redirect preserves path and campaign query without redirecting apex", async ({
  request,
}) => {
  for (const path of [
    "/",
    "/hvac?utm_source=google",
    "/contact?intent=hvac-pilot&utm_campaign=qa",
    "/nested/example?x=1&y=2",
  ]) {
    const response = await request.get(path, {
      headers: { Host: "www.monardas.com" },
      maxRedirects: 0,
    });
    expect(response.status()).toBe(308);
    expect(response.headers().location).toBe(`https://monardas.com${path}`);
  }
  expect(
    (
      await request.get("/hvac", {
        headers: { Host: "monardas.com" },
        maxRedirects: 0,
      })
    ).status(),
  ).toBe(200);
});
