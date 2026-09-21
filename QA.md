# MONARDAS verification — September 20, 2026

## Results

- `npm run lint`: passes, no errors or warnings.
- `npm run build`: passes compilation, TypeScript validation and generation of 24 static outputs. Public content pages are prerendered; the contact API is dynamic.
- Production Playwright suite: **5/5 passed**. It covers all 16 public routes and all 96 route/viewport combinations (375, 390, 430, 768, 1024 and 1440px), internal links, metadata, browser errors, keyboard/mobile navigation, calculator limits, reduced motion and form validation.
- Automated axe WCAG A/AA scans: no violations on the 16 pages or expanded mobile navigation. This is automated coverage, not a claim of complete WCAG conformance.
- Development API: successful local validation; malformed JSON, invalid objects, missing fields, invalid industry, invalid phone, oversized fields, honeypot, request size, cross-origin and wrong media-type checks passed.
- Development browser form: successful validation with explicit confirmation that no message was sent or stored.
- Production API: intentionally returns 503 with an honest explanation that delivery is not configured.
- npm installation/audit after the PostCSS override: **0 vulnerabilities reported**.
- Manual visual inspection: desktop and mobile home, AI, Nature, Strategy and Contact; full homepage layout at desktop/mobile widths.
- Content scan: no Lorem Ipsum, astrology, fabricated testimonials or unsupported medical-claim language. Capital explicitly excludes third-party advisory, brokerage and asset management.

## Lighthouse

Production server on localhost, Microsoft Edge 153, Lighthouse 13.5, default simulated mobile conditions. Local results are not a production field-performance guarantee.

| Page | Performance | Accessibility | Best Practices | SEO | LCP | CLS |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Homepage | 98 | 100 | 100 | 100 | 2.3 s | 0.001 |
| Monardas AI | 98 | 100 | 100 | 100 | 2.3 s | 0.015 |

Both pages measured 1.2 s FCP and 70 ms total blocking time in the final audit with local font assets. The reports retain non-blocking observations about framework polyfills, render-blocking resources, dependency chains, reflow and back/forward cache restoration. All requested score targets were met.

HTML/JSON reports and visual captures are in ignored `qa-reports/`. Reproduce with a production server running at port 3000 and `node scripts/lighthouse.mjs`; port 9223 must be free. `node scripts/visual-check.mjs` refreshes the visual captures.

## Fixed during QA

- Removed the heading opacity fade, which briefly reduced text contrast during entry. Restrained positional motion remains and respects reduced motion.
- Fixed validation of omitted empty select values and strengthened phone/CRM validation.
- Fixed local browser submissions when Next's development server normalizes `127.0.0.1` to `localhost` internally; origin validation now compares the actual HTTP host.
- Increased small interface labels to at least 10px.
- Applied a compatible patched PostCSS 8.x dependency override.
- Removed lint warnings and the implicit metadata-base warning.

## Launch requirements and known limitations

- Set `NEXT_PUBLIC_SITE_URL` before the release build for public canonical, sitemap and social-image URLs. Local builds deliberately avoid inventing a public domain.
- Configure a real lead-delivery backend before enabling production contact submissions; finalize privacy and terms. Both legal routes are clearly labeled placeholders and are noindex.
- This checkout contains no botanical product pages, catalog URL inventory, cart or checkout. Do not replace an existing store deployment until its routes and purchase flow have been mapped and preserved. No product URL redirects were introduced.
- Fonts are now bundled locally with open-font licenses, removing build/development font-download requirements. Initial dependency downloads used the system CA trust store with TLS verification maintained.
- npm reported ESLint 9 as deprecated and noted an unapproved optional `unrs-resolver` install script. Lint and build work without enabling it. Playwright prints an environment-only NO_COLOR/FORCE_COLOR warning under RTK.
- No deployment was performed; no external lead delivery is claimed.
