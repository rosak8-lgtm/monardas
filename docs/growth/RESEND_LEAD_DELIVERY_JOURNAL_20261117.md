# MONARDAS Resend delivery journal — staged, not deployed

Goal: know whether a **website notification email** was delivered, delayed, bounced, failed, complained about, or suppressed. An HTTP 201 from the website/contact form only means the provider accepted the email. It does **not** prove Lark inbox receipt, a qualified customer, a booking, or payment.

This PR introduces:
- A signed, raw-body Svix webhook handler at POST /api/resend-webhook.
- Source/recipient filtering to exclude unrelated commercial outreach.
- A Cloudflare D1 migration and event-ID deduplication with an atomic two-statement batch.
- Tests for signature tampering, timestamp expiry, disabled configuration, and database failure.
- No storage of customer email addresses, form contents, subject lines, or full webhook payloads.

## Deliberately disabled until reviewed

This PR does **not** add an active webhook in Resend, a Cloudflare D1 binding in wrangler, an API secret in Git, send any email, or deploy changes. When either RESEND_WEBHOOK_SECRET or LEAD_DELIVERY_DB is missing, requests return HTTP 503 instead of falsely reporting that an event has been stored.

## Activation checklist (separate approval)

1. Review and merge only after repository CI and staging checks pass.
2. Provision a D1 database; apply migrations/0001_lead_delivery_events.sql.
3. Bind the database with the exact name LEAD_DELIVERY_DB in the Worker deployment.
4. Add RESEND_WEBHOOK_SECRET through Cloudflare encrypted secrets (never commit it to Git).
5. Deploy, configure a Resend webhook for email.delivered, email.delivery_delayed, email.bounced, email.failed, email.complained, email.suppressed, directed to https://monardas.com/api/resend-webhook.
6. Validate with a signed provider test webhook, inspect webhook retries, then reconcile a matching Resend email_id against D1. Do not send real test marketing messages.

This is a **delivery-event journal**, not the durable Lead CRM: actual inbound details remain in the separately operated Lark V2/V3 local queue. A later approved phase must make the original website lead durable and reconcile by provider email_id. Do not represent local QA or a Resend delivery event as a paying client.

Documentation: https://resend.com/changelog/managing-webhooks-via-api and https://resend.com/changelog/webhook-event-visibility.
