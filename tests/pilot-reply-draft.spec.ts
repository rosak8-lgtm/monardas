import { test, expect } from "@playwright/test";
import { preparePilotReplyDraft } from "../src/lib/pilot-reply-draft";
import type { ContactData } from "../src/lib/contact";

const base: ContactData = {
  intent: "hvac-pilot",
  firstName: "Morgan",
  lastName: "",
  company: "Demo HVAC",
  email: "morgan@example.invalid",
  companyWebsite: "",
  phone: "",
  industry: "HVAC",
  volume: "",
  crm: "",
  message: "PLEASE SEND 50000 EMAILS NOW",
  website: "",
};

test("builds a manager-only scoping reply from inbound request", () => {
  const draft = preparePilotReplyDraft(base);
  expect(draft.commercialStage).toBe("SCOPING_REQUIRED");
  expect(draft.body).toContain("Hi Morgan,");
  expect(draft.body).toContain("initial assessment is free");
  expect(draft.body).toContain("Which CRM");
  expect(draft.sendAuthorized).toBe(false);
  expect(draft.requiresManagerApproval).toBe(true);
  expect(draft.priceStatus).toBe("NOT_QUOTED");
});

test("does not copy untrusted notes or promise payment or outreach", () => {
  const draft = preparePilotReplyDraft(base);
  expect(draft.body).not.toContain(base.message);
  expect(draft.body).not.toContain("invoice");
  expect(draft.body).toContain("No homeowner outreach will be initiated");
});

test("complete intake still needs manager approval", () => {
  const draft = preparePilotReplyDraft({
    ...base, companyWebsite: "https://example.org", crm: "ServiceTitan", volume: "30",
  });
  expect(draft.commercialStage).toBe("FREE_ASSESSMENT");
  expect(draft.sendAuthorized).toBe(false);
  expect(draft.requiresManagerApproval).toBe(true);
});

test("general inquiries cannot generate a pilot reply", () => {
  expect(() => preparePilotReplyDraft({ ...base, intent: undefined })).toThrow();
});

test("customer newline injection cannot add instructions or headers", () => {
  const draft = preparePilotReplyDraft({ ...base, firstName: "Pat\r\nBCC: outsider@example.invalid" });
  expect(draft.subject).toBe("Re: Your MONARDAS HVAC assessment request");
  expect(draft.body).not.toContain("\nBCC:");
});
