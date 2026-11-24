import test from "node:test";
import assert from "node:assert/strict";
import { makeOptInChallenge, verifyOptInChallenge, normalizeOptInEmail, resolveMarketingTarget } from "../src/lib/marketing-optin.ts";
const secret = "A-long-unpredictable-test-only-marketing-signing-secret-0123456789";

test("email normalization rejects invalid input", () => {
  assert.equal(normalizeOptInEmail(" ABC@Example.org "), "abc@example.org");
  assert.equal(normalizeOptInEmail("bad@"), null);
});
test("challenge verifies only with correct key", async () => {
  const token = await makeOptInChallenge("Customer@Example.org", "Alex", secret, 1000);
  const value = await verifyOptInChallenge(token, secret, 2000);
  assert.equal(value?.email, "customer@example.org");
  assert.equal(value?.firstName, "Alex");
  assert.equal(await verifyOptInChallenge(token, secret + "wrong", 2000), null);
});
test("expired future and malformed challenges are rejected", async () => {
  const token = await makeOptInChallenge("person@example.org", "P", secret, 1000);
  assert.equal(await verifyOptInChallenge(token, secret, 1000 + 48 * 60 * 60 * 1000 + 1), null);
  assert.equal(await verifyOptInChallenge(token, secret, 999), null);
  assert.equal(await verifyOptInChallenge("wrong", secret, 2000), null);
});
test("signing secret is required", async () => {
  await assert.rejects(() => makeOptInChallenge("person@example.org", "P", "short"), /SECRET_NOT_CONFIGURED/);
});
test("each challenge uses a fresh random IV", async () => {
  const a = await makeOptInChallenge("person@example.org", "P", secret, 1000);
  const b = await makeOptInChallenge("person@example.org", "P", secret, 1000);
  assert.notEqual(a, b);
});

test("release modes are fail-closed and QA links cannot become live", async () => {
  const base = { MARKETING_OPTIN_SECRET: secret,
    RESEND_OPTIN_SEGMENT_ID: "c0729422-ded7-4bc6-bef9-a4d591aa2818",
    MARKETING_QA_SEGMENT_ID: "dfef2b7a-a2f9-4e35-a578-b9466d900eea",
    MARKETING_QA_EMAIL: "owner@example.org" };
  const origin = "https://monardas.com";
  assert.equal(resolveMarketingTarget(base, origin), null);
  assert.equal(resolveMarketingTarget({ ...base, MARKETING_OPTIN_MODE: "qa" }, "https://preview.example.org"), null);
  assert.equal(resolveMarketingTarget({ ...base, MARKETING_OPTIN_MODE: "qa", MARKETING_QA_SEGMENT_ID: base.RESEND_OPTIN_SEGMENT_ID }, origin), null);
  const qa = resolveMarketingTarget({ ...base, MARKETING_OPTIN_MODE: "qa" }, origin);
  const live = resolveMarketingTarget({ ...base, MARKETING_OPTIN_MODE: "live" }, origin);
  assert.equal(qa.qaEmail, "owner@example.org");
  assert.notEqual(qa.segmentId, live.segmentId);
  const token = await makeOptInChallenge(qa.qaEmail, "QA", qa.challengeSecret);
  assert.ok(await verifyOptInChallenge(token, qa.challengeSecret));
  assert.equal(await verifyOptInChallenge(token, live.challengeSecret), null);
});
