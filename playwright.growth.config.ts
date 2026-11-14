import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  testMatch: ["**/hvac-scorecard.spec.ts", "**/hvac-founding.spec.ts"],
  fullyParallel: false,
  workers: 1,
  timeout: 90_000,
  reporter: "list",
  use: {
    baseURL: "http://127.0.0.1:8787",
    browserName: "chromium",
    headless: true,
    screenshot: "only-on-failure",
  },
  webServer: {
    command: "npm run start:vinext",
    url: "http://127.0.0.1:8787/hvac/scorecard",
    reuseExistingServer: false,
    timeout: 120_000,
  },
  outputDir: "test-results-growth",
});
