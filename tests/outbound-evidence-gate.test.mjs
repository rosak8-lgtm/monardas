import test from "node:test";
import assert from "node:assert/strict";
import { evaluateOutboundEvidence, REQUIRED_EVIDENCE } from "../scripts/outbound-evidence-gate.mjs";

const fullyReviewed = () => Object.fromEntries(REQUIRED_EVIDENCE.map(key => [key, "PASS"]));

test("no evidence fails closed with every blocker", () => {
  const result = evaluateOutboundEvidence();
  assert.equal(result.status, "HOLD_NO_SEND");
  assert.equal(result.blockers.length, REQUIRED_EVIDENCE.length);
  assert.equal(result.canSend, false);
});
test("all evidence present still requires independent live authorization", () => {
  const result = evaluateOutboundEvidence(fullyReviewed());
  assert.equal(result.status, "EVIDENCE_COMPLETE_REVIEW_REQUIRED");
  assert.equal(result.canSend, false);
  assert.equal(result.blockers.length, 0);
});
test("sender health HOLD blocks the queue", () => {
  const result = evaluateOutboundEvidence({...fullyReviewed(), senderHealth:"HOLD"});
  assert.deepEqual(result.blockers, ["GLOBAL_SENDER_HOLD"]);
});
test("SMTP permission must be confirmed per provider", () => {
  const result = evaluateOutboundEvidence({...fullyReviewed(), providerPermission:"UNKNOWN"});
  assert.deepEqual(result.blockers, ["PROVIDER_PERMISSION_NOT_CONFIRMED"]);
});
test("missing suppression cannot be inferred clear", () => {
  const e=fullyReviewed(); delete e.suppressionClear;
  assert.ok(evaluateOutboundEvidence(e).blockers.includes("SUPPRESSION_NOT_CONFIRMED"));
});
test("prior activity cannot be inferred clear", () => {
  const result=evaluateOutboundEvidence({...fullyReviewed(), dedupeClear:"UNKNOWN"});
  assert.ok(result.blockers.includes("PREVIOUS_ACTIVITY_NOT_CLEARED"));
});
test("delayed mail blocks repeated sending", () => {
  const result=evaluateOutboundEvidence({...fullyReviewed(), pendingDeliveryClear:"HOLD"});
  assert.ok(result.blockers.includes("PENDING_DELIVERY_UNRESOLVED"));
});
test("public company page does not prove a mailbox", () => {
  const result=evaluateOutboundEvidence({...fullyReviewed(), mailboxVerified:"UNKNOWN"});
  assert.ok(result.blockers.includes("MAILBOX_NOT_VERIFIED"));
});
test("consent or opt-out check is never skipped", () => {
  const result=evaluateOutboundEvidence({...fullyReviewed(), optOutClear:"HOLD"});
  assert.ok(result.blockers.includes("OPT_OUT_NOT_CONFIRMED"));
});
test("invalid or truthy input never passes", () => {
  const result=evaluateOutboundEvidence({...fullyReviewed(), providerPermission:true});
  assert.equal(result.status,"HOLD_NO_SEND");
});
test("rejects array and null inputs", () => {
  assert.throws(()=>evaluateOutboundEvidence(null),TypeError);
  assert.throws(()=>evaluateOutboundEvidence([]),TypeError);
});
test("does not modify input or include PII in output", () => {
  const e=fullyReviewed();
  e.personalEmail="private@example.invalid";
  const initial=JSON.stringify(e);
  const result=evaluateOutboundEvidence(e);
  assert.equal(JSON.stringify(e),initial);
  assert.ok(!JSON.stringify(result).includes("private@example.invalid"));
});
