/**
 * MONARDAS / Cloudflare-compatible offline prototype.
 *
 * This module is NOT imported into /api/contact and has no deployed D1 binding.
 * The caller must validate the form, authenticate its tenant, generate/secure
 * an idempotency token and supply a secret from Workers runtime bindings.
 */
export interface D1StatementLike {
  bind(...values: unknown[]): D1StatementLike;
  first<T = Record<string, unknown>>(): Promise<T | null>;
}
export interface D1BatchLike {
  prepare(sql: string): D1StatementLike;
  batch<T = unknown>(statements: D1StatementLike[]): Promise<T[]>;
}
export type IntakeOutcome = {
  status: "CREATED" | "REPLAY";
  receiptId: string;
  notificationQueued: true;
};
export class IntakeConflict extends Error {
  constructor() {
    super("Idempotency token already used for different validated content");
    this.name = "IntakeConflict";
  }
}
const encoder = new TextEncoder();
function hex(value: ArrayBuffer): string {
  return Array.from(new Uint8Array(value), b => b.toString(16).padStart(2, "0")).join("");
}
async function mac(
  secret: string,
  purpose: string,
  material: string,
): Promise<string> {
  if (encoder.encode(secret).length < 32) throw new Error("HMAC secret unavailable");
  const key = await crypto.subtle.importKey(
    "raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" },
    false, ["sign"],
  );
  return hex(await crypto.subtle.sign("HMAC", key, encoder.encode(purpose + "\0" + material)));
}
export type ValidatedIntake = {
  tenantKey: string;
  submissionToken: string;
  canonicalPayload: string;
  triageCode: "HVAC_PILOT" | "GENERAL";
};
/** No PII emitted; token must be randomly generated and scoped to tenant. */
export async function storeInboundReceipt(
  db: D1BatchLike,
  data: ValidatedIntake,
  secret: string,
): Promise<IntakeOutcome> {
  const { tenantKey, submissionToken, canonicalPayload, triageCode } = data;
  if (!tenantKey || tenantKey.length > 128 ||
      !submissionToken || submissionToken.length < 24 || submissionToken.length > 256 ||
      !["HVAC_PILOT", "GENERAL"].includes(triageCode) ||
      !canonicalPayload || encoder.encode(canonicalPayload).length > 12000)
    throw new Error("Invalid validated intake metadata");

  const tokenDigest = await mac(
    secret, "MONARDAS:inbound:idempotency:v1",
    tenantKey + "\0" + submissionToken,
  );
  const payloadDigest = await mac(
    secret, "MONARDAS:inbound:payload:v1",
    tenantKey + "\0" + triageCode + "\0" + canonicalPayload,
  );
  const receiptId = crypto.randomUUID();
  const outboxId = crypto.randomUUID();
  const now = new Date().toISOString();

  // Cloudflare D1 batch() executes statements in a single transaction. The
  // outbox SELECT is gated on payload digest; conflicted retries create
  // neither a second receipt nor a new notification.
  await db.batch([
    db.prepare(`
      INSERT INTO inbound_receipts
        (id, tenant_key, submission_key_digest, payload_digest, received_at, triage_code)
      VALUES (?, ?, ?, ?, ?, ?)
      ON CONFLICT(tenant_key, submission_key_digest) DO NOTHING
    `).bind(receiptId, tenantKey, tokenDigest, payloadDigest, now, triageCode),
    db.prepare(`
      INSERT INTO inbound_review_outbox (id, receipt_id, created_at)
      SELECT ?, id, ? FROM inbound_receipts
      WHERE tenant_key = ? AND submission_key_digest = ?
        AND payload_digest = ? AND triage_code = ?
      ON CONFLICT(receipt_id) DO NOTHING
    `).bind(outboxId, now, tenantKey, tokenDigest, payloadDigest, triageCode),
  ]);

  const row = await db.prepare(`
    SELECT id, payload_digest, triage_code
    FROM inbound_receipts
    WHERE tenant_key = ? AND submission_key_digest = ?
  `).bind(tenantKey, tokenDigest).first<{
    id: string;
    payload_digest: string;
    triage_code: string;
  }>();
  if (!row) throw new Error("Receipt persistence could not be verified");
  if (row.payload_digest !== payloadDigest || row.triage_code !== triageCode)
    throw new IntakeConflict();

  return {
    status: row.id === receiptId ? "CREATED" : "REPLAY",
    receiptId: row.id,
    notificationQueued: true,
  };
}
