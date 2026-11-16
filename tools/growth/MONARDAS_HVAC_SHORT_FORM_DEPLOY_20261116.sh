#!/usr/bin/env bash
# MONARDAS / 30-day founder-supported HVAC 3-field application WEB-ONLY release. Clean clone from pinned main, fresh build,
# Wrangler dry-run then real deploy only when public free founder pilot page is not already live.
# Does NOT invoke Oracle, SMTP, SSH, systemd, cron, CRM, git reset or git clean.
set -Eeuo pipefail
umask 077

ROOT="$HOME/Загрузки"
REPO_URL='https://github.com/rosak8-lgtm/monardas.git'
EXPECTED_MAIN='fd32f0baf2443d97e78e1839eea4055b9d343428'
PUBLIC_URL='https://monardas.com/contact?intent=hvac-free-pilot'
NODE24_DIR="$HOME/monardas-cloudflare-backup/_node24/install/bin"
mkdir -p "$ROOT"
LOCK="$ROOT/.monardas-hvac-short-form-deploy-20261116.lock"
exec 9>"$LOCK"
if ! flock -n 9; then echo 'STOP: WEBSITE_DEPLOY_ALREADY_RUNNING'; exit 2; fi
LOG_DIR="$(mktemp -d "$ROOT/MONARDAS_HVAC_SHORT_FORM_RELEASE_20261116.XXXXXXXX")"
WORK="$LOG_DIR/repo"
echo "PRIVATE_LOG_FOLDER=$LOG_DIR"

fail() {
  local step="$1" code="$2" logfile="${3:-}"
  echo "STOP: $step"
  if [ -n "$logfile" ] && [ -s "$logfile" ]; then
    echo "=== LAST_DIAGNOSTIC_LINES: $step ==="
    tail -n 25 "$logfile" | sed -E 's/(Bearer |Authorization: |API[_-]?TOKEN[=: ]+)[^ ]+/\1[REDACTED]/Ig' || true
  fi
  echo "WEBSITE_DEPLOY_STATUS=FAILED exit=$code"
  echo "LOG_FOLDER=$LOG_DIR"
  exit "$code"
}

if [ -x "$NODE24_DIR/node" ] && [ -x "$NODE24_DIR/npm" ] && [ -x "$NODE24_DIR/npx" ]; then
  export PATH="$NODE24_DIR:$PATH"
fi
for cmd in curl git npm node npx flock; do
  command -v "$cmd" >/dev/null || fail "MISSING_EXECUTABLE_$cmd" 2
done
node -e 'if (Number(process.versions.node.split(".")[0])<24)process.exit(24)' || fail 'NODE_24_REQUIRED' 2

# Check content markers for the 30-day founder-support route. HTTP200 alone is not sufficient:
# Cloudflare can serve an unrelated fallback page with HTTP200.
probe_founder_pilot() {
  local file="$1" code
  code="$(curl --location --silent --show-error --max-redirs 4 --connect-timeout 10 \
    --max-time 35 --output "$file" --write-out '%{http_code}' \
    "$PUBLIC_URL" 2>"$LOG_DIR/http-errors.log")" || code='UNREACHABLE'
  echo "SHORT_FORM_HTTP=$code"
  if [ "$code" = '200' ] && grep -Fqi 'Apply for the Free 30-Day Pilot' "$file" \
    && grep -Fqi 'Optional: website, CRM, phone and other details' "$file" \
    && grep -Fqi 'Work email' "$file"; then
    return 0
  fi
  return 1
}

if probe_founder_pilot "$LOG_DIR/before.html"; then
  echo "LIVE_SHORT_FORM_VERIFIED=$PUBLIC_URL"
  echo 'WEBSITE_DEPLOY_STATUS=SUCCESS_ALREADY_LIVE'
  echo 'NO_DEPLOY_NEEDED; NO_ORACLE_SMTP; NO_TIMER_CHANGES'
  exit 0
fi

echo '=== FRESH ISOLATED CLONE / EXACT PINNED MAIN ==='
git clone --quiet --depth 1 --branch main "$REPO_URL" "$WORK" >"$LOG_DIR/git-clone.log" 2>&1 \
  || fail 'FRESH_GIT_CLONE_FAILED' 3 "$LOG_DIR/git-clone.log"
cd "$WORK"
SOURCE_COMMIT="$(git rev-parse HEAD)"
echo "SOURCE_COMMIT=$SOURCE_COMMIT"
[ "$SOURCE_COMMIT" = "$EXPECTED_MAIN" ] || fail 'REMOTE_MAIN_SHA_CHANGED_STOP_STALE_RELEASE' 3
node --input-type=module <<'JS' || fail 'DEPLOY_SCRIPT_IS_NOT_APPROVED_WRANGLER' 3
import fs from 'node:fs';
const p = JSON.parse(fs.readFileSync('package.json','utf8'));
const required = 'wrangler deploy --config dist/server/wrangler.json --keep-vars';
if(p.scripts?.['deploy:vinext']!==required || p.scripts?.deploy!==required) process.exit(1);
console.log('WRANGLER_DEPLOY_SCRIPT_VERIFIED=PASS');
JS

echo '=== DETERMINISTIC PACKAGE INSTALL + BUILD / SOURCE VALIDATION ==='
npm ci --no-audit --no-fund >"$LOG_DIR/npm-ci.log" 2>&1 \
  || fail 'NPM_CI_FAILED' 4 "$LOG_DIR/npm-ci.log"
echo 'NPM_CI=PASS'
npx --no-install tsc --noEmit >"$LOG_DIR/typecheck.log" 2>&1 \
  || fail 'TYPECHECK_FAILED' 4 "$LOG_DIR/typecheck.log"
echo 'TYPECHECK=PASS'
npm run lint >"$LOG_DIR/lint.log" 2>&1 \
  || fail 'LINT_FAILED' 4 "$LOG_DIR/lint.log"
echo 'LINT=PASS'
npm run build:vinext >"$LOG_DIR/build.log" 2>&1 \
  || fail 'VINEXT_BUILD_FAILED' 4 "$LOG_DIR/build.log"
echo 'VINEXT_BUILD=PASS'
# The full growth test suite passed on GitHub Actions (9 tests), but additionally
# exercise it on the owner's local built app. Never touch production from tests.
npx --no-install playwright test --config playwright.growth.config.ts \
  >"$LOG_DIR/e2e.log" 2>&1 || fail 'GROWTH_E2E_FAILED' 5 "$LOG_DIR/e2e.log"
echo 'GROWTH_E2E=PASS'

CFG='dist/server/wrangler.json'
[ -s "$CFG" ] && [ -s 'dist/server/index.js' ] \
  || fail 'BUILT_WORKER_FILES_MISSING' 5
node --input-type=module <<'JS' || fail 'PRODUCTION_WORKER_SCOPE_GUARD_FAILED' 5
import fs from 'node:fs';
import path from 'node:path';
const config = 'dist/server/wrangler.json';
const c = JSON.parse(fs.readFileSync(config,'utf8'));
const parent=path.dirname(config);
if(c.name !== 'monardas') throw Error('WRONG_WORKER_NAME');
if(c.vars?.CONTACT_TO !== 'yurii@monardas.com') throw Error('WRONG_CONTACT_RECIPIENT');
if(!String(c.vars?.CONTACT_FROM||'').includes('website@send.monardas.com')) throw Error('WRONG_CONTACT_SENDER');
if(typeof c.main!=='string' || !fs.existsSync(path.resolve(parent,c.main))) throw Error('MISSING_MAIN');
if(typeof c.assets?.directory!=='string' || !fs.existsSync(path.resolve(parent,c.assets.directory))) throw Error('MISSING_ASSETS');
console.log('PRODUCTION_WORKER_SCOPE_GUARD=PASS');
JS

# Do not deploy an earlier commit if main changes while building.
LATEST_MAIN="$(git ls-remote origin refs/heads/main | awk '{print $1}')" || fail 'CANNOT_RECHECK_MAIN' 6
[ "$LATEST_MAIN" = "$EXPECTED_MAIN" ] || fail 'MAIN_ADVANCED_DURING_BUILD_STOP_STALE_DEPLOY' 6

echo '=== DEPLOY DRY-RUN (NO REMOTE WRITES) ==='
npx --no-install wrangler deploy --config "$CFG" --keep-vars --dry-run --outdir .wrangler/deploy-qa \
  >"$LOG_DIR/dryrun.log" 2>&1 || fail 'WRANGLER_DRY_RUN_FAILED' 6 "$LOG_DIR/dryrun.log"
echo 'WRANGLER_DRY_RUN=PASS'
npx --no-install wrangler whoami >"$LOG_DIR/wrangler-auth.log" 2>&1 \
  || fail 'CLOUDFLARE_AUTH_FAILED' 6 "$LOG_DIR/wrangler-auth.log"
echo 'CLOUDFLARE_AUTH=PASS'

# Another process might have published while this clean clone was being built.
if probe_founder_pilot "$LOG_DIR/recheck.html"; then
  echo "LIVE_SHORT_FORM_VERIFIED=$PUBLIC_URL"
  echo 'WEBSITE_DEPLOY_STATUS=SUCCESS_ALREADY_LIVE'
  echo 'NO_DEPLOY_NEEDED; NO_ORACLE_SMTP; NO_TIMER_CHANGES'
  exit 0
fi

echo '=== REAL CLOUDFLARE DEPLOY / WEB ONLY ==='
npx --no-install wrangler deploy --config "$CFG" --keep-vars \
  >"$LOG_DIR/deploy.log" 2>&1 || fail 'WRANGLER_DEPLOY_FAILED' 7 "$LOG_DIR/deploy.log"
echo 'WRANGLER_DEPLOY=PASS'
echo '=== VERIFY CUSTOM DOMAIN ROUTE ==='
for n in 1 2 3 4 5 6; do
  if probe_founder_pilot "$LOG_DIR/after-$n.html"; then
    echo "LIVE_SHORT_FORM_VERIFIED=$PUBLIC_URL"
    echo 'WEBSITE_DEPLOY_STATUS=SUCCESS'
    echo 'NO_ORACLE_SMTP; NO_TIMER_CHANGES; NO_REPEAT_OF_PARTNER_MESSAGES'
    echo "LOG_FOLDER=$LOG_DIR"
    exit 0
  fi
  [ "$n" -ge 6 ] || sleep 4
 done
echo 'WRANGLER_UPLOADED_BUT_SHORT_FORM_ROUTE_NOT_VERIFIED'
echo 'CHECK_CLOUDFLARE_WORKER_ROUTE_OR_CDN; DO_NOT_BLINDLY_REDEPLOY_OR_RESEND_MAIL'
echo "LOG_FOLDER=$LOG_DIR"
exit 8
