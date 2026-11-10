# MONARDAS outbound evidence review

Scope: offline, read-only investigation of mail-delivery notifications. This is not a sender, migration, opt-out override, provider authorization, or approval to restart outreach.

## Components

- scripts/outbound-evidence-gate.mjs — fail-closed 10-factor review. It cannot authorize a send.
- scripts/dsn_evidence_review.py — classifies a locally supplied original EML using exact matched message/delivery-status blocks.
- tests/outbound-evidence-gate.test.mjs — 12 isolated Node tests.
- tests/test_dsn_evidence_review.py — 16 synthetic Python tests.

## Run from repository root

Node: node --test tests/outbound-evidence-gate.test.mjs

Python: PYTHONDONTWRITEBYTECODE=1 python3 -B -m unittest -v tests/test_dsn_evidence_review.py

Original EML, if available: python3 -B scripts/dsn_evidence_review.py --eml /local/private/notice.eml --recipient actual-recipient@example.com

Do not commit original EML files, private contact details, or SMTP credentials. The CLI does not print recipients, raw SMTP diagnostics, relays, or Message-ID. It cannot independently verify authenticity of an EML.

## Production restrictions

- Historical BOUNCE records remain unchanged.
- Keep known bad or disputed recipients suppressed.
- A 4.x.x or prose-only notice is not proof of a permanent failed recipient, but remains a HOLD pending review.
- A 5.7.x policy rejection does not necessarily indicate an invalid address. Investigate the sender/provider reputation and outbound relay.
- Only independent trusted live release authorization can permit sending. These tools always return HOLD_NO_SEND/canSend false.
- RECORDED_D1 is a local bookkeeping marker, not proof of inbox delivery.

## Evidence limitations

As of November 10, 2026, the three historical BOUNCE addresses and the global deliverability HOLD are unchanged. The bridge's latest known report (Nov 7) contained promoted:0. The 16 regression cases use synthetic message fixtures plus screenshot-derived scenario labels; the three original Lark EML records have not been independently parsed. Reclassification or resumption must not be based on screenshots, this CLI's output alone, or a test pass.
