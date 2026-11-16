# MONARDAS commercial-first website — launch brief, 16 November 2026

## Decision
MONARDAS remains the umbrella business brand. Its **public homepage is now a focused B2B entry point** for residential HVAC replacement-estimate follow-up in the U.S.; the long-term ventures/capital/nature strategy remains reachable under *Company*, but is not represented as current operating products.

**Audience**: owner, general manager or sales manager of a U.S. residential HVAC contractor with unsold AC/furnace/heat-pump replacement estimates. Secondary: verified HVAC-facing marketing/CRM agencies for voluntary introductions.

**Key customer job**: *We already paid to acquire and quote the homeowner, but have no dependable owner-approved follow-up and outcome record.*

**Offer**: one selected batch of up to 25 suitable replacement estimates, up to two agreed follow-up actions per estimate, weekly reporting, founder support for 30 days, no charge or automatic renewal; at most two selected U.S. contractor participants. Admission requires mutual fit/availability agreement. No invented guarantee, ROI or case studies. Homeowner PII never goes in website forms. MONARDAS independent homeowner outreach is not permitted without separate signed authorization and compliance/suppression review.

## What changed
- Homepage: specific customer problem → non-fictional description of service → *fictional sample* estimate workflow preview → one dominant free pilot CTA → working interactive demo alternative → three implementation steps → what can be verified → owner/agency routes → FAQ → close.
- Shared header and footer: straightforward "HVAC Solution", "Explore", "For teams", "Company", and **30 days free**. Clear mobile menu and keyboard focus states.
- AI, Current Focus, /pricing, /how-it-works and fictional-data demo now distinguish the limited no-cost founding pilot from optional separately contracted paid work.
- Added narrow event names `home_page_view`, `home_free_pilot_cta_click`, `home_demo_cta_click`, `home_scorecard_cta_click` to existing first-party server logging; event/path only, no identities. Existing global privacy choice and endpoint allowlist remain unchanged.
- Protected existing /api/contact, provider and CRM integrations, outgoing mail and automation settings.

## Inspirations and why
- ServiceTitan's official HVAC page shows immediate **category, industry, outcome and demo** — a useful structural benchmark, not a feature list to copy (https://www.servicetitan.com/industries/hvac-software).
- NNGroup usability heuristics encourage speaking the user's language, predictable controls and minimalist UI (https://www.nngroup.com/articles/ten-usability-heuristics/).
- Recent 2026 comparisons of B2B landing pages show short time-to-form and specific audience messaging, but **published design rankings do not prove which website converts best**. Copy useful structure, not unverifiable customer metrics.
- Unlike mature enterprise SaaS, MONARDAS has no verified portfolio of HVAC outcomes yet; never fabricate reviews, client logos, CRM integrations or recovered sales.

## Devil's-advocate audit
1. **Conversion lift is unproven**. Site aesthetics alone cannot create demand. Track qualified applications and actual decision-maker conversations, not vanity traffic.
2. **Too many options** can slow decisions. Homepage has one primary CTA; product subpages can show tools and FAQs.
3. **The 30-day offer must not look like infinite free service**. Enforce two-contractor cohort and 25-estimate cap operationally. If the cohort is full, change the CTA truthfully before future traffic.
4. **A live demo is not a live CRM deployment**. All demo records are fictional. Make its demo nature explicit at the point of presentation.
5. **Compliance**: no new customer communication channels without legal/consent/suppression controls; do not allow homeowner PII in initial forms.
6. **Risk to current inbound**: no /api/contact change. QA form tests must mock submissions and inspect intent; real delivery requires a separately authorized end-to-end test.

## Release gates
- Source integrity: pin merged Git commit and check Cloudflare worker `monardas` with existing `CONTACT_TO`, `CONTACT_FROM` bindings intact.
- `npm ci`; `tsc --noEmit`; `npm run lint`; `npm run build:vinext`; Playwright.
- Browser: desktop + mobile 375/390/768/1024/1440; no horizontal scroll; axe WCAG; real links, focus states, menu, demo and original pilot forms; no production POST.
- Dry-run Wrangler before any live deploy. Live site routes verify HTTP 200 **and content/CTA**, not status only. After deploy, check forms visually and monitor genuine Gmail lead arrival (not simulated delivery).
- Keep prior Cloudflare deployment for rollback; do not modify Oracle SMTP/Gmail, D1/CRM/Lark, outreach timers or user permissions.

## Revenue funnel & measurement
Visitor → relevant product or demo click → completed *genuine* business application → manually qualified company → invitation to 15-minute owner conversation → substantive reply → conversation held → voluntary free-pilot agreement → agreed start → contractor-verified appointments/sales → optional paid continuation.

Basic reporting: visitors, free-pilot CTA clicks, valid non-test delivered applications, owner meetings accepted/held, pilots agreed/started, independently verified business outcomes. Distinguish SMTP or form-provider acceptance from actual inbox receipt. Never infer qualified lead or commercial success from a click.

### Next experiment, after real traffic
Measure 1–2 weeks' traffic, source quality and funnel abandonment before changing copy. Form hypotheses for first headline and CTA, measure qualified application **rate** by traffic source rather than clicks alone; avoid claiming statistical significance with tiny samples.
