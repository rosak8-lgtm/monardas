import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "MONARDAS Cashflow — Private Gmail Reply Monitoring",
  description:
    "Information about MONARDAS Cashflow, an operator-only business outreach tracking application using read-only Gmail access.",
  alternates: { canonical: "/cashflow" },
  robots: { index: true, follow: true },
};

const sections = [
  {
    title: "What this application does",
    text: "MONARDAS Cashflow is a private, operator-only workflow for tracking legitimate business outreach, identifying replies to previously sent inquiries, and notifying the MONARDAS operator when a contact responds. It is not a public Gmail service and does not provide access to other people's mailboxes.",
  },
  {
    title: "Google account permissions",
    text: "The Oracle-hosted Gmail connection requests Gmail read-only access. It reads relevant message and thread metadata, sender and recipient information, and Gmail labels to associate replies with earlier outbound inquiries. This connection cannot send or delete emails and cannot accept a project or contract.",
  },
  {
    title: "Processing and notifications",
    text: "The workflow maintains a limited record of business contact addresses, associated company names, message and thread identifiers, and relevant event timestamps in access-controlled server databases. When an incoming reply is detected, a notification may be delivered through the operator's configured Telegram chat containing the company name, sender address, and detection time.",
  },
  {
    title: "Other outreach tools",
    text: "Business outreach may be prepared or sent through separate, independently authorized workflows. The server's Google OAuth read-only permission is used for monitoring and record matching; it is not the permission used to send outreach.",
  },
  {
    title: "Access, retention, and control",
    text: "This workflow is operated for the MONARDAS business account, not offered for third-party sign-up. Access is limited to the authorized operator. The operator can disconnect Google account access and request review or deletion of operational records, subject to applicable retention obligations.",
  },
] as const;

export default function CashflowPage() {
  return (
    <section className="container page-hero legal">
      <div className="eyebrow">MONARDAS / Internal application disclosure</div>
      <h1>MONARDAS Cashflow</h1>
      <p>
        Private business outreach tracking and Gmail reply monitoring for the
        MONARDAS operator in Georgia.
      </p>
      {sections.map(({ title, text }) => (
        <div key={title}>
          <h2>{title}</h2>
          <p>{text}</p>
        </div>
      ))}
      <div>
        <h2>Privacy, terms, and support</h2>
        <p>
          Read our <Link href="/privacy">Privacy Policy</Link> and{" "}
          <Link href="/terms">Terms of Use</Link>. For questions or data
          requests, email{" "}
          <a href="mailto:yurii@monardas.com">yurii@monardas.com</a>.
        </p>
      </div>
    </section>
  );
}
