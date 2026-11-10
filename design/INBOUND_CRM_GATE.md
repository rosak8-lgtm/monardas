# MONARDAS inbound CRM: proposed gate (not deployed)

The current production website receives a valid form and uses Resend to notify
the operator. It DOES NOT guarantee durable CRM persistence or exactly-once
notifications. The proposed ledger in `design/inbound-ledger-schema.sql` is an
isolated design artifact and is NOT bound to the Cloudflare Worker or live D1.

## Contract for a later implementation

1. Validate the submission server-side, including origin, field lengths,
   honeypot, rate limits and tenant authorization. Do not accept arbitrary
   tenant IDs from browsers.
2. Mint a cryptographically random submission token in a protected, rate-limited
   flow; scope it to the authorized tenant. The server stores only
   HMAC-SHA256(secret, canonical tenant + submission token), not raw keys.
   Canonical payload digest also uses a *separate domain-separated HMAC key*.
   Do not log raw tokens, payloads or digests. Use a secret rotation policy.
3. Within one database transaction, insert receipt and one review-outbox item.
   On unique conflict retrieve and compare the keyed payload digest: identical
   means retry; changed payload means conflict. Do not replace a prior lead.
4. Only acknowledge durable acceptance after the transaction commits. Distinguish
   'accepted into CRM' from 'notification delivered'.
5. Dispatch outbox records via an authenticated worker; use bounded leases,
   retries, provider idempotency where supported and reconciliation of ambiguous
   provider responses. Do not assume exactly-once email delivery.
6. Link to customer contact data only through a separately designed encrypted,
   access-controlled data store with retention/deletion rules and audit logs.
   Until that store exists, this schema CANNOT replace the current lead mailbox.
7. Keep marketing opt-in distinct from answering a direct inbound request.
   Never change outbound HVAC sender gates or opt-out/suppression checks.

## Acceptance before integration

- Verify SQL and rollback using `python3 -m unittest -v tests/test_inbound_ledger_schema.py`.
- Design authenticated manager access, appropriate privacy notice, retention,
  duplicate scope and recovery after provider outages.
- Review Worker runtime binding, schema deployment, backup and rollback plan.
- Test concurrent duplicates, token collisions, idempotent retries and failures
  between database commit and Resend acceptance, with mocked providers.
- Deploy only after an explicit release review; do not execute this SQL against
  existing production D1 or SQLite databases.
