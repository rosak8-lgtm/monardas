import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import { transpileModule, ModuleKind } from "typescript";
import * as challenges from "../src/lib/marketing-optin.ts";
import * as receipts from "../src/lib/marketing-consent-receipt.ts";

const secret = "OFFLINE_TEST_ONLY_" + "x".repeat(64);
const segment = "c0729422-ded7-4bc6-bef9-a4d591aa2818";
const email = "qa@example.org";
const base = "https://api.resend.com/contacts";
const contact = base + "/" + encodeURIComponent(email);
const path = "https://monardas.com/api/marketing/confirm";
const source = transpileModule(readFileSync("src/app/api/marketing/confirm/route.ts", "utf8"), {
  compilerOptions: { module: ModuleKind.CommonJS },
}).outputText;

function harness({ missingDb = false, initialStatus = 200, unsubscribed = false,
  enrollmentStatus = 200, finalUnsubscribed = false, hasMembership = true,
  membershipStatus = 200 } = {}) {
  const records = new Map();
  const calls = [];
  const db = { prepare(sql) { return { bind(...args) { return { async run() {
    if (sql.startsWith("INSERT")) {
      if (records.has(args[0])) return { success: true, meta: { changes: 0 } };
      records.set(args[0], "PENDING");
      return { success: true, meta: { changes: 1 } };
    }
    if (sql.startsWith("UPDATE") && records.get(args[0]) === "PENDING") {
      records.set(args[0], "CONFIRMED");
      return { success: true, meta: { changes: 1 } };
    }
    throw Error("unexpected DB operation");
  } }; } }; } };
  let reads = 0;
  const env = { MARKETING_OPTIN_SECRET: secret, RESEND_CONTACTS_API_KEY: "offline-key",
    RESEND_OPTIN_SEGMENT_ID: segment, ...(missingDb ? {} : { MARKETING_DB: db }) };
  const exports = {};
  const modules = {
    "cloudflare:workers": { env },
    "@/lib/marketing-optin": challenges,
    "@/lib/marketing-consent-receipt": receipts,
  };
  const json = (body, status = 200) => new Response(JSON.stringify(body), {
    status, headers: { "Content-Type": "application/json" },
  });
  runInNewContext(source, {
    exports, require(name) { if (!(name in modules)) throw Error(name); return modules[name]; },
    URL, URLSearchParams, Response, process: { env: {} },
    fetch: async (url, init) => {
      calls.push([url, init.method]);
      assert.equal(init.headers.Authorization, "Bearer offline-key");
      if (url === contact && init.method === "GET") {
        reads++;
        if (reads === 1) return json({ id: "test-contact", unsubscribed }, initialStatus);
        return json({ id: "test-contact", unsubscribed: finalUnsubscribed });
      }
      if ((url === base || url === contact + "/segments/" + segment) && init.method === "POST")
        return json({ id: "test-contact" }, enrollmentStatus);
      if (url === base + "/test-contact/segments" && init.method === "GET")
        return json({ data: hasMembership ? [{ id: segment }] : [] }, membershipStatus);
      throw Error("unexpected provider request");
    },
  });
  return { ...exports, calls, records };
}
const makeToken = () => challenges.makeOptInChallenge(email, "QA", secret);
const post = (h, token) => h.POST(new Request(path, { method: "POST",
  headers: { "Content-Type": "application/x-www-form-urlencoded" },
  body: new URLSearchParams({ token }) }));
test("opening the confirmation link alone never enrolls", async () => {
  const h = harness();
  assert.equal((await h.GET(new Request(path + "?token=" + await makeToken()))).status, 200);
  assert.equal(h.calls.length, 0);
  assert.equal(h.records.size, 0);
});
test("confirmed active membership finalizes exactly one receipt", async () => {
  const h = harness();
  const token = await makeToken();
  assert.equal((await post(h, token)).status, 200);
  assert.deepEqual([...h.records.values()], ["CONFIRMED"]);
  assert.equal((await post(h, token)).status, 409);
  assert.equal(h.records.size, 1);
});
test("new contact verified after creation", async () => {
  const h = harness({ initialStatus: 404, enrollmentStatus: 201 });
  assert.equal((await post(h, await makeToken())).status, 200);
  assert.deepEqual([...h.records.values()], ["CONFIRMED"]);
});
for (const [name, opts, expected] of [
  ["missing database", { missingDb: true }, 503],
  ["globally unsubscribed contact", { unsubscribed: true }, 409],
  ["provider unavailable", { initialStatus: 503 }, 503],
  ["enrollment rejected", { enrollmentStatus: 422 }, 503],
  ["conflict without verified membership", { enrollmentStatus: 409, hasMembership: false }, 503],
  ["membership lookup unavailable", { membershipStatus: 503 }, 503],
  ["unsubscribed after enrollment", { finalUnsubscribed: true }, 503],
]) {
  test(name + " never finalizes consent", async () => {
    const h = harness(opts);
    assert.equal((await post(h, await makeToken())).status, expected);
    assert.ok(![...h.records.values()].includes("CONFIRMED"));
  });
}
test("malformed and expired challenges never touch provider", async () => {
  const h = harness();
  assert.equal((await post(h, "invalid")).status, 400);
  const expired = await challenges.makeOptInChallenge(email, "QA", secret, Date.now() - 49 * 60 * 60 * 1000);
  assert.equal((await post(h, expired)).status, 400);
  assert.equal(h.calls.length, 0);
  assert.equal(h.records.size, 0);
});
