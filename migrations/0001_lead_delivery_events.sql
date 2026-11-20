-- Resend delivery outcome journal. No emails, contact fields or raw payloads.
CREATE TABLE IF NOT EXISTS lead_delivery_events (
  webhook_event_id TEXT PRIMARY KEY,
  email_id TEXT NOT NULL,
  event_type TEXT NOT NULL CHECK(event_type IN ('email.delivered','email.delivery_delayed','email.bounced','email.failed','email.complained','email.suppressed')),
  event_time TEXT NOT NULL,
  received_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS lead_delivery_events_email_idx ON lead_delivery_events(email_id);
CREATE TABLE IF NOT EXISTS lead_delivery_latest (
  email_id TEXT PRIMARY KEY,
  event_type TEXT NOT NULL,
  event_time TEXT NOT NULL
);
