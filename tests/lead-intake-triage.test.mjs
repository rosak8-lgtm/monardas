import test from 'node:test';
import assert from 'node:assert/strict';
import { triageLead } from '../scripts/lead-intake-triage.mjs';

test('qualifies a 25–50 estimate inquiry for human assessment only', () => {
  const result = triageLead({ intent:'hvac-pilot', industry:'HVAC', volume:'40', crm:'ServiceTitan', companyWebsite:'example.org' });
  assert.equal(result.volume_band, '25_to_50');
  assert.equal(result.next_action, 'MANAGER_REVIEW_FREE_ASSESSMENT');
  assert.equal(result.outbound_send_authorized, false);
  assert.equal(result.payment_requested, false);
});
test('does not infer marketing consent or issue an offer', () => {
  const result = triageLead({ intent:'hvac-pilot', industry:'HVAC', volume:'25', consent:true });
  assert.equal(result.marketing_consent, 'NOT_ESTABLISHED');
  assert.equal(result.offer_status, 'NOT_PROPOSED');
  assert.equal(result.duplicate_status, 'UNKNOWN');
});
test('prevents copying personal information into manager summary', () => {
  const secret = 'secret-customer-token@example.com';
  const result = triageLead({ firstName:secret, email:secret, message:secret, crm:secret, companyWebsite:secret, volume:'100' });
  assert.equal(JSON.stringify(result).includes(secret), false);
});
test('invalid volumes remain unknown', () => {
  for (const volume of ['','-1','1000001','25.5','NaN']) {
    assert.equal(triageLead({volume}).volume_band, 'unknown');
  }
});
test('rejects array and null inputs', () => {
  assert.throws(() => triageLead(null), TypeError);
  assert.throws(() => triageLead([]), TypeError);
});
test('does not mutate input', () => {
  const lead = {intent:'hvac-pilot', volume:'30', industry:'HVAC'};
  const before = JSON.stringify(lead);
  triageLead(lead);
  assert.equal(JSON.stringify(lead), before);
});
