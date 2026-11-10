import unittest
from scripts.dsn_evidence_review import classify_eml, classify_visible_notice

RECIPIENT = "test@customer.example"


def eml(action="failed", status="5.1.3", recipient=RECIPIENT, status_block=True):
    part = (f"Final-Recipient: rfc822; {recipient}\n"
            f"Action: {action}\n"
            f"Status: {status}\n")
    if not status_block:
        return (f"From: mailer-daemon@example.com\nSubject: 550 5.7.1 Delivery failed\n\n"
                f"Final-Recipient: {recipient}, {part}").encode()
    return (f"From: mailer-daemon@example.com\nTo: sender@example.com\n"
            "MIME-Version: 1.0\n"
            "Content-Type: multipart/report; report-type=delivery-status; boundary=\"MONARDAS\"\n\n"
            "--MONARDAS\nContent-Type: text/plain\n\nMessage could not be delivered\n"
            "--MONARDAS\nContent-Type: message/delivery-status\n\n"
            + part + "\n--MONARDAS--\n").encode()


class ReviewTests(unittest.TestCase):
    def expect(self, raw, target, classification, code=""):
        res = classify_eml(raw, target)
        self.assertEqual(res["classification"], classification)
        self.assertEqual(res["enhanced_smtp_status"], code)
        self.assertEqual(res["decision"], "HOLD_NO_SEND")
        self.assertTrue(res["historical_bounce_unchanged"])
        self.assertTrue(res["suppression_unchanged"])
        self.assertNotIn(target, str(res))

    def test_address_513(self):
        self.expect(eml(), RECIPIENT, "PERMANENT_RECIPIENT_FAILURE", "5.1.3")

    def test_address_511(self):
        self.expect(eml(status="5.1.1"), RECIPIENT, "PERMANENT_RECIPIENT_FAILURE", "5.1.1")

    def test_policy_571(self):
        self.expect(eml(status="5.7.1"), RECIPIENT, "POLICY_REJECTION", "5.7.1")

    def test_permanent_other(self):
        self.expect(eml(status="5.2.2"), RECIPIENT, "PERMANENT_OTHER_FAILURE_REVIEW", "5.2.2")

    def test_delayed(self):
        self.expect(eml(action="delayed", status="4.4.1"), RECIPIENT, "TEMPORARY_OR_DELAYED_REVIEW", "4.4.1")

    def test_failed_temp(self):
        self.expect(eml(action="failed", status="4.7.0"), RECIPIENT, "TEMPORARY_OR_DELAYED_REVIEW", "4.7.0")

    def test_no_dsn_text(self):
        self.expect(eml(status_block=False), RECIPIENT, "UNVERIFIED_FAILURE_REVIEW")

    def test_wrong_recipient(self):
        self.expect(eml(recipient="other@customer.example"), RECIPIENT, "UNVERIFIED_FAILURE_REVIEW")

    def test_invalid_status(self):
        self.expect(eml(status="garbage"), RECIPIENT, "INVALID_DSN_STATUS_REVIEW")

    def test_inconsistent(self):
        self.expect(eml(action="delayed", status="5.1.3"), RECIPIENT, "INCONSISTENT_DSN_REVIEW", "5.1.3")

    def test_double_recipient_block(self):
        raw = eml().replace(
            b"\n--MONARDAS--",
            b"\nFinal-Recipient: rfc822; test@customer.example\nAction: failed\nStatus: 5.7.1\n\n--MONARDAS--",
        )
        self.expect(raw, RECIPIENT, "CONFLICTING_DSN_REVIEW")

    def test_invalid_target(self):
        with self.assertRaises(ValueError):
            classify_eml(eml(), "../bad")

    def test_empty_eml(self):
        with self.assertRaises(ValueError):
            classify_eml(b"", RECIPIENT)

    def test_reputation_screenshot(self):
        result = classify_visible_notice(
            "Temporary recipient failure", "550 5.7.1 blocked using Proofpoint Dynamic Reputation"
        )
        self.assertEqual(result["classification"], "DISPLAY_REPUTATION_OR_POLICY_SIGNAL")
        self.assertEqual(result["decision"], "HOLD_NO_SEND")

    def test_roby_screenshot(self):
        result = classify_visible_notice("Unknown error", "EOF [DATA_END]")
        self.assertEqual(result["classification"], "DISPLAY_TRANSPORT_UNVERIFIED")

    def test_firsthand_screenshot(self):
        result = classify_visible_notice(
            "Address not found", "Account that you tried to reach does not exist"
        )
        self.assertEqual(result["classification"], "DISPLAY_RECIPIENT_ADDRESS_SIGNAL")


if __name__ == "__main__":
    unittest.main()
