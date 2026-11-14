import { test, expect } from "@playwright/test";
import { validate, type ContactData } from "../src/lib/contact";
import { createResendPayload } from "../src/lib/contact-delivery";
import { sanitizeAttribution } from "../src/lib/attribution";

const free: ContactData = {
  intent: "hvac-free-pilot", firstName: "Example", lastName: "",
  company: "Example HVAC", companyWebsite: "example.com",
  email: "example@example.com", phone: "", industry: "HVAC",
  volume: "25", crm: "Jobber", message: "10 open replacements",
  website: "", preferredChannel: "email",
};

test("free founder applications are distinct from paid sales and agency requests", () => {
  expect(validate(free)).toEqual({});
  expect(validate({...free, volume: "-1"}).volume).toBeTruthy();
  expect(validate({...free, volume: "25.3"}).volume).toBeTruthy();
  expect(validate({...free, companyWebsite: "javascript:alert(1)"}).companyWebsite).toBeTruthy();
  const payload=createResendPayload(free,{to:"inbound@monardas.com",from:"website@send.monardas.com"});
  expect(payload.subject).toContain("FREE Founding Pilot Application");
  expect(payload.text).toContain("no-cost 30-day");
  expect(payload.text).toContain("Client controls homeowner contacts");
  expect(payload.text).toContain("No purchase commitment.");
  expect(payload.text).not.toContain("Monthly estimate volume");
  expect(sanitizeAttribution({ landing_page: "/hvac/free-pilot" }).landing_page).toBe("/hvac/free-pilot");
});

test("free founder landing explains scope and boundaries", async ({page}) => {
  await page.goto("/hvac/free-pilot");
  await expect(page.getByRole("heading",{level:1})).toContainText("30 days free.");
  await expect(page.getByText("Up to two approved follow-up actions per eligible estimate.", { exact: false })).toBeVisible();
  await expect(page.getByText("It ends without automatic renewal", { exact: false })).not.toBeVisible();
  await expect(page.getByText("Your business stays in control.",{exact:false})).not.toBeVisible();
  await page.getByText("Who actually contacts homeowners?").click();
  await expect(page.getByText("Your business stays in control.",{exact:false})).toBeVisible();
  await expect(page.locator("a[href^='/contact?intent=hvac-free-pilot']")).toHaveCount(2);
});

test("free founder CTA submits distinct intent exactly once (mocked)", async ({page}) => {
  await page.goto("/hvac/free-pilot");
  await page.getByRole("link",{name:"Apply for the Free 30-Day Pilot"}).click();
  await expect(page).toHaveURL(/intent=hvac-free-pilot/);
  await expect(page.getByRole("heading",{name:"Apply for the Free 30-Day HVAC Pilot"})).toBeVisible();
  await expect(page.locator('input[name="intent"]')).toHaveValue("hvac-free-pilot");
  await expect(page.locator(".contact-form h2")).toHaveText("Apply for a Free 30-Day HVAC Pilot");
  await page.locator("#firstName").fill("Example");
  await page.locator("#company").fill("Example HVAC");
  await page.locator("#email").fill("example@example.com");
  let submits=0;
  await page.route("**/api/contact", async route=>{
    submits++;
    expect(route.request().postDataJSON()).toMatchObject({intent:"hvac-free-pilot",company:"Example HVAC"});
    await route.fulfill({status:201,json:{id:"mock-not-real",message:"received"}});
  });
  await page.locator(".form-submit").click();
  await expect(page.locator(".form-submit")).toBeDisabled();
  expect(submits).toBe(1);
});

test("free founder form is mobile ready and prevents invalid addresses",async ({page})=>{
  await page.setViewportSize({width:390,height:844});
  await page.goto("/contact?intent=hvac-free-pilot");
  await expect(page.getByText("No card or commitment.",{exact:false})).toBeVisible();
  await page.locator("#firstName").fill("Example");
  await page.locator("#company").fill("Example HVAC");
  await page.locator("#email").fill("not-an-email");
  await page.locator(".form-submit").click();
  await expect(page.locator("#email")).toBeFocused();
  const overflow = await page.evaluate(() => {
    const limit = innerWidth;
    return [...document.querySelectorAll("*")]
      .map((element) => ({
        tag: element.tagName.toLowerCase(),
        cls: typeof element.className === "string" ? element.className : "",
        text: (element.textContent || "").trim().slice(0, 65),
        right: Math.round(element.getBoundingClientRect().right),
        scrollWidth: (element as HTMLElement).scrollWidth,
      }))
      .filter((item) => item.right > limit + 1)
      .slice(0, 12);
  });
  console.log("FREE_PILOT_MOBILE_OVERFLOW", JSON.stringify(overflow));
  expect(overflow).toEqual([]);
});
