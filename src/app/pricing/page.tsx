import Link from "next/link";
import { CompliancePage, styles } from "@/components/compliance-layout";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(
  "Pricing and Product Availability",
  "Current free MONARDAS HVAC pilot and transparent information about planned B2B SaaS subscriptions; no checkout or automatic charges.",
  "/pricing",
);

export default function PricingPage() {
  return (
    <CompliancePage
      label="MONARDAS / PRODUCT & PRICING"
      title="Straightforward scope. No surprise charges."
      description="MONARDAS supports U.S. residential HVAC companies working through unsold replacement estimates. Our current founding program is free. The software subscription is in development and is not for sale yet."
    >
      <div className={styles.grid}>
        <article className={styles.plan}>
          <p className={styles.kicker}>Currently accepting applications</p>
          <h2>Founding HVAC pilot</h2>
          <strong>$0</strong>
          <p>30 calendar days, subject to acceptance and an agreed start date. No card, automatic renewal, or obligation to purchase.</p>
          <ul>
            <li>Up to 25 eligible, unsold residential replacement estimates.</li>
            <li>Prioritized follow-up plan and contractor-approved message drafts.</li>
            <li>Up to two agreed next actions per eligible estimate.</li>
            <li>Weekly progress review and final outcome summary.</li>
          </ul>
          <Link className={styles.button} href="/hvac/free-pilot">Apply for the free pilot</Link>
        </article>
        <article className={styles.plan}>
          <p className={styles.kicker}>Software / pre-launch</p>
          <h2>Revenue Recovery OS subscription</h2>
          <strong>Not on sale</strong>
          <p>Planned B2B software for estimate prioritization, controlled follow-up workflows and reporting. Features shown in the interactive demo use fictional records.</p>
          <ul>
            <li>No recurring price has been finalized or activated.</li>
            <li>No Paddle checkout is available for this offering yet.</li>
            <li>Paid features, final USD pricing, billing frequency and cancellation terms will be published before orders can be placed.</li>
            <li>Customer records and autonomous contact capabilities are subject to separate authorization and safety review.</li>
          </ul>
          <Link className={styles.button} href="/hvac/demo">Explore the fictional-data demo</Link>
        </article>
      </div>
      <section>
        <h2>Managed services are separate</h2>
        <p>Any optional paid founder-led recovery pilot, consulting, or bespoke implementation is subject to a separate written proposal. These human services are not offered for purchase through Paddle. We do not claim that they are software subscriptions.</p>
      </section>
      <section>
        <h2>Before any future software purchase</h2>
        <p>Customers will see the final product description, current USD price, taxes where applicable, billing cycle, renewal rules, cancellation method and refund policy before authorizing a payment. Checkout and recurring billing will only be activated after product readiness and payment-provider approval.</p>
        <p>Questions? Email <a href="mailto:yurii@monardas.com">yurii@monardas.com</a>.</p>
      </section>
    </CompliancePage>
  );
}
