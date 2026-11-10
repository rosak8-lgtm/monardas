"""Isolated, offline inbound receipt transaction prototype.

No networking, external email, CRM routing or production bindings.
Only HMAC digests and categorical codes are stored.
"""
import hashlib
import hmac
import json
import secrets
import sqlite3
from datetime import datetime, timezone
from uuid import uuid4


class ReceiptConflict(Exception):
    """The same idempotency token was reused with a different payload."""


def _mac(secret: bytes, purpose: bytes, material: bytes) -> str:
    return hmac.new(secret, purpose + b"\x00" + material, hashlib.sha256).hexdigest()


def save_receipt(
    db: sqlite3.Connection,
    *,
    tenant_key: str,
    submission_token: str,
    validated_payload: dict,
    triage_code: str,
    hmac_secret: bytes,
) -> tuple[str, str]:
    """Atomically record one inbound receipt and one manager outbox job.

    Returns ('CREATED' or 'REPLAY', receipt_id). Reuse with changed payload raises
    ReceiptConflict. Caller must validate and authorize tenant and form first.
    Caller is responsible for storage initialization and secret management.
    """
    if not isinstance(hmac_secret, bytes) or len(hmac_secret) < 32:
        raise ValueError("A secret with at least 32 bytes is required")
    if not isinstance(tenant_key, str) or not tenant_key.strip() or len(tenant_key) > 128:
        raise ValueError("Invalid tenant identifier")
    if not isinstance(submission_token, str) or len(submission_token) < 24 or len(submission_token) > 256:
        raise ValueError("Invalid submission token")
    if not isinstance(validated_payload, dict):
        raise ValueError("Expected validated payload mapping")
    if triage_code not in ("HVAC_PILOT", "GENERAL"):
        raise ValueError("Invalid triage code")
    canonical = json.dumps(
        validated_payload, ensure_ascii=False, sort_keys=True,
        separators=(",", ":"), allow_nan=False,
    ).encode("utf-8")
    if len(canonical) > 12000:
        raise ValueError("Payload too large")
    token_digest = _mac(
        hmac_secret, b"MONARDAS:inbound:idempotency:v1",
        tenant_key.encode("utf-8") + b"\x00" + submission_token.encode("utf-8"),
    )
    payload_digest = _mac(
        hmac_secret, b"MONARDAS:inbound:payload:v1",
        tenant_key.encode("utf-8") + b"\x00" + triage_code.encode("ascii") + b"\x00" + canonical,
    )
    receipt_id = str(uuid4())
    outbox_id = str(uuid4())
    now = datetime.now(timezone.utc).isoformat()

    # With isolation_level=None the caller can never accidentally commit a
    # half-transaction via sqlite3's implicit transaction management.
    if db.in_transaction:
        raise RuntimeError("Connection already has a transaction")
    db.execute("BEGIN IMMEDIATE")
    try:
        row = db.execute(
            """SELECT id, payload_digest, triage_code FROM inbound_receipts
               WHERE tenant_key=? AND submission_key_digest=?""",
            (tenant_key, token_digest),
        ).fetchone()
        if row:
            if not hmac.compare_digest(row[1], payload_digest) or row[2] != triage_code:
                raise ReceiptConflict("Idempotency token already used for another submission")
            db.execute("COMMIT")
            return ("REPLAY", row[0])
        db.execute(
            """INSERT INTO inbound_receipts
            (id, tenant_key, submission_key_digest, payload_digest, received_at, triage_code)
            VALUES (?, ?, ?, ?, ?, ?)""",
            (receipt_id, tenant_key, token_digest, payload_digest, now, triage_code),
        )
        db.execute(
            """INSERT INTO inbound_review_outbox
            (id, receipt_id, created_at) VALUES (?, ?, ?)""",
            (outbox_id, receipt_id, now),
        )
        db.execute("COMMIT")
        return ("CREATED", receipt_id)
    except BaseException:
        db.execute("ROLLBACK")
        raise
