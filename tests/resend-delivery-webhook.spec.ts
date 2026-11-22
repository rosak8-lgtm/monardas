import { test, expect } from "@playwright/test";
import { createHmac, randomBytes } from "node:crypto";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import { ModuleKind, transpileModule } from "typescript";
import { normalizedLeadDelivery, verifyResendWebhook } from "../src/lib/resend-delivery-webhook";

const websiteFrom = "MONARDAS Leads <website@send.monardas.com>";
const recipient = "yurii@monardas.com";
const emailId = "01a1e4f4-fcee-76a1-ac13-e774d4c2a564";
const webhookId = "msg_1234567890abcdef";
const secret = "whsec_" + randomBytes(32).toString("base64");
const payload = {
  type: "email.delivered",
  created_at: "2026-11-17T12:00:00.000Z",
  data: {
    from: websiteFrom,
    to: [recipient],
    email_id: emailId,
    subject: "Private example company name must never enter the ledger",
  },
};

function signedHeaders(body: string, timestamp = Math.floor(Date.now() / 1000)) {
  const signature = createHmac("sha256", Buffer.from(secret.slice(6), "base64"))
    .update(webhookId + "." + timestamp + "." + body).digest("base64");
  return new Headers({
    "svix-id": webhookId,
    "svix-timestamp": String(timestamp),
    "svix-signature": "v1," + signature,
  });
}

function mockDb() {
  const events = new Map<string, unknown>();
  const latest = new Map<string, { eventType: string; eventTime: string }>();
  let fail = false;
  return {
    events, latest,
    setFail(value: boolean) { fail = value; },
    prepare(sql: string) {
      return { bind(...args: unknown[]) { return { sql, args }; } };
    },
    async batch(stmts: Array<{ args: unknown[] }>) {
      if (fail) throw Error("DB_ERROR");
      const [id, mail, kind, time] = stmts[0].args as string[];
      if (!events.has(id)) events.set(id, { mail, kind, time });
      const [mail2, kind2, time2] = stmts[1].args as string[];
      if (!latest.has(mail2) || time2 > latest.get(mail2)!.eventTime)
        latest.set(mail2, { eventType: kind2, eventTime: time2 });
    },
  };
}

function routeWithEnv(db: ReturnType<typeof mockDb>, override: Record<string, unknown> = {}) {
  const env = {
    RESEND_WEBHOOK_SECRET: secret,
    LEAD_DELIVERY_DB: db,
    CONTACT_FROM: websiteFrom,
    CONTACT_TO: recipient,
    ...override,
  };
  const moduleExports: { POST?: (req: Request) => Promise<Response> } = {};
  const source = readFileSync("src/app/api/resend-webhook/route.ts", "utf8");
  const output = transpileModule(source, { compilerOptions: { module: ModuleKind.CommonJS } }).outputText;
  runInNewContext(output, {
    exports: moduleExports,
    require: (name: string) => {
      if (name === "cloudflare:workers") return { env };
      if (name === "@/lib/resend-delivery-webhook") return { normalizedLeadDelivery, verifyResendWebhook };
      throw Error("Unexpected import " + name);
    },
    process: { env: {} }, Response, Request, TextEncoder, JSON, Number,
  });
  return moduleExports.POST!;
}

function request(body: string, headers = signedHeaders(body)) {
  return new Request("https://monardas.com/api/resend-webhook", { method: "POST", body, headers });
}

test("Resend Svix signatures reject tampering and expired timestamps", async () => {
  const body = JSON.stringify(payload);
  expect(await verifyResendWebhook(body, signedHeaders(body), secret)).toMatchObject({ webhookId });
  expect(await verifyResendWebhook(body + "!", signedHeaders(body), secret)).toBeNull();
  expect(await verifyResendWebhook(body, signedHeaders(body, Math.floor(Date.now() / 1000) - 3600), secret)).toBeNull();
});

test("only website delivery for the business inbox is retained", () => {
  expect(normalizedLeadDelivery(payload, webhookId, websiteFrom, recipient)?.emailId).toBe(emailId);
  expect(normalizedLeadDelivery(payload, webhookId, websiteFrom, "other@example.com")).toBeNull();
  expect(normalizedLeadDelivery({ ...payload, type: "email.opened" }, webhookId, websiteFrom, recipient)).toBeNull();
  expect(normalizedLeadDelivery({ ...payload, data: { ...payload.data, from: "sales@send.monardas.com" } }, webhookId, websiteFrom, recipient)).toBeNull();
});

test("webhook route is disabled unless fully configured", async () => {
  const db = mockDb();
  const route = routeWithEnv(db, { RESEND_WEBHOOK_SECRET: null });
  expect((await route(request(JSON.stringify(payload)))).status).toBe(503);
});

test("signed event is logged once, tampering fails closed, DB error requests retry", async () => {
  const db = mockDb();
  const route = routeWithEnv(db);
  const body = JSON.stringify(payload);
  const headers = signedHeaders(body);
  expect((await route(request(body, headers))).status).toBe(204);
  expect(db.events.size).toBe(1);
  expect(db.latest.get(emailId)?.eventType).toBe("email.delivered");
  expect((await route(request(body, headers))).status).toBe(204);
  expect(db.events.size).toBe(1);
  expect((await route(request(body + "x", headers))).status).toBe(401);
  db.setFail(true);
  const second = JSON.stringify({ ...payload, data: { ...payload.data, email_id: "01a1e4f4-fcee-76a1-ac13-e774d4c2a565" } });
  expect((await route(request(second))).status).toBe(503);
});
