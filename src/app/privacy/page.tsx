import { CompliancePage } from "@/components/compliance-layout";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(
  "Privacy Policy",
  "MONARDAS privacy information for website visitors, business contact forms and limited first-party analytics.",
  "/privacy",
);

export default function PrivacyPage() {
  return (
    <CompliancePage
      label="MONARDAS / PRIVACY"
      title="Privacy policy"
      description="We collect only information needed to operate this site, respond to business inquiries and understand aggregate visitor journeys."
    >
      <section>
        <h2>1. Who handles the data?</h2>
        <p>Website operator: <strong>Individual Entrepreneur Iurii Shalygin</strong> (MONARDAS), registered in Georgia, identification number <strong>312796356</strong>, business location Kutaisi, Georgia. Privacy contact: <a href="mailto:yurii@monardas.com">yurii@monardas.com</a>.</p>
      </section>
      <section>
        <h2>2. Information you choose to send</h2>
        <p>When you send an inquiry, we may receive your name, business name, work email, optional phone number, company website, CRM information, preferred reply channel and the message you provide. We use this information to review fit, reply to your inquiry and arrange a pilot only if you agree. Submitting a form does not subscribe you to marketing emails.</p>
        <p>Please do not send homeowner names, addresses, telephone numbers, customer exports, credentials or other sensitive client records through public forms.</p>
      </section>
      <section>
        <h2>3. Technical and campaign information</h2>
        <p>The site may use temporary session storage to retain basic campaign tags and a sanitized landing-page path or referrer origin so a business inquiry can be attributed to its source. The site also records limited first-party, event-only visit or button-click counts for operational measurement, without deliberately including form contact details in those event records.</p>
        <p>Our attribution and optional event measurement are disabled when the browser signals Do Not Track or Global Privacy Control, as implemented in the current website. Hosting and infrastructure providers may process necessary technical logs for service delivery and security.</p>
      </section>
      <section>
        <h2>4. Service providers and international processing</h2>
        <p>MONARDAS uses infrastructure providers for website delivery and an email delivery provider (Resend) to route accepted form inquiries to our controlled business mailbox. Processing and storage may occur outside your country subject to the providers' terms and applicable safeguards. We do not sell business contact information to advertisers.</p>
        <p>If software purchases become available, the approved checkout provider will process payment information under its own notices and terms. We do not currently operate an active paid checkout on this website.</p>
      </section>
      <section>
        <h2>5. Retention and protection</h2>
        <p>Inquiry communications are retained for the time reasonably needed to respond, manage any agreed business relationship, resolve disputes and meet legal obligations, then deleted or archived in accordance with applicable requirements. Technical security, access limitation and service-provider controls are used to reduce unauthorized access risk; no internet transmission is completely risk-free.</p>
      </section>
      <section>
        <h2>6. Your choices and rights</h2>
        <p>You may request information about data held about you, correction or deletion where legally applicable, or object to certain processing. Email <a href="mailto:yurii@monardas.com">yurii@monardas.com</a>. We may need to confirm your identity before acting. You may also use browser privacy controls and avoid submitting optional information.</p>
      </section>
      <section>
        <h2>7. Updates</h2>
        <p>We may update this notice when the site or software changes. The current date is shown at the top of this page. Contact us with questions about privacy or vendor handling.</p>
      </section>
    </CompliancePage>
  );
}
