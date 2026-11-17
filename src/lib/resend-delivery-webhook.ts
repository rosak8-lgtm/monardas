/**
 * Resend webhook verification and delivery event normalization.
 * No network side effects, personal contact storage, or mail sending.
 */
export type DeliveryKind =
  | "email.delivered"
  | "email.delivery_delayed"
  | "email.bounced"
  | "email.failed"
  | "email.complained"
  | "email.suppressed";

export interface DeliveryRecord {
  webhookId: string;
  emailId: string;
  eventType: DeliveryKind;
  createdAt: string;
}

const trackedEvents = new Set<string>([
  "email.delivered", "email.delivery_delayed", "email.bounced",
  "email.failed", "email.complained", "email.suppressed",
]);

export function decodeBase64(s: string): Uint8Array {
  const clean = s.replace(/-/g, "+").replace(/_/g, "/");
  if (!/^[A-Za-z0-9+/]*={0,2}$/.test(clean) || clean.length % 4 === 1 || clean.length === 0)
    throw new Error("INVALID_BASE64");
  const binary = atob(clean);
  return Uint8Array.from(binary, (c) => c.charCodeAt(0));
}

function bytesEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  let difference = 0;
  for (let i = 0; i < a.length; i++) difference |= a[i] ^ b[i];
  return difference === 0;
}

export async function verifyResendWebhook(
  body: string,
  headers: Headers,
  signingSecret: string,
  nowMs = Date.now(),
): Promise<{ webhookId: string } | null> {
  const webhookId = headers.get("svix-id") || "";
  const seconds = headers.get("svix-timestamp") || "";
  const headerSig = headers.get("svix-signature") || "";
  if (!/^msg_[A-Za-z0-9_-]{6,200}$/.test(webhookId) || !/^\d{10}$/.test(seconds))
    return null;
  const eventMs = Number(seconds) * 1000;
  if (!Number.isSafeInteger(eventMs) || Math.abs(nowMs - eventMs) > 300_000)
    return null;
  if (!signingSecret.startsWith("whsec_")) return null;
  try {
    const rawSecret = decodeBase64(signingSecret.slice(6));
    if (rawSecret.length < 16) return null;
    const key = await crypto.subtle.importKey("raw", rawSecret, { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
    const signed = new TextEncoder().encode(webhookId + "." + seconds + "." + body);
    const calculated = new Uint8Array(await crypto.subtle.sign("HMAC", key, signed));
    for (const part of headerSig.trim().split(/\s+/)) {
      if (!part.startsWith("v1,")) continue;
      try {
        if (bytesEqual(calculated, decodeBase64(part.slice(3)))) return { webhookId };
      } catch {
        // Ignore a malformed signature and try remaining versioned signatures.
      }
    }
  } catch {
    return null;
  }
  return null;
}

function address(v: unknown): string {
  if (typeof v !== "string") return "";
  const found = v.trim().match(/<([^<>]+)>$/);
  return (found ? found[1] : v).toLowerCase().trim();
}

export function normalizedLeadDelivery(
  raw: unknown,
  webhookId: string,
  expectedFrom: string,
  expectedTo: string,
): DeliveryRecord | null {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null;
  const event = raw as Record<string, unknown>;
  if (typeof event.type !== "string" || !trackedEvents.has(event.type)) return null;
  if (!event.data || typeof event.data !== "object" || Array.isArray(event.data)) return null;
  const data = event.data as Record<string, unknown>;
  if (address(data.from) !== address(expectedFrom)) return null;
  if (!Array.isArray(data.to) || !data.to.some((v) => address(v) === address(expectedTo))) return null;
  if (typeof data.email_id !== "string" || !/^[a-f\d-]{20,64}$/i.test(data.email_id)) return null;
  if (typeof event.created_at !== "string") return null;
  const t = Date.parse(event.created_at);
  if (!Number.isFinite(t)) return null;
  return {
    webhookId,
    emailId: data.email_id,
    eventType: event.type as DeliveryKind,
    createdAt: new Date(t).toISOString(),
  };
}
