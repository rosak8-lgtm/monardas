"""No-network tests for the proposed transaction, using only memory SQLite."""
import sqlite3
import unittest
from pathlib import Path
from scripts.inbound_receipt_store import save_receipt, ReceiptConflict

SCHEMA = Path(__file__).resolve().parents[1] / "design/inbound-ledger-schema.sql"
SECRET = bytes(range(32))
TOKEN = "randomly-generated-idempotency-token-001"
PAYLOAD = {"company": "Sample HVAC", "email": "private@example.invalid"}


class ReceiptStoreTests(unittest.TestCase):
    def setUp(self):
        self.db = sqlite3.connect(":memory:", isolation_level=None)
        self.db.execute("PRAGMA foreign_keys=ON")
        self.db.executescript(SCHEMA.read_text(encoding="utf-8"))

    def tearDown(self):
        self.db.close()

    def save(self, **changes):
        args = {
            "tenant_key": "demo",
            "submission_token": TOKEN,
            "validated_payload": PAYLOAD,
            "triage_code": "HVAC_PILOT",
            "hmac_secret": SECRET,
        }
        args.update(changes)
        return save_receipt(self.db, **args)

    def count(self, table):
        return self.db.execute(f"SELECT count(*) FROM {table}").fetchone()[0]

    def test_creates_exactly_one_receipt_and_outbox_entry(self):
        status, receipt = self.save()
        self.assertEqual(status, "CREATED")
        self.assertTrue(receipt)
        self.assertEqual(self.count("inbound_receipts"), 1)
        self.assertEqual(self.count("inbound_review_outbox"), 1)

    def test_identical_retry_does_not_duplicate(self):
        first = self.save()
        second = self.save()
        self.assertEqual(second, ("REPLAY", first[1]))
        self.assertEqual(self.count("inbound_receipts"), 1)
        self.assertEqual(self.count("inbound_review_outbox"), 1)

    def test_changed_payload_is_conflict(self):
        self.save()
        with self.assertRaises(ReceiptConflict):
            self.save(validated_payload={**PAYLOAD, "email": "changed@example.invalid"})
        self.assertEqual(self.count("inbound_receipts"), 1)

    def test_changed_triage_is_conflict(self):
        self.save()
        with self.assertRaises(ReceiptConflict):
            self.save(triage_code="GENERAL")
        self.assertEqual(self.count("inbound_review_outbox"), 1)

    def test_tenant_isolation(self):
        first = self.save()
        second = self.save(tenant_key="another")
        self.assertNotEqual(first[1], second[1])
        self.assertEqual(self.count("inbound_receipts"), 2)

    def test_raw_pii_and_token_not_stored(self):
        self.save()
        row = repr(self.db.execute("SELECT * FROM inbound_receipts").fetchone())
        self.assertNotIn("private@example.invalid", row)
        self.assertNotIn("Sample HVAC", row)
        self.assertNotIn(TOKEN, row)

    def test_bad_secret_rejected_without_writes(self):
        with self.assertRaises(ValueError):
            self.save(hmac_secret=b"short")
        self.assertEqual(self.count("inbound_receipts"), 0)

    def test_invalid_payload_rejected_without_writes(self):
        with self.assertRaises(ValueError):
            self.save(validated_payload={"x": float("nan")})
        self.assertEqual(self.count("inbound_receipts"), 0)

    def test_outbox_failure_rolls_back_receipt(self):
        self.db.execute("""CREATE TRIGGER break_outbox BEFORE INSERT
                           ON inbound_review_outbox BEGIN SELECT RAISE(ABORT, 'injected'); END""")
        with self.assertRaises(sqlite3.IntegrityError):
            self.save()
        self.assertEqual(self.count("inbound_receipts"), 0)
        self.assertEqual(self.count("inbound_review_outbox"), 0)

    def test_nested_transaction_is_rejected(self):
        self.db.execute("BEGIN")
        try:
            with self.assertRaises(RuntimeError):
                self.save()
        finally:
            self.db.execute("ROLLBACK")
        self.assertEqual(self.count("inbound_receipts"), 0)


if __name__ == "__main__":
    unittest.main()
