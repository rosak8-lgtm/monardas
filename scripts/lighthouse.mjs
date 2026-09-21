import fs from "node:fs";
import lighthouse from "lighthouse";
import { chromium } from "@playwright/test";

fs.mkdirSync("qa-reports", { recursive: true });
const browser = await chromium.launch({
  channel: "msedge",
  headless: true,
  args: ["--remote-debugging-port=9223"],
});
try {
  for (const [name, path] of [
    ["home", "/"],
    ["ai", "/ai"],
  ]) {
    const result = await lighthouse(`http://127.0.0.1:3000${path}`, {
      port: 9223,
      output: ["html", "json"],
      logLevel: "error",
      onlyCategories: ["performance", "accessibility", "best-practices", "seo"],
    });
    fs.writeFileSync(`qa-reports/${name}.html`, result.report[0]);
    fs.writeFileSync(`qa-reports/${name}.json`, result.report[1]);
    console.log(
      name,
      JSON.stringify(
        Object.fromEntries(
          Object.entries(result.lhr.categories).map(([k, v]) => [
            k,
            Math.round(v.score * 100),
          ]),
        ),
      ),
    );
    console.log(
      "Metrics",
      JSON.stringify(
        Object.fromEntries(
          [
            "first-contentful-paint",
            "largest-contentful-paint",
            "total-blocking-time",
            "cumulative-layout-shift",
          ].map((k) => [k, result.lhr.audits[k].displayValue]),
        ),
      ),
    );
    console.log(
      "Findings",
      JSON.stringify(
        Object.entries(result.lhr.audits)
          .filter(([, v]) => v.score !== null && v.score < 0.9)
          .map(([id, v]) => ({
            id,
            title: v.title,
            score: v.score,
            description: v.description,
          })),
      ),
    );
  }
} finally {
  await browser.close();
}
