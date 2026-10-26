import Link from "next/link";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(
  "Cashflow — Internal Gmail Workflow",
  "MONARDAS Cashflow is an owner-operated internal tool for managing business outreach and monitoring replies using Google Gmail.",
  "/cashflow",
);

export default function CashflowPage() {
  return (
    <section className="section container" aria-labelledby="cashflow-heading">
      <div style={{ maxWidth: 820, margin: "0 auto" }}>
        <p className="eyebrow">MONARDAS / Internal operations</p>
        <h1 id="cashflow-heading">MONARDAS Cashflow</h1>
        <p className="lead">
          An internal, owner-operated workflow that supports business outreach,
          Gmail reply monitoring, and notifications about incoming responses.
          It is not a public Gmail integration or a service that third parties
          can sign into.
        </p>

        <h2>What this application does</h2>
        <p>
          The operator connects a Google account through OAuth. With permission,
          the application can review relevant Gmail threads and identify incoming
          replies to business conversations. It records limited message metadata
          so the same reply does not generate repeated alerts.
        </p>
        <p>
          The application also requests Gmail sending permission for a controlled
          business-outreach workflow. Automated outbound sending and automatic
          responses are currently disabled; granting OAuth permission alone does
          not enable those actions.
        </p>

        <h2>Notifications and security</h2>
        <p>
          When a relevant reply is identified, the application can send a
          Telegram notification containing the company, sender email address,
          and detection timestamp. The notification does not include the email
          body. OAuth credentials are held in access-restricted server files.
        </p>

        <h2>Who uses it</h2>
        <p>
          Cashflow is intended for use by the MONARDAS operator with an
          explicitly authorized Google account. There is no public signup.
        </p>

        <h2>Privacy and questions</h2>
        <p>
          Read our <Link href="/cashflow/privacy">Cashflow Privacy Policy</Link>{" "}
          for details about access, storage, sharing, retention, and revoking
          permissions. For questions or deletion requests, contact{" "}
          <a href="mailto:rosak8@gmail.com">rosak8@gmail.com</a>.
        </p>
      </div>
    </section>
  );
}
