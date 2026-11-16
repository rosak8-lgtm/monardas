# MONARDAS HVAC conversion redesign — release and sales QA (2026-11-16)

## Goal and scope
Improve the visitor path **HVAC business owner → understand the problem → check fit → apply for a 30-day free founding pilot → qualify manually → 15-minute owner conversation → voluntary pilot agreement → verified business outcome**. The redesign is scoped to the HVAC offer, its free-pilot landing page and the existing real free-pilot contact form. Corporate pages, jobs/tours projects, API delivery transport and outbound automation remain unchanged.

## What is real
- The existing `/hvac/free-pilot`, `/hvac/scorecard`, `/hvac/demo`, `/contact?intent=hvac-free-pilot`, `/contact?intent=agency-partner` and `/hvac#system` routes are used. No new dead-end pages.
- The free pilot offers 30 calendar days, **up to two selected U.S. residential HVAC businesses**, **up to 25 suitable unsold replacement estimates**, **up to two mutually agreed follow-up actions per estimate**, weekly reporting, zero automatic payments, and no automatic transition to a paid service. Selection, qualification and final scope are subject to manual agreement.
- Homeowners are contacted by the contractor's authorized staff. MONARDAS homeowner outreach requires separate signed authorization, lawful channel eligibility and suppression checks.
- The illustration is explicitly illustrative, with no invented recovered revenue, performance metrics, client quotes or unverifiable claims.
- The separate paid founder-led 25–50 estimate offering is labeled distinctly from the limited free cohort.

## Actual visitor routes
1. Hero **Apply — 30 days free** → `/hvac/free-pilot` → `/contact?intent=hvac-free-pilot` → existing validated `/api/contact` (same delivery transport).
2. **Take the 3-minute check** → `/hvac/scorecard`. The check works in the visitor's browser and does not upload homeowner PII.
3. Six action cards: free pilot, scorecard, fictional interactive demo, workflow, agency inquiry and FAQ anchor. All destinations are real.
4. Contact form keeps existing validation, honeypot, duplicate-submit lock, status messaging and privacy wording.

## Measurement: do not confuse signals with sales
- Existing privacy-respecting Workers log events include `hvac_page_view` and `hvac_scorecard_cta_click`.
- New event identifiers `hvac_free_pilot_cta_click` and `hvac_agency_cta_click` record only **click intent**, on path `/hvac`; no company identity or homeowner data is included.
- A CTA click is **not** a submitted form, an accepted Resend request is **not** confirmed Gmail receipt, and a received message is **not** a qualified pilot or recovered job.
- Primary commercial KPI: confirmed owner conversations and **voluntarily started pilots**; secondary indicators: qualified form submissions and CTA-to-form conversion. Report actual data, never inferred revenue.

## Acceptance gates
- GitHub QA: TypeScript, ESLint, vinext production build, Playwright growth tests including all six new links, 390/768/1440px overflow, WCAG axe smoke, pilot/agency form intent and FAQ anchor.
- Existing `/api/contact` must remain unmodified and tested with mocked writes; never submit a live QA lead or expose homeowner data.
- Review final page on desktop and mobile; check links, scroll behavior, accessible focus, honest claims, no unverified social proof.
- Verify complete live routes after publish; do not infer Cloudflare deployment from a GitHub commit alone.

## Release from operator's own environment — explicit production action
The PR itself is NOT production. After merging reviewed changes into `main`, with the user's existing Wrangler credentials on their workstation:
```bash
set -Eeuo pipefail
git checkout main
git pull --ff-only origin main
npm ci --no-audit --no-fund
npx --no-install tsc --noEmit
npm run lint
npm run build:vinext
npx --no-install playwright test --config playwright.growth.config.ts
npx --no-install wrangler deploy --config dist/server/wrangler.json --keep-vars --dry-run
# Only after reviewing all the preceding PASS results:
npx --no-install wrangler deploy --config dist/server/wrangler.json --keep-vars
curl -fIL --max-time 20 https://monardas.com/hvac
curl -fIL --max-time 20 https://monardas.com/hvac/free-pilot
curl -fIL --max-time 20 https://monardas.com/hvac/scorecard
curl -fIL --max-time 20 'https://monardas.com/contact?intent=hvac-free-pilot'
```
Do not run on a workstation with uncommitted changes or without confirming the correct Cloudflare account/Worker `monardas` and runtime CONTACT_TO/CONTACT_FROM bindings. No auto-send, no mailer, D1, Lark or CRM changes. Keep the previous Cloudflare deployment available for rollback.

## Devil's advocate findings
- Six routes help exploration, but the **free-pilot CTA** must remain visually dominant; monitor whether extra choices reduce application rate.
- Never advertise *proven* revenue recovery or imply that conceptual dashboard art is actual client data.
- The greatest conversion bottleneck may be **distribution/quality of inbound traffic**, not just design. After launch, compare one-week periods of visitors, pilot clicks, **real** qualified applications, owner conversations and pilots. Do not conclude a win from click-through alone.
- Do not merge if inbound form breaks or if accessibility regresses.
