import { env as workerEnv } from "cloudflare:workers";
import { normalizedLeadDelivery, verifyResendWebhook } from "@/lib/resend-delivery-webhook";

type D1Stmt = { bind(...values: unknown[]): D1Stmt };
type D1Db = {
  prepare(sql: string): D1Stmt;
  batch(statements: D1Stmt[]): Promise<unknown>;
};

function runtimeValue(name: string): unknown {
  return (workerEnv as Record<string, unknown>)[name] ?? process.env[name];
}

/**
 * Disabled until RESEND_WEBHOOK_SECRET and LEAD_DELIVERY_DB are configured.
 * Does not expose the signing secret, sender, recipient, or payload in logs.
 */
export async function POST(request: Request) {
  const secret = runtimeValue("RESEND_WEBHOOK_SECRET");
  const db = runtimeValue("LEAD_DELIVERY_DB") as D1Db | undefined;
  const from = runtimeValue("CONTACT_FROM");
  const to = runtimeValue("CONTACT_TO");
  if (typeof secret !== "string" || !db || typeof db.prepare !== "function" ||
      typeof db.batch !== "function" || typeof from !== "string" || typeof to !== "string") {
    return new Response(null, { status: 503 });
  }
  const size = request.headers.get("content-length");
  if (size && (!/^\d+$/.test(size) || Number(size) > 131_072))
    return new Response(null, { status: 413 });
  const body = await request.text();
  if (new TextEncoder().encode(body).length > 131_072)
    return new Response(null, { status: 413 });
  const verified = await verifyResendWebhook(body, request.headers, secret);
  if (!verified) return new Response(null, { status: 401 });
  let payload: unknown;
  try { payload = JSON.parse(body); }
  catch { return new Response(null, { status: 400 }); }
  const record = normalizedLeadDelivery(payload, verified.webhookId, from, to);
  if (!record) return new Response(null, { status: 204 });
  try {
    await db.batch([
      db.prepare("INSERT OR IGNORE INTO lead_delivery_events (webhook_event_id,email_id,event_type,event_time,received_at) VALUES(?,?,?,?,datetime('now'))")
        .bind(record.webhookId,record.emailId,record.eventType,record.createdAt),
      db.prepare("INSERT INTO lead_delivery_latest (email_id,event_type,event_time) VALUES(?,?,?) ON CONFLICT(email_id) DO UPDATE SET event_type=excluded.event_type,event_time=excluded.event_time WHERE excluded.event_time > lead_delivery_latest.event_time")
        .bind(record.emailId,record.eventType,record.createdAt),
    ]);
  } catch {
    // Let Resend retry when persistence fails; never report false success.
    return new Response(null, { status: 503 });
  }
  return new Response(null, { status: 204 });
}
