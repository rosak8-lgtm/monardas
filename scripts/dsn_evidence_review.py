#!/usr/bin/env python3
"""Offline evidence-only review of original DSN emails, never a sending gate.

Does not modify attempts, suppression, provider status or campaign settings.
Only matches exact recipients in structured RFC 3464 message/delivery-status.
Every result holds sending and requires independent human review.
"""
from __future__ import annotations

import argparse
from email import policy
from email.parser import BytesParser
import json
from pathlib import Path
import re

MAX_BYTES = 2_000_000
ADDRESS = re.compile(r"^[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}$")
ENHANCED = re.compile(r"^[245]\.\d{1,3}\.\d{1,3}$")


def _recipient_field(value: str) -> str:
    val = str(value or "").strip()
    if ";" not in val:
        return ""
    val = val.split(";", 1)[1].strip().strip("<>").lower()
    return val if ADDRESS.fullmatch(val) else ""


def _review(kind: str, source: str, smtp_status: str = "") -> dict:
    return {
        "classification": kind,
        "evidence_source": source,
        "enhanced_smtp_status": smtp_status,
        "decision": "HOLD_NO_SEND",
        "historical_bounce_unchanged": True,
        "suppression_unchanged": True,
        "requires_human_review": True,
    }


def classify_eml(raw: bytes, recipient: str) -> dict:
    """Classify an exact recipient from structured DSN, not free-form prose.

    Does not disclose recipient, diagnostic prose, relay IP or Message-ID.
    Original .eml authenticity is not verified: human review remains mandatory.
    """
    if not isinstance(raw, bytes) or not 0 < len(raw) <= MAX_BYTES:
        raise ValueError("INVALID_EMAIL_SIZE_OR_TYPE")
    if not isinstance(recipient, str) or not ADDRESS.fullmatch(recipient.strip().lower()):
        raise ValueError("INVALID_RECIPIENT")
    target = recipient.strip().lower()
    msg = BytesParser(policy=policy.default).parsebytes(raw)
    matching = []
    for part in msg.walk():
        if part.get_content_type() != "message/delivery-status":
            continue
        for block in part.walk():
            if block is part:
                continue
            recipients = set()
            for field in ("Final-Recipient", "Original-Recipient"):
                for val in block.get_all(field, []):
                    r = _recipient_field(val)
                    if r:
                        recipients.add(r)
            if target not in recipients:
                continue
            action = str(block.get("Action", "")).strip().lower()
            status = str(block.get("Status", "")).strip()
            matching.append((action, status))

    if len(matching) != 1:
        return _review(
            "CONFLICTING_DSN_REVIEW" if matching else "UNVERIFIED_FAILURE_REVIEW",
            "STRUCTURED_DSN" if matching else "NO_MATCHING_STRUCTURED_DSN",
        )
    action, status = matching[0]
    if not ENHANCED.fullmatch(status):
        return _review("INVALID_DSN_STATUS_REVIEW", "STRUCTURED_DSN")
    if action == "failed" and status in ("5.1.1", "5.1.3"):
        return _review("PERMANENT_RECIPIENT_FAILURE", "STRUCTURED_DSN", status)
    if action == "failed" and status.startswith("5.7."):
        return _review("POLICY_REJECTION", "STRUCTURED_DSN", status)
    if action == "failed" and status.startswith("5."):
        return _review("PERMANENT_OTHER_FAILURE_REVIEW", "STRUCTURED_DSN", status)
    if action in ("delayed", "failed") and status.startswith("4."):
        return _review("TEMPORARY_OR_DELAYED_REVIEW", "STRUCTURED_DSN", status)
    return _review("INCONSISTENT_DSN_REVIEW", "STRUCTURED_DSN", status)


def classify_visible_notice(reason: str, diagnostic: str) -> dict:
    """Annotation of visible screenshots; not authoritative DSN evidence."""
    s = (str(reason) + " " + str(diagnostic)).lower()
    if "proofpoint dynamic reputation" in s or ("proofpoint" in s and "blocked" in s):
        kind = "DISPLAY_REPUTATION_OR_POLICY_SIGNAL"
    elif "address not found" in s or "account that you tried to reach does not exist" in s:
        kind = "DISPLAY_RECIPIENT_ADDRESS_SIGNAL"
    elif "eof [data_end]" in s or "unknown error" in s:
        kind = "DISPLAY_TRANSPORT_UNVERIFIED"
    elif "temporary" in s or "delayed" in s or "timeout" in s:
        kind = "DISPLAY_TEMPORARY_UNVERIFIED"
    else:
        kind = "DISPLAY_UNVERIFIED"
    return _review(kind, "VISIBLE_NOTICE_ONLY")


def main() -> None:
    ap = argparse.ArgumentParser(description="Offline DSN triage, read-only; NEVER sends")
    ap.add_argument("--eml", type=Path, required=True, help="Original local .eml")
    ap.add_argument("--recipient", required=True, help="Exact recipient named by DSN")
    args = ap.parse_args()
    if args.eml.is_symlink() or not args.eml.is_file():
        ap.error("EML_MISSING_OR_SYMLINK")
    size = args.eml.stat().st_size
    if not 0 < size <= MAX_BYTES:
        ap.error("EML_SIZE_INVALID")
    print(json.dumps(classify_eml(args.eml.read_bytes(), args.recipient),
                     ensure_ascii=False, sort_keys=True, indent=2))


if __name__ == "__main__":
    main()
