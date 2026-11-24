-- DRAFT ONLY: apply to dedicated Cloudflare D1 database before deployment.
-- No raw emails or confirmation tokens are stored.
-- Resend membership without matching CONFIRMED receipt remains HOLD for OCI.
CREATE TABLE IF NOT EXISTS marketing_optin_receipts (
  token_sha256 TEXT PRIMARY KEY NOT NULL CHECK(length(token_sha256)=64),
  email_hmac_sha256 TEXT NOT NULL CHECK(length(email_hmac_sha256)=64),
  challenge_issued_ms INTEGER NOT NULL,
  confirmed_at_utc TEXT NOT NULL,
  disclosure_version TEXT NOT NULL,
  confirmation_action TEXT NOT NULL CHECK(confirmation_action='explicit_button_post'),
  segment_id TEXT NOT NULL,
  enrollment_state TEXT NOT NULL CHECK(enrollment_state IN ('PENDING','CONFIRMED','REVOKED'))
);
CREATE INDEX IF NOT EXISTS ix_marketing_optin_receipts_email_state
ON marketing_optin_receipts(email_hmac_sha256, enrollment_state);
