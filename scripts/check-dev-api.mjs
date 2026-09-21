import assert from "node:assert/strict";
const base = "http://127.0.0.1:3000";
const valid = {
  firstName: "QA",
  lastName: "Operator",
  company: "Test Company",
  email: "test@example.com",
  phone: "+1 555 123 4567",
  industry: "Roofing",
  volume: "50–100",
  crm: "CSV export",
  message: "Local verification only",
  website: "",
};
async function send(body, options = {}) {
  return fetch(`${base}/api/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...options.headers },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}
const success = await send(valid);
assert.equal(success.status, 201);
assert.match((await success.json()).message, /No message was sent or stored/);
assert.equal((await send(valid, { headers: { Origin: base } })).status, 201);
for (const body of [
  "{",
  null,
  [],
  { email: "invalid" },
  { ...valid, industry: "Fake industry" },
  { ...valid, phone: "-------" },
  { ...valid, crm: "x".repeat(201) },
  { ...valid, website: "spam.example" },
])
  assert.equal((await send(body)).status, 400);
assert.equal(
  (await send({ ...valid, message: "x".repeat(13000) })).status,
  413,
);
assert.equal(
  (await send(valid, { headers: { Origin: "https://unrelated.example" } }))
    .status,
  403,
);
assert.equal(
  (await send(valid, { headers: { "Content-Type": "text/plain" } })).status,
  415,
);
console.log(
  "Development API: valid request, malformed payloads, missing fields, invalid selections, phone validation, field lengths, honeypot, size limit, origin and media type checks passed.",
);
