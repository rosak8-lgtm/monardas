# MONARDAS — confirmed opt-in receipt gate (draft / not deployed)

The CRM recipient supply is the bottleneck, not OCI sender capacity. The last live OCI audit (23 Nov 2026, 14:17 UTC) showed **30** sender-eligible new recipients and **45** more needed to attempt 75; 45 public-research addresses were held, and the designated Resend verified-opt-in segment had **0 members**.

This change improves *future* voluntary subscriber intake. It does **not** send emails, migrate public research contacts, create subscriptions, or guarantee 75 provider-accepted messages per day.

## Consent evidence and data minimization

The user voluntarily checks a previously unchecked marketing option on /contact; a valid Turnstile challenge and a separate 48h email confirmation token must precede the POST button press. The confirmation endpoint now rejects requests if the dedicated Cloudflare D1 database binding MARKETING_DB is missing. The outgoing challenge from /api/contact is also suppressed until that binding is configured.

On confirmed human POST, the API checks global Resend unsubscribe state, then atomically inserts a one-time PENDING receipt in D1 with a SHA-256 token digest, keyed HMAC of normalized email, token issue time, server confirmation time, the consent disclosure version, action 'explicit_button_post' and Resend segment ID. Only after re-reading the active Resend contact and verifying explicit membership in the intended segment does it change the receipt to CONFIRMED. Missing membership, including an incomplete page of results, fails closed. A rejected provider call leaves PENDING and does **not** prove subscription. Replays of the same token do not generate new subscriptions.

The database table never holds plaintext email or raw confirmation token. Keep the MARKETING_OPTIN_SECRET server-only, restrict D1 access, define a consent withdrawal process and a retention policy before go-live.

## Mandatory owner-controlled deployment gates

1. Create a dedicated Cloudflare D1 database and bind it as MARKETING_DB to the MONARDAS Worker. Apply migrations/0001_marketing_optin_receipts.sql. The owner-created database ID is now configured in the draft branch. The owner reported executing the migration in D1 Console; verify the live schema before deployment.
2. Set valid NEXT_PUBLIC_TURNSTILE_SITE_KEY at build time, TURNSTILE_SECRET_KEY and independently generated MARKETING_OPTIN_SECRET as Cloudflare Worker secrets, and RESEND_OPTIN_SEGMENT_ID pointing to the designated confirmed segment. Set a separate server-only RESEND_CONTACTS_API_KEY with the required contact management permissions; preserve the existing RESEND_API_KEY for transactional sending. Do not paste either key into chat or commit them to Git.
3. Set rate limiting for POST /api/contact and POST /api/marketing/confirm. Confirm domain allowlist and anti-replay behavior.
4. Run all CI and Cloudflare staging integration tests with both existing, unsubscribed and never-seen test addresses. Confirm that missing D1, failed Turnstile, failed Resend, forged token, expired token, repeated POST, and unsubscribed addresses never produce a CONFIRMED record.
5. Review updated privacy notice, server logging, cross-border processing and deletion/opt-out protocol. Activate the route in production only after those checks.
6. Do not expose D1, HMAC secret or raw tokens to the OCI production sender. Build a separately authorized, audited one-way receipt-verification mechanism that checks active Resend subscription, a CONFIRMED receipt, prior Lark and OCI/legacy ledgers, suppression and sender rules under the shared lock before any candidate becomes READY.

## Provider constraints

Oracle OCI Email Delivery disallows bulk unsolicited communications to recipients without pre-existing relationships: https://www.oracle.com/application-development/email-delivery/faq/
Resend disallows unsolicited cold outreach: https://resend.com/legal/acceptable-use

No mechanism can guarantee *exactly* 75 unique SMTP acceptances on each date if less than 75 genuinely eligible people exist or provider delivery fails. The cap is a safety maximum, not evidence of email sending.
