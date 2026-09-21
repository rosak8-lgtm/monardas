import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./tests",
  fullyParallel: false,
  workers: 1,
  timeout: 90000,
  reporter: "list",
  use: {
    baseURL: process.env.QA_BASE_URL || "http://127.0.0.1:3000",
    headless: true,
    channel: "msedge",
    screenshot: "only-on-failure",
  },
  outputDir: "test-results",
});
