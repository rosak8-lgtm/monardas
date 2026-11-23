import test from "node:test";
import assert from "node:assert/strict";
import { makeOptInChallenge, verifyOptInChallenge, normalizeOptInEmail } from "../src/lib/marketing-optin.ts";
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
