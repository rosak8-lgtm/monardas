# MONARDAS – confirmed opt-in intake (Draft PR, 23 Nov 2026)

Updates the current main-branch contact form without resetting HVAC free-pilot, agency-partner or preferred reply-channel behavior. Previous PR #17 is merge-conflicted and remains undeployed.

## Mechanics
- Optional unchecked checkbox requests marketing updates, only when NEXT_PUBLIC_TURNSTILE_SITE_KEY is configured.
- Current business enquiry is accepted separately from optional marketing verification.
- Same-origin plus server-side Cloudflare Turnstile Siteverify must pass before sending the marketing confirmation email. Missing secrets fail closed.
- Email sent through Resend is provider-accepted only, not proven inbox delivery.
- Recipient opens email link, then explicitly presses the POST confirmation button; GET is read-only to prevent scanner subscriptions.
- Short-lived 48h AES-GCM challenge uses a separate Worker-only MARKETING_OPTIN_SECRET.
- Confirmed contacts are added only to a designated Resend segment. Existing unsubscribed contacts are never silently reactivated.
- No import of third-party public contacts, scraped emails, CRM HOLD rows, or old Oracle lists; no campaign or SMTP send.

## Deployment gates before merging
1. Create Turnstile widget restricted to monardas.com and configure NEXT_PUBLIC_TURNSTILE_SITE_KEY at build time and TURNSTILE_SECRET_KEY as a server-side Cloudflare Worker secret.
2. Generate independent random 32+ char MARKETING_OPTIN_SECRET, server-only, and set RESEND_OPTIN_SEGMENT_ID (the existing confirmed opt-in segment). Keep RESEND_API_KEY server-only.
3. Configure Cloudflare WAF rate limiting for POST /api/contact and /api/marketing/confirm; test abuse and forged requests. Turnstile alone is not an unlimited anti-abuse guarantee.
4. Test staging: all three intents, preferred channels, challenge email, no-send on failed Turnstile, GET read-only, POST confirmed enrollment, unsubscribed rejection, 48h token expiry and Resend segment membership.
5. Run CI Node 24 token tests, TypeScript, eslint; Cloudflare preview; review privacy notices and unsubscribes before production deployment.
6. A separate, permission-based Oracle bridge is needed; current Resend confirmed opt-in segment had 0 contacts on Nov23. Do not sync unverified leads automatically.

## Relation to Oracle CAP75
Existing sender already supports up to 75 unique provider attempts per run, but owner latest Oracle audit showed only 30 READY and 45 missing eligible candidates. New opt-in cannot promise 45 new people in hours. Never convert public business websites or unapproved PG rows into opted-in recipients. Oracle delivery terms prohibit bulk unsolicited emails lacking preexisting relationships.

References:
https://www.oracle.com/application-development/email-delivery/faq/
https://developers.cloudflare.com/turnstile/get-started/server-side-validation/
https://resend.com/docs/api-reference/segments/list-segment-contacts