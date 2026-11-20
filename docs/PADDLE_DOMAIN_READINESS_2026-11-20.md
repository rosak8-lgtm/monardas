# MONARDAS — Paddle domain review readiness (2026-11-20)

This branch adds accessible SaaS/product availability and legal pages to the Next.js project.

## The truth about the current offer
- MONARDAS is a Georgian sole trader, Individual Entrepreneur Iurii Shalygin, registration code 312796356.
- The current 30-day founding HVAC pilot is $0 and does not convert to a paid subscription.
- Paid software subscriptions are *not live* and no live Paddle checkout is connected.
- Optional human-led consulting/implementation requires a separate agreement and is **not** sold as SaaS through Paddle.
- All demo data are fictional. No real sales or customer accounts are claimed.
- No payout keys, Payoneer credentials, webhooks or Paddle secrets are included.

## Paths to verify after building and deploying the correct product domain
- / — factual HVAC SaaS landing
- /pricing — current $0 pilot and prelaunch software status
- /terms — identifies sole trader and contractual constraints
- /privacy — inquiry data and first-party measurement
- /refund-policy — $0 pilot, future cancellation and refunds
- /hvac/demo — fictional-data product demo
- /contact — working business inquiry

## Absolute blockers before Paddle submission
1. **Domain conflict:** public indexing of https://monardas.com shows an older PrestaShop store selling botanical goods. A real direct browser/DNS check must determine which origin is served today and whether the Next.js site can safely be published to this domain. Do not overwrite the store or repoint DNS blindly.
2. **Paid catalog:** no active priced B2B SaaS product. A final subscription price is *not* fabricated in code. Publish the genuine product, price, availability, renewal/cancellation terms before accepting money.
3. **Verification:** complete Paddle's website review and personal identity verification as a Georgian-registered sole trader. Acceptance is Paddle's decision.
4. **Payouts:** use existing Payoneer only after Paddle approves its account ownership, payout-country and payout-currency details. Wise Business setup fee is unpaid and not a current dependency.
5. **Runtime:** check Cloudflare deployment route, HTTPS status, all links and contact delivery. This branch does not deploy anything or alter DNS.
6. **Legal review:** English privacy/terms/refunds reflect the inspected source behavior, but local professional review and confirmations of retention, consumer-rights implications and third-party practices are still appropriate.

## Paddle form values *only when publicly reachable*
- Web domain: the confirmed HTTPS host serving this software, **not** an unrelated storefront.
- Pricing page: https://HOST/pricing
- Terms of service: https://HOST/terms
- Privacy policy: https://HOST/privacy
- Refund policy: https://HOST/refund-policy

No URL here has been verified live. Do not enter these as working URLs until 200/HTTPS/visible nav have been checked in browser.

References:
- https://www.paddle.com/help/start/account-verification/what-is-domain-verification
- https://developer.paddle.com/build/go-live-checklist/
