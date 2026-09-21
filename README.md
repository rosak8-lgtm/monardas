# MONARDAS

The existing Next.js App Router project, continued as an editorial corporate website with a focused home-services revenue recovery offer. TypeScript, Tailwind CSS 4, React 19 and Next.js 15. Geist and Instrument Serif are packaged locally with their open-font licenses and self-hosted through `next/font/local`.

## Run locally

```sh
npm ci
npm run dev
```

Open **http://127.0.0.1:3000**. Production preview: `npm run build`, then `npm run start -- --hostname 127.0.0.1`.

This workspace's RTK instruction can be followed with `rtk proxy npm run dev` (and the same prefix for other commands).

## Cloudflare Workers (vinext)

The Workers setup follows [Cloudflare's existing Next.js project guide](https://developers.cloudflare.com/workers/framework-guides/web-apps/nextjs/) and runs alongside the original Next.js scripts. Use Node.js 22 or newer and `npm ci` to install the locked dependencies.

```sh
npm run dev:vinext
npm run build:vinext
npm run start:vinext -- --port 3001
```

The vinext development server uses port 3001. `start:vinext` previews the production bundle locally in the Workers runtime; run it after building, with the development server stopped.

`next.config.ts` places the original Next.js build in `.next/nextjs`. This keeps Next's generated route validators separate from vinext's `.next/types` files, allowing both toolchains to coexist. `next dev`, `next build`, and `next start` all use this configuration automatically.

`vite.config.ts` connects vinext's App Router RSC and SSR environments to the Cloudflare Vite plugin. `wrangler.jsonc` names the Worker `monardas`, enables `nodejs_compat`, and binds the generated client assets. The build writes `dist/client` and `dist/server`, including `dist/server/wrangler.json`. Pages and `/api/contact` run through the Worker; this is not a static export. No KV, external cache, or Cloudflare Images binding is required by this application.

Cloudflare build command:

```sh
npm run build:vinext
```

Cloudflare deploy command (run only when ready to publish):

```sh
npm run deploy
```

The deploy script uses the installed `vinext-cloudflare deploy --config dist/server/wrangler.json`, equivalent to the guide's `npx @vinext/cloudflare deploy` with the generated configuration selected explicitly. It builds before publishing. After a separate successful build, `npm run deploy -- --skip-build` reuses that output. `npm run deploy -- --dry-run` only validates configuration and does not build or publish.

Set the existing public `NEXT_PUBLIC_SITE_URL` build variable to the confirmed production origin before the Cloudflare build, as described below. Authenticate with Cloudflare separately when actually deploying; no credentials or secrets are stored in this project. Local Workers variable files (`.dev.vars*`) and generated output are ignored by Git.

The contact handler uses standard `Request`, `URL`, Web Crypto, and `fetch` APIs plus vinext's `NextResponse` compatibility layer. It reads `RESEND_API_KEY`, `CONTACT_TO`, and `CONTACT_FROM` from Cloudflare's runtime environment and sends validated submissions through Resend. The API key is a Cloudflare secret and is never stored in this repository.

For browser verification against the built Worker, set `QA_BASE_URL=http://127.0.0.1:3001` in the shell and run `npm run test:e2e`. Use `QA_DEV=1` only when checking the development server. The original `npm run build` still performs the Next.js production build and TypeScript validation.

To check the contact development adapter directly, set `QA_BASE_URL=http://localhost:3001` while `dev:vinext` is running, then run `node scripts/check-dev-api.mjs`. This exercises valid submissions, validation errors, the honeypot, payload limits, origin checks, and content-type checks without sending or storing a lead.

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
- `src/components/contact-form.tsx`, `src/lib/contact.ts`, `src/app/api/contact/route.ts`: client/server validation and Resend lead delivery.
- `src/app/globals.css`: responsive editorial design system, focus states and reduced-motion support.
- `src/lib/pages.ts`, `src/lib/seo.ts`: route descriptions and metadata.

## Calculator assumptions

Unsold estimates = monthly estimates × (1 − close rate).

Reopened opportunities = unsold estimates × possible reactivation rate.

Illustrative revenue opportunity = reopened opportunities × average job value.

The last amount is an upper-bound scenario assuming **every reopened opportunity closes**. It excludes recovery costs. The UI distinguishes re-engagement from booked revenue and states that actual results vary. Fractional values represent a model, not individual jobs.

## Contact behavior

The endpoint validates input and sends accepted submissions to Resend. It returns success only after Resend accepts the email, and returns a generic 5xx response when delivery configuration or the provider is unavailable. It does not log personal details or expose provider errors. The API key remains a Cloudflare secret; the non-secret recipient and sender variables are kept in `wrangler.jsonc` for deployment consistency.

## Deployment gates

1. Set `NEXT_PUBLIC_SITE_URL` to the confirmed HTTPS corporate origin **before building**. Without it, canonicals are omitted, the sitemap is empty and social-image URLs use the explicit local development origin. No public domain is guessed.
2. Publish approved privacy/terms. The current legal pages are intentionally labeled placeholders.
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
