-- PROPOSED ISOLATED INBOUND LEDGER (NOT APPLIED TO PRODUCTION)
-- Contains no customer name, email, phone or message. Only keyed digests,
-- categorical metadata and machine-readable processing state.
-- A keyed HMAC-SHA256 digest must be computed server-side; never use a raw
-- SHA-256 of an email or user-submitted value.
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS inbound_receipts (
  id TEXT PRIMARY KEY,
  tenant_key TEXT NOT NULL,
  submission_key_digest TEXT NOT NULL,
  payload_digest TEXT NOT NULL,
  received_at TEXT NOT NULL,
  triage_code TEXT NOT NULL CHECK (
    triage_code IN ('HVAC_PILOT', 'GENERAL')
  ),
  processing_state TEXT NOT NULL DEFAULT 'PENDING' CHECK (
    processing_state IN ('PENDING', 'REVIEW', 'COMPLETE', 'HOLD')
  ),
  UNIQUE (tenant_key, submission_key_digest)
);

CREATE INDEX IF NOT EXISTS idx_inbound_receipts_state
  ON inbound_receipts (processing_state, received_at);

CREATE TABLE IF NOT EXISTS inbound_review_outbox (
  id TEXT PRIMARY KEY,
  receipt_id TEXT NOT NULL UNIQUE
    REFERENCES inbound_receipts(id) ON DELETE RESTRICT,
  created_at TEXT NOT NULL,
  delivery_state TEXT NOT NULL DEFAULT 'PENDING' CHECK (
    delivery_state IN ('PENDING', 'CLAIMED', 'DELIVERED', 'FAILED', 'HOLD')
  ),
  claimed_at TEXT,
  completed_at TEXT,
  attempt_count INTEGER NOT NULL DEFAULT 0
    CHECK(attempt_count >= 0),
  last_error_code TEXT
);

CREATE INDEX IF NOT EXISTS idx_inbound_review_outbox_state
  ON inbound_review_outbox (delivery_state, created_at);

-- Design notes:
-- 1. Insert receipt and corresponding outbox item in ONE transaction.
-- 2. On unique conflict, fetch existing receipt and compare payload_digest;
--    mismatch => reject with conflict, not "success".
-- 3. Never mark DELIVERED from HTTP acceptance alone; provider status
--    must be reconciled separately.
-- 4. Claim expiry, authorized operator access, retention and encrypted
--    customer data storage must be designed BEFORE any real activation.
