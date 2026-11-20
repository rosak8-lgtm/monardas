#!/usr/bin/env node
// Cloudflare Git Builds invokes: npm run deploy -- --skip-build.
// Wrangler 4 has no --skip-build flag. Build is already completed by vinext.
// Strip only this known CI compatibility flag; retain --keep-vars to protect
// dashboard-managed configuration. Never print keys or env contents.
import { existsSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

const config = "dist/server/wrangler.json";
const inputs = process.argv.slice(2);
const supported = new Set(["--skip-build", "--dry-run"]);
const invalid = inputs.filter((argument) => !supported.has(argument));
if (invalid.length) {
  console.error("Deploy aborted: unsupported argument(s): " + invalid.join(", "));
  process.exit(2);
}
if (!existsSync(join(process.cwd(), config))) {
  console.error("Deploy aborted: no built Worker at " + config + ". Run npm run build:vinext first.");
  process.exit(2);
}
const args = ["deploy", "--config", config, "--keep-vars"];
if (inputs.includes("--dry-run")) args.push("--dry-run");
if (inputs.includes("--skip-build")) {
  console.log("Cloudflare CI: ignoring legacy --skip-build (vinext build already completed).");
}
const executable = process.platform === "win32" ? "wrangler.cmd" : "wrangler";
const result = spawnSync(executable, args, { stdio: "inherit", shell: false });
if (result.error) {
  console.error("Deploy failed: " + result.error.message);
  process.exit(1);
}
if (result.signal) {
  console.error("Deploy interrupted: " + result.signal);
  process.exit(1);
}
process.exit(result.status ?? 1);
