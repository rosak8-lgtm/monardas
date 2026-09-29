# Sales and merchant readiness

Current service: founder-led, manually scoped B2B HVAC Unsold Replacement Estimate Recovery pilot. One current offer, not a self-service SaaS or active subscription.

## Owner information and decisions — central TODO list

- Confirm the exact legal classification/name to use on proposals, invoices and merchant applications against the official Georgian registration. The public site currently identifies Iurii Shalygin in Georgia; it does not claim a verified legal entity type. Keep private identifiers and addresses out of this repository.
- Confirm with an appropriate Georgian professional whether the registered activity covers the current B2B service. Do not change official facts to fit a processor application.
- Obtain processor acceptance for the actual managed-pilot business model and Georgian operator before integrating checkout. Site copy alone does not establish eligibility.
- Before charging for a pilot, approve its scope, price, timing, payment schedule, cancellation/refund terms and lawful record-sharing/outreach arrangements in the proposal/order. No fixed commercial terms have been invented on the site.

## Processor fit is not yet confirmed

Paddle explicitly says human-services businesses are not a good fit and prohibits human services unrelated to a software offering:
https://www.paddle.com/help/start/intro-to-paddle/what-am-i-not-allowed-to-sell-on-paddle

Dodo prohibits manual digital services where most value is human labour; marketing/outreach tools may also require review:
https://docs.dodopayments.com/miscellaneous/merchant-acceptance

FastSpring and 2Checkout acceptance has not been established. Do not describe the service as automated software merely to qualify. No processor, checkout, subscription or billing integration is installed.

## Minimal funnel measurement

The public offer is a Free Estimate Recovery Assessment. `hvac_audit_cta_click` and `hvac_audit_submit_success` remain legacy internal identifiers for event continuity. The existing `#audit` anchors, `audit-contact` CSS class and `RecoveryAudit` component name are also retained for compatibility; they are not commercial labels.

No new provider, database or Cloudflare binding. Existing Workers Logs receive JSON records with `type=monardas_funnel`, event and page path only:

- `hvac_page_view`
- `hvac_audit_cta_click` (HVAC links to the pilot assessment form, including deeper pilot CTAs)
- `contact_form_view`
- `hvac_audit_submit_success` (server-side, only after Resend acceptance, not mailbox delivery)

Filter those records in Cloudflare Workers Observability/Logs and group by event over the same time range. These are event counts, not unique visitors or a joined visitor journey. Repeat visits, blocked requests, bot events and log retention affect totals; they are not a financial reporting system. Client events are untrusted. Analytics failure must not block a lead.

Campaign labels and landing-page/referrer-origin context are kept in tab session storage and copied into inquiry emails. The server sanitizes them. No form entries or unique IDs are stored in the browser. Do not put personal information into UTM labels. DNT/GPC opt-out is respected where exposed by the browser/request. No consent-compliance claim is made.

## Release checks

The www-to-apex 308 redirect is implemented in src/middleware.ts to preserve pathname and query parameters in both Next and vinext. Cloudflare/DNS settings are unchanged. This branch does not publish changes; recheck the redirect, form and event logs after an approved deployment. Real email delivery testing requires separate authorization.
