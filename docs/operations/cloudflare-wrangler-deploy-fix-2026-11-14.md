# MONARDAS Cloudflare deploy adapter compatibility / 2026-11-14

## Observed incident
User's live Ubuntu run at commit 4b32286f581fef5e96791945a46387a9bc3fad94:
- npm ci, TypeScript, ESLint, vinext build, Playwright 5/5: PASS.
- Live URL /hvac/scorecard: HTTP 404 before deployment.
- Authenticated with Wrangler.
- Original deploy command `vinext-cloudflare deploy --config dist/server/wrangler.json` crashed before upload with a Node ESM missing-export error: `usesVinextCacheWarmupStatus`.
- `package-lock.json` installs `vinext@1.4.4` and `@vinext/cloudflare@1.0.0-beta.8`. The old adapter calls a symbol missing from that newer vinext internal module.

## Scoped fix
Switch the project's existing `deploy:vinext` and `deploy` scripts to:
```
wrangler deploy --config dist/server/wrangler.json --keep-vars
```
This uses Wrangler's supported prebuilt Worker route and bypasses the incompatible `@vinext/cloudflare/dist/deploy.js` CLI. It does not upgrade dependencies, regenerate the project or alter app code. `--keep-vars` is to preserve Dashboard-defined plain-text environment variables; Cloudflare states secrets are not removed by deploy.

## Release gate
1. Install exactly lockfile via `npm ci`.
2. Run TypeScript, lint, `npm run build:vinext`.
3. Validate generated `dist/server/wrangler.json` name, main, assets and inbound sender/recipient bindings.
4. Run `wrangler deploy --config dist/server/wrangler.json --keep-vars --dry-run` (no production writes).
5. Deploy only after success and with owner-side Wrangler credentials, and then independently check HTTPS /hvac, /hvac/scorecard, /contact.
6. If public URL remains 404 after Wrangler deploy, investigate Worker custom-domain route, not another blind deployment. No SMTP or cron changes here.

## Concurrent MONARDAS outreach
On the same date, independent Oracle SMTP run obtained **3 provider acceptances** for Ritmas, ServiceWand and The HVAC Edge, each with unique Message-ID. The ledger state is SMTP_ACCEPTED_NOT_DELIVERED. This deploy fix MUST NOT run the OCI campaign script again or alter send approvals/suppression.
