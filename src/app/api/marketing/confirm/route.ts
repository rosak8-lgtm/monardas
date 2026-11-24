import { env as workerEnv } from "cloudflare:workers";
import { verifyOptInChallenge, resolveMarketingTarget } from "@/lib/marketing-optin";
import { asMarketingReceiptDatabase, reserveConfirmationReceipt, confirmReceiptAfterSegmentAcceptance } from "@/lib/marketing-consent-receipt";

const RESEND_CONTACTS = "https://api.resend.com/contacts";
function envValue(name: string): string | null {
  const raw = (workerEnv as Record<string, unknown>)[name] ??
    (process.env as Record<string, string | undefined>)[name];
  return typeof raw === "string" && raw.trim() ? raw.trim() : null;
}

function page(message: string, status = 200, action = ""): Response {
  const html = '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>MONARDAS email updates</title></head><body style="font:16px/1.6 system-ui,sans-serif;max-width:680px;margin:8vh auto;padding:24px"><h1>MONARDAS HVAC updates</h1><p>' +
    message + '</p>' + action + '<p><a href="https://monardas.com/hvac">Back to MONARDAS</a></p></body></html>';
  return new Response(html, { status, headers: {
    "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store",
    "Referrer-Policy": "no-referrer", "X-Robots-Tag": "noindex",
    "X-Content-Type-Options": "nosniff",
    "Content-Security-Policy": "default-src 'none'; style-src 'unsafe-inline'; form-action 'self'; base-uri 'none'; frame-ancestors 'none'",
  } });
}
function headers(key: string) {
  return { Authorization: "Bearer " + key, "Content-Type": "application/json" };
}

export async function GET(request: Request) {
  const target = resolveMarketingTarget({ ...process.env, ...workerEnv }, new URL(request.url).origin);
  if (!target) return page("Subscription confirmation is unavailable.", 503);
  const token = new URL(request.url).searchParams.get("token") ?? "";
  const consent = await verifyOptInChallenge(token, target.challengeSecret);
  if (!consent || (target.qaEmail && consent.email !== target.qaEmail)) return page("This link is invalid or expired. You have not been subscribed.", 400);
  // Deliberately read-only. Email security scanners may visit verification links.
  return page("If you requested optional MONARDAS HVAC email updates, confirm your subscription below. This is separate from your pilot enquiry.",
    200, '<form method="post" action="/api/marketing/confirm"><input type="hidden" name="token" value="' +
    token + '"><button type="submit" style="padding:10px 20px">Confirm my email subscription</button></form>');
}

export async function POST(request: Request) {
  const target = resolveMarketingTarget({ ...process.env, ...workerEnv }, new URL(request.url).origin);
  const apiKey = envValue("RESEND_CONTACTS_API_KEY");
  const receiptDb = asMarketingReceiptDatabase((workerEnv as Record<string, unknown>)["MARKETING_DB"]);
  if (!target || !apiKey || !receiptDb) return page("Subscription confirmation is unavailable.", 503);
  const segment = target.segmentId;
  if (!request.headers.get("content-type")?.includes("application/x-www-form-urlencoded")) return page("Invalid request.", 415);
  const raw = await request.text();
  if (raw.length > 3000) return page("Invalid request.", 413);
  const token = new URLSearchParams(raw).get("token") ?? "";
  const consent = await verifyOptInChallenge(token, target.challengeSecret);
  if (!consent || (target.qaEmail && consent.email !== target.qaEmail)) return page("This link is invalid or expired. You have not been subscribed.", 400);
  const contact = RESEND_CONTACTS + "/" + encodeURIComponent(consent.email);
  const requestHeaders = headers(apiKey);
  try {
    const current = await fetch(contact, { method: "GET", headers: requestHeaders, cache: "no-store" });
    // A previously unsubscribed contact may never be silently reactivated.
    // Unknown Resend state fails closed before a consent receipt is reserved.
    if (current.ok) {
      const existing = (await current.json()) as { unsubscribed?: unknown };
      if (existing.unsubscribed !== false) return page("This address has a subscription restriction. Contact MONARDAS to review it.", 409);
    } else if (current.status !== 404) {
      return page("Subscription verification is unavailable. Please try again later.", 503);
    }
    // No marketing enrollment without durable server-side evidence of a
    // human POST, the displayed disclosure version, and this exact challenge.
    const receipt = await reserveConfirmationReceipt({
      db: receiptDb, token, email: consent.email, signingSecret: target.receiptSecret,
      segmentId: segment, challengeIssuedMs: consent.issuedMs,
    });
    if (!receipt.reserved) return page("This confirmation link was already processed. Request a new link if needed.", 409);

    if (current.ok) {
      const added = await fetch(contact + "/segments/" + encodeURIComponent(segment), {
        method: "POST", headers: requestHeaders, body: "{}",
      });
      if (!added.ok && added.status !== 409) return page("We could not confirm your subscription. Please request a new link.", 503);
    } else {
      const created = await fetch(RESEND_CONTACTS, { method: "POST", headers: requestHeaders,
        body: JSON.stringify({ email: consent.email, first_name: consent.firstName,
          unsubscribed: false, segments: [{ id: segment }] }),
      });
      if (!created.ok) return page("We could not confirm your subscription. Please request a new link.", 503);
    }
    // A provider conflict or create response alone is not proof of enrollment.
    // Re-read both current subscription status and explicit segment membership.
    const verifiedContact = await fetch(contact, {
      method: "GET", headers: requestHeaders, cache: "no-store",
    });
    if (!verifiedContact.ok) return page("Subscription verification is unavailable. Please request a new link.", 503);
    const verified = (await verifiedContact.json()) as { id?: unknown; unsubscribed?: unknown };
    if (typeof verified.id !== "string" || !verified.id || verified.unsubscribed !== false)
      return page("Subscription verification is unavailable. Please request a new link.", 503);
    const membership = await fetch(RESEND_CONTACTS + "/" + encodeURIComponent(verified.id) + "/segments", {
      method: "GET", headers: requestHeaders, cache: "no-store",
    });
    if (!membership.ok) return page("Subscription verification is unavailable. Please request a new link.", 503);
    const memberships = (await membership.json()) as { data?: { id?: unknown }[] };
    if (!Array.isArray(memberships.data) || !memberships.data.some(item => item?.id === segment))
      return page("Subscription verification is unavailable. Please request a new link.", 503);
    await confirmReceiptAfterSegmentAcceptance(receiptDb, receipt.tokenHash);
    return page("Your voluntary email subscription is confirmed. You can unsubscribe from future messages at any time.");
  } catch {
    return page("Subscription verification is unavailable. Please try again later.", 503);
  }
}
