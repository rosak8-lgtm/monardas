import test from "node:test";
import assert from "node:assert/strict";
import {
  reserveConfirmationReceipt, confirmReceiptAfterSegmentAcceptance,
  tokenDigest, addressDigest, asMarketingReceiptDatabase, CONSENT_DISCLOSURE_VERSION,
} from "../src/lib/marketing-consent-receipt.ts";

const secret = "LOCAL_UNIT_TEST_ONLY_" + "a".repeat(50);
const segment = "c0729422-ded7-4bc6-bef9-a4d591aa2818";
const token = "A".repeat(64);

function fakeDb({ fail = false } = {}) {
  const records = new Map();
  return {
    records,
    prepare(sql) {
      return {
        bind(...args) {
          return {
            async run() {
              if (fail) return { success: false, meta: { changes: 0 } };
              if (sql.startsWith("INSERT")) {
                if (records.has(args[0])) return { success: true, meta: { changes: 0 } };
                records.set(args[0], { token: args[0], email: args[1], state: "PENDING",
                  issue: args[2], date: args[3], disclosure: args[4], segment: args[5] });
                return { success: true, meta: { changes: 1 } };
              }
              if (sql.startsWith("UPDATE")) {
                if (!records.has(args[0]) || records.get(args[0]).state !== "PENDING")
                  return { success: true, meta: { changes: 0 } };
                records.get(args[0]).state = "CONFIRMED";
                return { success: true, meta: { changes: 1 } };
              }
              throw new Error("UNEXPECTED_SQL");
            },
          };
        },
      };
    },
  };
}

test("D1 binding must provide prepare", () => {
  assert.equal(asMarketingReceiptDatabase({}), null);
  assert.equal(asMarketingReceiptDatabase(null), null);
  const db = fakeDb();
  assert.equal(asMarketingReceiptDatabase(db), db);
});
test("normalized email yields stable keyed digest, not raw PII", async () => {
  assert.equal(await addressDigest(" PERSON@example.org ", secret),
    await addressDigest("person@EXAMPLE.org", secret));
  assert.notEqual(await addressDigest("person@example.org", secret),
    await addressDigest("other@example.org", secret));
  await assert.rejects(() => addressDigest("bad@", secret), /INVALID_RECEIPT_INPUT/);
});
test("token digest is deterministic; malformed tokens rejected", async () => {
  assert.equal((await tokenDigest(token)).length, 64);
  assert.equal(await tokenDigest(token), await tokenDigest(token));
  await assert.rejects(() => tokenDigest("nope"), /INVALID_CONFIRMATION_TOKEN/);
});
test("first reservation persists only hashes; token replay is blocked", async () => {
  const db = fakeDb();
  const args = { db, token, email: "A@Example.org", signingSecret: secret,
    segmentId: segment, challengeIssuedMs: 1000 };
  const a = await reserveConfirmationReceipt({ ...args,
    confirmedAt: new Date("2026-11-23T12:00:00Z") });
  assert.equal(a.reserved, true);
  assert.equal(db.records.get(a.tokenHash).state, "PENDING");
  assert.equal(db.records.get(a.tokenHash).disclosure, CONSENT_DISCLOSURE_VERSION);
  assert.equal(JSON.stringify([...db.records.values()]).includes("A@Example.org"), false);
  assert.equal((await reserveConfirmationReceipt(args)).reserved, false);
});
test("provider-accepted enrollment is required to finalize one time", async () => {
  const db = fakeDb();
  const a = await reserveConfirmationReceipt({ db, token, email: "a@example.org",
    signingSecret: secret, segmentId: segment, challengeIssuedMs: 1000 });
  await confirmReceiptAfterSegmentAcceptance(db, a.tokenHash);
  assert.equal(db.records.get(a.tokenHash).state, "CONFIRMED");
  await assert.rejects(() => confirmReceiptAfterSegmentAcceptance(db, a.tokenHash),
    /NOT_PERSISTED/);
});
test("database failure is not interpreted as consent", async () => {
  const db = fakeDb({ fail: true });
  await assert.rejects(() => reserveConfirmationReceipt({ db, token, email: "a@example.org",
    signingSecret: secret, segmentId: segment, challengeIssuedMs: 1000 }), /UNVERIFIED/);
});
test("segment and server timestamps must be valid", async () => {
  const db = fakeDb();
  await assert.rejects(() => reserveConfirmationReceipt({ db, token, email: "a@example.org",
    signingSecret: secret, segmentId: "bad", challengeIssuedMs: 1000 }), /INVALID_CONSENT_SEGMENT/);
  await assert.rejects(() => reserveConfirmationReceipt({ db, token, email: "a@example.org",
    signingSecret: secret, segmentId: segment, challengeIssuedMs: Number.NaN }), /INVALID_CONSENT_SEGMENT/);
});
