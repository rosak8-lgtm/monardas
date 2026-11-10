"""Offline SQLite checks for proposed inbound ledger schema. No production access."""
import sqlite3
import unittest
from pathlib import Path

SCHEMA = Path(__file__).resolve().parents[1] / "design" / "inbound-ledger-schema.sql"


class InboundLedgerSchemaTests(unittest.TestCase):
    def setUp(self):
        self.db = sqlite3.connect(":memory:")
        self.db.execute("PRAGMA foreign_keys=ON")
        self.db.executescript(SCHEMA.read_text(encoding="utf-8"))

    def tearDown(self):
        self.db.close()

    def receipt(self, id="r1", tenant="demo", key="hmac-key-1", payload="hmac-payload-1"):
        self.db.execute(
            """INSERT INTO inbound_receipts
               (id, tenant_key, submission_key_digest, payload_digest,
                received_at, triage_code)
               VALUES (?, ?, ?, ?, '2026-11-10T00:00:00Z', 'HVAC_PILOT')""",
            (id, tenant, key, payload),
        )

    def outbox(self, id="o1", receipt="r1"):
        self.db.execute(
            """INSERT INTO inbound_review_outbox
               (id, receipt_id, created_at)
               VALUES (?, ?, '2026-11-10T00:00:00Z')""",
            (id, receipt),
        )

    def test_schema_is_replay_safe(self):
        self.db.executescript(SCHEMA.read_text(encoding="utf-8"))

    def test_tenant_scoped_submission_uniqueness(self):
        self.receipt()
        with self.assertRaises(sqlite3.IntegrityError):
            self.receipt("r2")
        self.receipt("r3", tenant="different-tenant")

    def test_outbox_is_unique_per_receipt(self):
        self.receipt()
        self.outbox()
        with self.assertRaises(sqlite3.IntegrityError):
            self.outbox("o2")

    def test_outbox_requires_existing_receipt(self):
        with self.assertRaises(sqlite3.IntegrityError):
            self.outbox()

    def test_invalid_status_rejected(self):
        self.receipt()
        with self.assertRaises(sqlite3.IntegrityError):
            self.db.execute(
                "UPDATE inbound_receipts SET processing_state='SENT' WHERE id='r1'"
            )

    def test_receipt_and_outbox_roll_back_together(self):
        with self.assertRaises(RuntimeError):
            with self.db:
                self.receipt()
                self.outbox()
                raise RuntimeError("injected-failure")
        self.assertEqual(self.db.execute(
            "SELECT count(*) FROM inbound_receipts"
        ).fetchone()[0], 0)
        self.assertEqual(self.db.execute(
            "SELECT count(*) FROM inbound_review_outbox"
        ).fetchone()[0], 0)

    def test_no_direct_personal_data_columns(self):
        for table in ("inbound_receipts", "inbound_review_outbox"):
            names = {r[1] for r in self.db.execute(f"PRAGMA table_info({table})")}
            self.assertFalse(
                names & {"email", "name", "phone", "message", "body", "ip_address"}
            )


if __name__ == "__main__":
    unittest.main()
