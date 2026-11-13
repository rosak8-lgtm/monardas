import { env as workerEnv } from "cloudflare:workers";
import { verifyMarketingToken } from "@/lib/marketing-optin";

// Existing account segment: MONARDAS HVAC — confirmed opt-in only.
// It must never be populated from the CRM prospecting cohort.
const SEGMENT_ID = "c0729422-ded7-4bc6-bef9-a4d591aa2818";
const CONTACTS_ENDPOINT = "https://api.resend.com/contacts";

function apiKey(): string | null {
  const raw = (workerEnv as Record<string, unknown>).RESEND_API_KEY ??
    (process.env as Record<string, string | undefined>).RESEND_API_KEY;
  return typeof raw === "string" && raw.length >= 16 ? raw : null;
}
function page(message: string, status = 200, action = ""): Response {
  return new Response(
    `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>MONARDAS email preferences</title></head><body style="font-family:system-ui,sans-serif;max-width:620px;margin:10vh auto;padding:24px;line-height:1.6"><h1>MONARDAS HVAC updates</h1><p>${message}</p>${action}<p><a href="https://monardas.com/hvac">Back to MONARDAS</a></p></body></html>`,
    { status, headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
      "Referrer-Policy": "no-referrer",
      "X-Content-Type-Options": "nosniff",
      "Content-Security-Policy": "default-src 'none'; style-src 'unsafe-inline'; form-action 'self'; base-uri 'none'; frame-ancestors 'none'",
    } },
  );
}
function authHeaders(key: string) {
  return { Authorization: `Bearer ${key}`, "Content-Type": "application/json" };
}

export async function GET(request: Request) {
  const secret = apiKey();
  if (!secret) return page("Subscription verification is temporarily unavailable.", 503);
  const token = new URL(request.url).searchParams.get("token") ?? "";
  const consent = await verifyMarketingToken(token, secret);
  if (!consent) return page("This confirmation link is invalid or expired. No subscription was created.", 400);
  // GET is intentionally read-only: mail scanners may visit links automatically.
  return page(
    "You requested occasional HVAC sales-recovery insights and offers. Please confirm that you want to subscribe. This is optional and unrelated to your assessment request.",
    200,
    `<form method="post" action="/api/marketing/confirm"><input type="hidden" name="token" value="${token}"><button type="submit" style="padding:12px 20px;cursor:pointer">Confirm my email subscription</button></form>`,
  );
}

export async function POST(request: Request) {
  const secret = apiKey();
  if (!secret) return page("Subscription verification is temporarily unavailable.", 503);
  if (!request.headers.get("content-type")?.includes("application/x-www-form-urlencoded"))
    return page("Invalid request.", 415);
  const raw = await request.text();
  if (raw.length > 3000) return page("Invalid request.", 413);
  const token = new URLSearchParams(raw).get("token") ?? "";
  const consent = await verifyMarketingToken(token, secret);
  if (!consent) return page("This confirmation link is invalid or expired. No subscription was created.", 400);
  const path = `${CONTACTS_ENDPOINT}/${encodeURIComponent(consent.email)}`;
  const headers = authHeaders(secret);
  const properties = {
    monardas_optin_at: new Date().toISOString(),
    monardas_optin_source: "hvac_assessment_email_confirmed_v1",
  };
  try {
    const previous = await fetch(path, { headers, cache: "no-store" });
    if (previous.ok) {
      const existing = (await previous.json()) as { unsubscribed?: unknown };
      // Never silently reactivate a globally unsubscribed address.
      if (existing.unsubscribed !== false)
        return page("This address has an existing subscription restriction. Please contact MONARDAS to review it.", 409);
      const updated = await fetch(path, {
        method: "PATCH", headers, body: JSON.stringify({ properties }),
      });
      if (!updated.ok) return page("We could not save your consent evidence. No change to subscription preferences was confirmed.", 503);
      const linked = await fetch(`${path}/segments/${SEGMENT_ID}`, {
        method: "POST", headers, body: "{}",
      });
      if (!linked.ok && linked.status !== 409)
        return page("We could not update your subscription. Please retry later.", 503);
    } else if (previous.status === 404) {
      const created = await fetch(CONTACTS_ENDPOINT, {
        method: "POST", headers,
        body: JSON.stringify({
          email: consent.email, first_name: consent.firstName,
          unsubscribed: false, segments: [{ id: SEGMENT_ID }],
          properties,
        }),
      });
      if (!created.ok) return page("We could not save your confirmed subscription. Please retry later.", 503);
    } else {
      return page("Subscription verification is temporarily unavailable. Please retry later.", 503);
    }
    return page("Your email subscription is confirmed. You can unsubscribe from future marketing emails at any time.");
  } catch {
    return page("Subscription verification is temporarily unavailable. Please retry later.", 503);
  }
}
