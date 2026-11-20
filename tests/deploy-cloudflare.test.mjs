import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync, chmodSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, delimiter } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
const script = fileURLToPath(new URL("../scripts/deploy-cloudflare.mjs", import.meta.url));

function fixture(args = [], makeBuild = true) {
  const dir = mkdtempSync(join(tmpdir(), "monardas-cf-deploy-"));
  const bin = join(dir, "bin");
  const capture = join(dir, "wrangler-args.json");
  mkdirSync(bin);
  const wrangler = join(bin, "wrangler");
  writeFileSync(wrangler, '#!/usr/bin/env node\nrequire("fs").writeFileSync(process.env.WRANGLER_CAPTURE, JSON.stringify(process.argv.slice(2)));\n');
  chmodSync(wrangler, 0o755);
  if (makeBuild) {
    mkdirSync(join(dir, "dist", "server"), { recursive: true });
    writeFileSync(join(dir, "dist", "server", "wrangler.json"), "{}");
  }
  const result = spawnSync(process.execPath, [script, ...args], {
    cwd: dir, encoding: "utf8",
    env: { ...process.env, PATH: bin + delimiter + (process.env.PATH || ""), WRANGLER_CAPTURE: capture },
  });
  let forwarded;
  try { forwarded = JSON.parse(readFileSync(capture, "utf8")); } catch { forwarded = null; }
  rmSync(dir, { recursive: true, force: true });
  return { result, forwarded };
}

test("Cloudflare CI legacy --skip-build reaches Wrangler without invalid flag", () => {
  const { result, forwarded } = fixture(["--skip-build"]);
  assert.equal(result.status, 0, result.stderr);
  assert.deepEqual(forwarded, ["deploy", "--config", "dist/server/wrangler.json", "--keep-vars"]);
  assert.match(result.stdout, /ignoring legacy --skip-build/);
});
test("dry run is passed through without affecting remote resources", () => {
  const { result, forwarded } = fixture(["--skip-build", "--dry-run"]);
  assert.equal(result.status, 0, result.stderr);
  assert.deepEqual(forwarded, ["deploy", "--config", "dist/server/wrangler.json", "--keep-vars", "--dry-run"]);
});
test("unrecognized flags are rejected", () => {
  const { result, forwarded } = fixture(["--force"]);
  assert.equal(result.status, 2);
  assert.equal(forwarded, null);
});
test("deployment fails closed when the build output is missing", () => {
  const { result, forwarded } = fixture(["--skip-build"], false);
  assert.equal(result.status, 2);
  assert.equal(forwarded, null);
  assert.match(result.stderr, /no built Worker/);
});
