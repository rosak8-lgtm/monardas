import test from "node:test";
import assert from "node:assert/strict";
import { storeInboundReceipt, IntakeConflict } from "../src/lib/inbound-receipt-d1.ts";

// Minimal transactional D1-shaped fake, not a replacement for live D1 tests.
class FakeStatement {
  constructor(db, sql, values = []) { this.db=db; this.sql=sql; this.values=values; }
  bind(...values) { return new FakeStatement(this.db, this.sql, values); }
  async first() {
    const [tenant, digest] = this.values;
    return this.db.receipts.find(r => r.tenant_key === tenant && r.submission_key_digest === digest) ?? null;
  }
}
class FakeD1 {
  constructor() { this.receipts=[]; this.outbox=[]; this.failOutbox=false; }
  prepare(sql) { return new FakeStatement(this, sql); }
  async batch(statements) {
    const receiptSnapshot=this.receipts.map(x=>({...x}));
    const outboxSnapshot=this.outbox.map(x=>({...x}));
    try {
      for (const s of statements) {
        if (s.sql.includes("INSERT INTO inbound_receipts")) {
          const [id,tenant_key,submission_key_digest,payload_digest,received_at,triage_code] = s.values;
          if (!this.receipts.some(r => r.tenant_key === tenant_key && r.submission_key_digest === submission_key_digest))
            this.receipts.push({id,tenant_key,submission_key_digest,payload_digest,received_at,triage_code});
        } else if (s.sql.includes("INSERT INTO inbound_review_outbox")) {
          if(this.failOutbox) throw new Error("simulated outbox failure");
          const [id,created_at,tenant_key,submission_key_digest,payload_digest,triage_code]=s.values;
          const receipt=this.receipts.find(r => r.tenant_key===tenant_key &&
            r.submission_key_digest===submission_key_digest &&
            r.payload_digest===payload_digest && r.triage_code===triage_code);
          if(receipt && !this.outbox.some(o=>o.receipt_id===receipt.id))
            this.outbox.push({id,receipt_id:receipt.id,created_at});
        } else throw new Error("Unknown statement");
      }
      return [];
    } catch (error) {
      this.receipts=receiptSnapshot;
      this.outbox=outboxSnapshot;
      throw error;
    }
  }
}
const secret="synthetic-test-secret-value-at-least-32-bytes";
const data={
  tenantKey:"test-tenant",
  submissionToken:"random-synthetic-submission-token-1234",
  canonicalPayload:JSON.stringify({company:"Synthetic",email:"internal@example.invalid"}),
  triageCode:"HVAC_PILOT",
};
test("creates one receipt and one review job", async()=>{
  const db=new FakeD1();
  const result=await storeInboundReceipt(db,data,secret);
  assert.equal(result.status,"CREATED");
  assert.equal(db.receipts.length,1);
  assert.equal(db.outbox.length,1);
  assert.ok(result.notificationQueued);
});
test("same submission is replayed without duplicated job", async()=>{
  const db=new FakeD1();
  const first=await storeInboundReceipt(db,data,secret);
  const second=await storeInboundReceipt(db,data,secret);
  assert.equal(second.status,"REPLAY");
  assert.equal(second.receiptId,first.receiptId);
  assert.equal(db.receipts.length,1);
  assert.equal(db.outbox.length,1);
});
test("same token with a changed payload fails closed",async()=>{
  const db=new FakeD1();
  await storeInboundReceipt(db,data,secret);
  await assert.rejects(
    storeInboundReceipt(db,{...data,canonicalPayload:'{"changed":true}'},secret),
    IntakeConflict,
  );
  assert.equal(db.receipts.length,1);
  assert.equal(db.outbox.length,1);
});
test("tenant scope separates equal submission tokens",async()=>{
  const db=new FakeD1();
  const a=await storeInboundReceipt(db,data,secret);
  const b=await storeInboundReceipt(db,{...data,tenantKey:"other-tenant"},secret);
  assert.notEqual(a.receiptId,b.receiptId);
  assert.equal(db.receipts.length,2);
});
test("simulated outbox failure rolls back receipt",async()=>{
  const db=new FakeD1(); db.failOutbox=true;
  await assert.rejects(storeInboundReceipt(db,data,secret));
  assert.equal(db.receipts.length,0);
  assert.equal(db.outbox.length,0);
});
test("short secret and token are rejected before any write",async()=>{
  const db=new FakeD1();
  await assert.rejects(storeInboundReceipt(db,data,"short"));
  await assert.rejects(storeInboundReceipt(db,{...data,submissionToken:"short"},secret));
  assert.equal(db.receipts.length,0);
});
test("PII and raw submission token never appear in receipt records",async()=>{
  const db=new FakeD1();
  await storeInboundReceipt(db,data,secret);
  const stored=JSON.stringify(db.receipts);
  assert.ok(!stored.includes("internal@example.invalid"));
  assert.ok(!stored.includes(data.submissionToken));
});
