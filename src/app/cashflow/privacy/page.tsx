import Link from "next/link";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(
  "Cashflow Privacy Policy",
  "How the internal MONARDAS Cashflow workflow accesses, uses, stores, and protects Gmail data.",
  "/cashflow/privacy",
);

export default function CashflowPrivacyPage() {
  return (
    <section className="section container" aria-labelledby="cashflow-privacy-heading">
      <div style={{ maxWidth: 820, margin: "0 auto" }}>
        <p className="eyebrow">MONARDAS / Cashflow</p>
        <h1 id="cashflow-privacy-heading">Cashflow Privacy Policy</h1>
        <p><strong>Last updated:</strong> October 26, 2026</p>
        <p>
          This notice explains how the owner-operated MONARDAS Cashflow
          application uses information from an explicitly connected Google
          account. It applies to the internal Cashflow workflow, not to every
          service or page operated under the MONARDAS brand.
        </p>

        <h2>Operator and contact</h2>
        <p>
          MONARDAS operates this internal workflow. Questions, access requests,
          revocation assistance, or deletion requests can be sent to{" "}
          <a href="mailto:rosak8@gmail.com">rosak8@gmail.com</a>.
        </p>

        <h2>Google permissions requested</h2>
        <ul>
          <li>
            <code>gmail.readonly</code> allows the application to read Gmail
            messages and thread metadata. The current reply monitor accesses
            sender headers, Gmail message and thread identifiers, mailbox
            labels, and information necessary to find replies to selected
            business conversations; it does not routinely retrieve message
            bodies.
          </li>
          <li>
            <code>gmail.send</code> permits sending email through the authorized
            account. Sending is currently disabled in the automated Cashflow
            workflow and requires separate operational controls before use.
          </li>
        </ul>
        <p>
          These permissions provide broader technical access than the current
          monitoring process uses. The application is not intended to read
          unrelated correspondence or send messages without operator-approved
          procedures.
        </p>

        <h2>Purpose and information processed</h2>
        <p>
          Information is processed to locate replies to prior business
          outreach, associate them with the relevant company, prevent duplicate
          notifications, troubleshoot delivery, and support follow-up by the
          operator. The monitor may store Gmail message IDs, thread IDs,
          company labels, sender email addresses, detection timestamps, and
          notification status in a local SQLite database.
        </p>

        <h2>Storage and access</h2>
        <p>
          OAuth client configuration and access or refresh tokens are stored in
          restricted files on a privately administered cloud server. Reply
          metadata is stored in an application-specific database. Files and
          database records are limited to the operator and services authorized
          to run the workflow. The workflow does not publish mailbox data on
          this website.
        </p>

        <h2>Sharing and third parties</h2>
        <p>
          The app communicates with Google Gmail API to access the connected
          mailbox. For reply alerts, it may provide Telegram with the company
          label, sender email address, and detection timestamp, but not the
          email body. Google and Telegram process information under their own
          applicable terms and privacy notices. Cashflow does not sell Google
          user data, use Gmail data for advertising targeting, or use Gmail data
          to train general-purpose artificial intelligence models.
        </p>

        <h2>Retention and deletion</h2>
        <p>
          Reply metadata is retained while required to monitor relevant
          business correspondence, prevent duplicate notifications, and
          maintain operational records. It can be removed upon a verified
          deletion request or when no longer needed. Revoking Google access
          prevents new authorized API requests but does not automatically
          erase records already saved by the application; contact the operator
          to request their deletion.
        </p>

        <h2>Revoking access</h2>
        <p>
          You can review and revoke this app’s Google account access through{" "}
          <a href="https://myaccount.google.com/connections">
            Google Account connections
          </a>
          . You may also request removal of the saved OAuth credentials
          and related application records via the contact address above.
        </p>

        <h2>Security and changes</h2>
        <p>
          Access restrictions and encrypted transport are used to reduce
          unauthorized access. No security measure guarantees absolute
          protection. We may update this policy if the workflow or data uses
          change, and will update the date shown above.
        </p>

        <p>
          <Link href="/cashflow">Return to MONARDAS Cashflow</Link>
        </p>
      </div>
    </section>
  );
}
