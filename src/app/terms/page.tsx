import { CompliancePage } from "@/components/compliance-layout";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(
  "Terms of Service",
  "Terms governing the MONARDAS website, free HVAC founding pilot applications and future software orders.",
  "/terms",
);

export default function TermsPage() {
  return (
    <CompliancePage
      label="MONARDAS / LEGAL"
      title="Terms of service"
      description="These terms explain the MONARDAS website and its current pre-launch offerings. They do not create a paid software subscription."
    >
      <section>
        <h2>1. Operator and contact</h2>
        <p>MONARDAS is operated by <strong>Individual Entrepreneur Iurii Shalygin</strong>, registered in Georgia, identification number <strong>312796356</strong>. Business location: Kutaisi, Georgia. Contact: <a href="mailto:yurii@monardas.com">yurii@monardas.com</a>.</p>
      </section>
      <section>
        <h2>2. Services and current availability</h2>
        <p>MONARDAS develops B2B software and workflows for U.S. HVAC contractors to review unsold replacement estimates, organize approved follow-up steps and report outcomes. Product demonstrations may contain illustrative or fictional data and must not be interpreted as results from real customers.</p>
        <p>The current founding program is a limited, manually supported, 30-day free pilot. Applying does not guarantee acceptance, availability, a defined start date or a commercial relationship. A pilot begins only after scope, roles and start date are separately agreed in writing.</p>
        <p><strong>Paid SaaS subscriptions are not currently available for purchase on this website.</strong> Any optional managed services or bespoke implementation are governed by a separate written agreement and are not charged through Paddle.</p>
      </section>
      <section>
        <h2>3. Free pilot boundaries</h2>
        <p>The pilot may cover up to 25 agreed eligible estimates, review of their status and exclusions, message drafts subject to contractor approval, and progress updates. There are no payment details to submit, no automatic conversion to a paid plan and no recurring charges.</p>
        <p>The contractor is responsible for customer communications and lawful permission to contact homeowners. MONARDAS will not independently send messages, call or text homeowners without a further written authorization and verification of eligible channels, exclusions and opt-out handling.</p>
      </section>
      <section>
        <h2>4. Future software subscription terms</h2>
        <p>Before paid SaaS orders are accepted, MONARDAS will publish an effective software offer identifying access, functionality, recurring price, billing period, renewal rules, cancellation procedure, any applicable trial and refund conditions. Customers must expressly accept that offer during checkout.</p>
        <p>When an approved Paddle checkout is enabled, Paddle will act as merchant of record for eligible digital purchases, and the checkout will identify relevant payment, tax and billing information. A subscription will not be created merely by using this site or joining the free pilot.</p>
      </section>
      <section>
        <h2>5. Website use and personal data</h2>
        <p>Do not submit homeowner personal data, confidential customer files, credentials or other sensitive information through the public contact form. Provide only your own business contact information and a summary of your needs. Our <a href="/privacy">Privacy Policy</a> explains the current handling of inquiries and basic site analytics.</p>
      </section>
      <section>
        <h2>6. Intellectual property and disclaimers</h2>
        <p>The MONARDAS name, content and demonstration materials are provided for evaluation and may not be reproduced commercially without permission. Any third-party trademarks remain the property of their owners.</p>
        <p>We provide informational materials and illustrations without guaranteeing recovered revenue, appointments, contract awards, integrations or uninterrupted service. This limitation does not exclude rights or obligations that applicable law does not allow us to limit.</p>
      </section>
      <section>
        <h2>7. Changes and questions</h2>
        <p>We may update this website notice with a revised date. Material terms for any future paid subscription will be presented before purchase; changes to an agreed contract follow that contract and applicable law. Contact <a href="mailto:yurii@monardas.com">yurii@monardas.com</a> for questions.</p>
      </section>
    </CompliancePage>
  );
}
