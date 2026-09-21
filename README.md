# MONARDAS

The existing Next.js App Router project, continued as an editorial corporate website with a focused home-services revenue recovery offer. TypeScript, Tailwind CSS 4, React 19 and Next.js 15. Geist and Instrument Serif are packaged locally with their open-font licenses and self-hosted through `next/font/local`.

## Run locally

```sh
npm ci
npm run dev
```

Open **http://127.0.0.1:3000**. Production preview: `npm run build`, then `npm run start -- --hostname 127.0.0.1`.

This workspace's RTK instruction can be followed with `rtk proxy npm run dev` (and the same prefix for other commands).

## Routes

- Corporate: `/`, `/systems`, `/ventures`, `/capital`, `/commerce`, `/nature`, `/strategy`, `/founder`.
- Commercial: `/ai`, `/roofing`, `/hvac`, `/how-it-works`, `/pricing`, `/contact`.
- Legal placeholders: `/privacy`, `/terms` (both noindex).
- Metadata: `/robots.txt`, `/sitemap.xml`, `/opengraph-image`, `/icon.svg`.

All pre-existing public routes remain available. There are no ecommerce routes or checkout integration in this directory.

## Architecture

- `src/components/header.tsx`: keyboard-accessible desktop disclosures and mobile navigation.
- `src/components/site.tsx`: server-rendered layout, editorial sections and reusable flows.
- `src/components/company-page.tsx`: distinct company narratives and page composition.
- `src/components/ai-page.tsx`: commercial recovery workflow and pilot offer.
- `src/components/system-map.tsx`: lightweight original SVG architecture visual.
- `src/components/calculator.tsx`: bounded interactive scenario model.
- `src/components/contact-form.tsx`, `src/lib/contact.ts`, `src/app/api/contact/route.ts`: client/server validation and local demonstration endpoint.
- `src/app/globals.css`: responsive editorial design system, focus states and reduced-motion support.
- `src/lib/pages.ts`, `src/lib/seo.ts`: route descriptions and metadata.

## Calculator assumptions

Unsold estimates = monthly estimates × (1 − close rate).

Reopened opportunities = unsold estimates × possible reactivation rate.

Illustrative revenue opportunity = reopened opportunities × average job value.

The last amount is an upper-bound scenario assuming **every reopened opportunity closes**. It excludes recovery costs. The UI distinguishes re-engagement from booked revenue and states that actual results vary. Fractional values represent a model, not individual jobs.

## Contact behavior

The development endpoint validates input and logs only a random submission ID and timestamp. It does **not** store, email or deliver contact details. The UI states this explicitly. In production it returns HTTP 503 without accepting a lead. A real delivery provider, durable storage or delivery confirmation, abuse controls and finalized privacy notice are prerequisites for enabling live submissions.

## Deployment gates

1. Set `NEXT_PUBLIC_SITE_URL` to the confirmed HTTPS corporate origin **before building**. Without it, canonicals are omitted, the sitemap is empty and social-image URLs use the explicit local development origin. No public domain is guessed.
2. Configure live lead delivery and publish approved privacy/terms. The current legal pages are intentionally labeled placeholders.
3. Inventory the existing botanical store's exact indexed product/category URLs, product metadata, cart, checkout, account and payment routes. They are not present here. Preserve them through the existing storefront or an explicitly reviewed routing integration before replacing any homepage. No ecommerce URL rewrites or redirects have been added.
4. Confirm content, product availability and commercial pilot terms with the operator. No customers, acquired businesses, returns or operating metrics are invented.

Fonts are bundled under `src/app/fonts`, so development and builds do not need Google Fonts network access. Dependency installation still needs the npm registry; on Windows networks with an enterprise CA, Node's `--use-system-ca` option can use the system trust store without disabling TLS verification.

## Verification

```sh
npm run lint
npm run build
npm run test:e2e
```

Run the browser suite against a production server at port 3000. Playwright uses the installed Microsoft Edge browser. `QA_BASE_URL` can select another server. Set `QA_DEV=1` when testing the local development API instead of its intentional production 503 response.

The suite checks all 16 public pages, unique metadata, internal links, WCAG A/AA automated rules, browser errors, all requested viewport widths (375, 390, 430, 768, 1024, 1440), keyboard/mobile navigation, calculator edge cases, reduced motion and form behavior. Screenshots are written to ignored `test-results/`. Automated accessibility checks do not replace manual assistive-technology review.

The PostCSS override applies a patched compatible 8.x release to the existing Next.js dependency tree. Browser testing and Lighthouse packages are development-only.
