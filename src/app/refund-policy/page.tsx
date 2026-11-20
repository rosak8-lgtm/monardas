import Link from "next/link";
import { CompliancePage } from "@/components/compliance-layout";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(
  "Refund and Cancellation Policy",
  "Cancellation rules for the current free MONARDAS HVAC pilot, and how future SaaS purchases would be handled.",
  "/refund-policy",
);

export default function RefundPolicyPage() {
  return (
    <CompliancePage
      label="MONARDAS / BILLING"
      title="Refund and cancellation policy"
      description="The current founding HVAC pilot is free. No paid SaaS subscription, Paddle checkout or automatic renewal is active on this website."
    >
      <section>
        <h2>1. Free 30-day pilot: $0</h2>
        <p>The founding program costs $0, has no card requirement and does not convert into a paid plan. You may withdraw an application at any time by emailing <a href="mailto:yurii@monardas.com">yurii@monardas.com</a>. If a pilot has started, either side may request an early stop; we will coordinate the handoff and any agreed data handling.</p>
        <p>Because no money is charged for the free pilot, there is no pilot payment to refund.</p>
      </section>
      <section>
        <h2>2. Future SaaS subscriptions</h2>
        <p><strong>No paid software subscription is currently on sale.</strong> Before subscriptions are enabled, customers will be shown the final recurring price, billing period, renewal schedule, access rights, refund terms and cancellation method during checkout. We will not begin recurring billing without an affirmative purchase.</p>
        <p>When a paid software offer launches, customers will be able to request cancellation of future renewals using the method specified in their order or by contacting <a href="mailto:yurii@monardas.com">yurii@monardas.com</a>. Canceling prevents future renewals according to the effective order terms; it does not automatically reverse a payment that has already been processed.</p>
      </section>
      <section>
        <h2>3. Payment issues, refunds and legal rights</h2>
        <p>If a future software charge is duplicate, unauthorized, technically erroneous, or otherwise refundable under the applicable terms or law, contact us promptly with the order email, date, amount and transaction reference. Never send full card details or passwords.</p>
        <p>For purchases where Paddle acts as Merchant of Record, eligible refunds and payment disputes are processed with Paddle under the effective checkout terms and applicable law. Nothing in this policy limits mandatory customer rights.</p>
      </section>
      <section>
        <h2>4. Separate managed services</h2>
        <p>Founder-led consulting, customized workflows or other human services are separately scoped and contracted. They are not currently sold through Paddle. The relevant signed service agreement, rather than a software checkout policy, governs payment, cancellation, completed work and any refund for those services.</p>
      </section>
      <section>
        <h2>5. Questions</h2>
        <p>Operator: Individual Entrepreneur Iurii Shalygin, MONARDAS, Georgia. Email: <a href="mailto:yurii@monardas.com">yurii@monardas.com</a>. See also our <Link href="/terms">Terms of Service</Link> and <Link href="/pricing">Pricing page</Link>.</p>
      </section>
    </CompliancePage>
  );
}
