/**
 * MONARDAS: durable, privacy-minimizing opt-in evidence for the DRAFT site flow.
 * Requires a bound Cloudflare D1 database before publishing.
 * A Resend segment membership alone is NOT permission evidence.
 */
function normalizeOptInEmail(input: string): string | null {
  const email = input.trim().toLowerCase();
  return email.length >= 6 && email.length <= 254 && /^[^\s<>@]+@[^\s<>@]+\.[^\s<>@]+$/.test(email)
    ? email : null;
}
export const CONSENT_DISCLOSURE_VERSION = "monardas-hvac-optin-checkbox-v1-2026-11-23";
export const CONSENT_DISCLOSURE =
  "Optional: I want occasional MONARDAS HVAC recovery tips and offers by email. I can unsubscribe at any time.";

export type MarketingReceiptDatabase = {
  prepare(sql: string): {
    bind(...values: Array<string | number>): {
      run(): Promise<{ success?: boolean; meta?: { changes?: number } }>;
    };
  };
};
export function asMarketingReceiptDatabase(value: unknown): MarketingReceiptDatabase | null {
  if (value === null || typeof value !== "object") return null;
  const maybe = value as { prepare?: unknown };
  return typeof maybe.prepare === "function" ? value as MarketingReceiptDatabase : null;
}
function toHex(value: ArrayBuffer): string {
  return Array.from(new Uint8Array(value), (byte) => byte.toString(16).padStart(2, "0")).join("");
}
export async function tokenDigest(token: string): Promise<string> {
  if (!/^[A-Za-z0-9_-]{36,1500}$/.test(token)) throw Error("INVALID_CONFIRMATION_TOKEN");
  return toHex(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(token)));
}
export async function addressDigest(emailInput: string, secret: string): Promise<string> {
  const email = normalizeOptInEmail(emailInput);
  if (!email || secret.length < 32) throw Error("INVALID_RECEIPT_INPUT");
  const key = await crypto.subtle.importKey(
    "raw", new TextEncoder().encode("MONARDAS:optin:proof:" + secret),
    { name: "HMAC", hash: "SHA-256" }, false, ["sign"]
  );
  return toHex(await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(email)));
}
export async function reserveConfirmationReceipt(args: {
  db: MarketingReceiptDatabase;
  token: string;
  email: string;
  signingSecret: string;
  segmentId: string;
  challengeIssuedMs: number;
  confirmedAt?: Date;
}): Promise<{ reserved: boolean; tokenHash: string }> {
  const { db, token, email, signingSecret, segmentId, challengeIssuedMs } = args;
  if (!/^[0-9a-f-]{20,60}$/i.test(segmentId) || !Number.isFinite(challengeIssuedMs))
    throw Error("INVALID_CONSENT_SEGMENT_OR_ISSUE_TIME");
  const tokenHash = await tokenDigest(token);
  const emailKey = await addressDigest(email, signingSecret);
  const confirmedAt = args.confirmedAt ?? new Date();
  if (!Number.isFinite(confirmedAt.getTime())) throw Error("INVALID_SERVER_TIMESTAMP");
  const result = await db.prepare(
    "INSERT OR IGNORE INTO marketing_optin_receipts " +
    "(token_sha256, email_hmac_sha256, challenge_issued_ms, confirmed_at_utc, disclosure_version, " +
    "confirmation_action, segment_id, enrollment_state) " +
    "VALUES (?, ?, ?, ?, ?, 'explicit_button_post', ?, 'PENDING')"
  ).bind(tokenHash, emailKey, challengeIssuedMs, confirmedAt.toISOString(),
      CONSENT_DISCLOSURE_VERSION, segmentId).run();
  if (result.success === false || typeof result.meta?.changes !== "number")
    throw Error("CONSENT_RECEIPT_WRITE_UNVERIFIED");
  return { reserved: result.meta.changes === 1, tokenHash };
}
export async function confirmReceiptAfterSegmentAcceptance(
  db: MarketingReceiptDatabase, tokenHash: string,
): Promise<void> {
  if (!/^[0-9a-f]{64}$/.test(tokenHash)) throw Error("INVALID_RECEIPT_KEY");
  const result = await db.prepare(
    "UPDATE marketing_optin_receipts SET enrollment_state='CONFIRMED' " +
    "WHERE token_sha256=? AND enrollment_state='PENDING'"
  ).bind(tokenHash).run();
  if (result.success === false || result.meta?.changes !== 1)
    throw Error("CONSENT_RECEIPT_CONFIRMATION_NOT_PERSISTED");
}
