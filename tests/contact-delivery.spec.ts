import { test, expect } from "@playwright/test";
import { validate } from "../src/lib/contact";
import {
  createResendPayload,
  escapeHtml,
  isValidContactFrom,
  isValidContactTo,
  isValidRuntimeContactConfig,
} from "../src/lib/contact-delivery";

test("trusted Resend addresses are preserved exactly", () => {
  const to = "yurii@monardas.com";
  const from = "MONARDAS Leads <website@send.monardas.com>";
  expect(isValidContactTo(to)).toBe(true);
  expect(isValidContactFrom(from)).toBe(true);
  expect(isValidRuntimeContactConfig({ to, from })).toBe(true);
  const payload = createResendPayload(
    {
      firstName: "Visitor",
      lastName: "Example",
      company: "Example Co",
      email: "visitor@example.com",
      phone: "+1 555 555 5555",
      industry: "Roofing",
      volume: "50–100",
      crm: "",
      message: "",
      website: "",
    },
    { to, from },
  );
  expect(payload.to).toBe(to);
  expect(payload.from).toBe(from);
  expect(payload.reply_to).toBe("visitor@example.com");
});

test("trusted runtime addresses are rejected without rewriting", () => {
  expect(isValidContactTo("yurii monardas.com")).toBe(false);
  expect(isValidContactFrom("MONARDAS Leads websitesend.monardas.com")).toBe(false);
});

test("the production configuration produces the exact Resend addresses", () => {
  const payload = createResendPayload(
    {
      firstName: "Visitor",
      lastName: "Example",
      company: "Example Co",
      email: "visitor@example.com",
      phone: "+1 555 555 5555",
      industry: "Roofing",
      volume: "50–100",
      crm: "",
      message: "",
      website: "",
    },
    {
      to: "yurii@monardas.com",
      from: "MONARDAS Leads <website@send.monardas.com>",
    },
  );
  expect({ to: payload.to, from: payload.from, reply_to: payload.reply_to }).toEqual({
    to: "yurii@monardas.com",
    from: "MONARDAS Leads <website@send.monardas.com>",
    reply_to: "visitor@example.com",
  });
});

test("user content is escaped in the Resend HTML body", () => {
  const malicious = `<img src=x onerror=alert(1)> & \"quoted\"`;
  expect(escapeHtml(malicious)).toBe(
    "&lt;img src=x onerror=alert(1)&gt; &amp; &quot;quoted&quot;",
  );
  expect(validate({
    firstName: "Visitor",
    lastName: "Example",
    company: malicious,
    email: "visitor@example.com",
    phone: "+1 555 555 5555",
    industry: "Roofing",
    volume: "50–100",
    crm: "",
    message: malicious,
    website: "",
  })).toEqual({});
  const payload = createResendPayload(
    {
      firstName: "Visitor",
      lastName: "Example",
      company: malicious,
      email: "visitor@example.com",
      phone: "+1 555 555 5555",
      industry: "Roofing",
      volume: "50–100",
      crm: "",
      message: malicious,
      website: "",
    },
    { to: "yurii@monardas.com", from: "MONARDAS Leads <website@send.monardas.com>" },
  );
  expect(payload.html).toContain("&lt;img src=x onerror=alert(1)&gt;");
  expect(payload.html).not.toContain("<img src=x");
});

test("optional backup recipient is a private Bcc, not a second send", () => {
  const data = {
    firstName: "Internal QA",
    lastName: "",
    company: "MONARDAS INTERNAL TEST",
    email: "qa@example.com",
    phone: "",
    industry: "HVAC",
    volume: "",
    crm: "",
    message: "",
    website: "",
  };
  const config = {
    to: "yurii@monardas.com",
    from: "MONARDAS Leads <website@send.monardas.com>",
    backupTo: "backup@example.com",
  };
  expect(isValidRuntimeContactConfig(config)).toBe(true);
  const payload = createResendPayload(data, config);
  expect(payload.to).toBe("yurii@monardas.com");
  expect(payload.bcc).toEqual(["backup@example.com"]);
  expect(payload.reply_to).toBe("qa@example.com");
  expect("bcc" in createResendPayload(data, { to: config.to, from: config.from })).toBe(false);
  expect("bcc" in createResendPayload(data, { ...config, backupTo: "YURII@MONARDAS.COM" })).toBe(false);
  expect(isValidRuntimeContactConfig({ ...config, backupTo: "invalid address" })).toBe(false);
});
