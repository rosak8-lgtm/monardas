import { Button, Eyebrow } from "@/components/site";

const privacy = [
  [
    "Website operator",
    "MONARDAS is operated by Iurii Shalygin in Georgia. MONARDAS provides B2B revenue-recovery and workflow automation services for home-service businesses, with a current focus on recovering unsold HVAC replacement estimates. Privacy and support contact: yurii@monardas.com.",
  ],
  [
    "Scope and contact",
    "This policy describes how the MONARDAS website handles information submitted through its inquiry forms. For questions about this policy or your inquiry, contact yurii@monardas.com. It does not cover homeowner records supplied for a recovery pilot; arrangements for those records must be defined separately before a pilot begins.",
  ],
  [
    "Information you provide",
    "The audit form requires your name, company and work email. Website, phone number, CRM/FSM or export format and notes are optional. Please do not submit homeowner lists, passwords, payment details or sensitive personal information through this form.",
  ],
  [
    "How the form uses your information",
    "Your submission is used to review your inquiry, assess whether a recovery pilot may be suitable and respond to you. The form sends your details, request type and available campaign/source information to the MONARDAS lead inbox through Resend. Your email address is included as the reply-to address. Submitting an inquiry does not enroll you in a subscription or commit you to a paid pilot.",
  ],
  [
    "Website and email processing",
    "The website is configured to run on Cloudflare Workers with request logging enabled. Cloudflare processes requests to serve the site and operate that infrastructure. Resend processes the submitted form fields to deliver the inquiry email. The receiving email service also processes and stores the delivered message. The website application does not save submissions to an application database or intentionally write form contents to its logs.",
  ],
  [
    "Cookies and browser storage",
    "The website does not set application cookies or use advertising pixels or third-party analytics. It uses this tab’s session storage for campaign labels (utm_source, utm_medium, utm_campaign, utm_content and utm_term), the landing-page path and referring website origin when available. Full referrer paths and query strings are not retained by this feature. These details can accompany your inquiry so we can understand its source. Form entries are not saved in browser storage. Calculator inputs stay in the page and are not submitted by the calculator.",
  ],
  [
    "Website measurement",
    "A small first-party script records HVAC page views, audit-link clicks and contact-form views. The server also records successful HVAC inquiry acceptance after the email provider accepts a message; this is not a count of sales or confirmed mailbox deliveries. Event records contain the event name and page path, without form contents, campaign values or unique visitor identifiers. These events are stored in the existing Cloudflare request-log infrastructure, which also processes technical request metadata. Browser measurement and source storage are skipped when Do Not Track or Global Privacy Control is detected; server success events are skipped when those request headers are present.",
  ],
  [
    "Access and retention",
    "Within MONARDAS, inquiry access is currently limited to Iurii Shalygin. We retain inquiry data only for as long as reasonably necessary to respond to the inquiry, manage a potential business relationship, and comply with applicable legal obligations.",
  ],
  [
    "Stored correspondence and requests",
    "An inquiry becomes an email record rather than an account in this website. Copies may remain in the lead inbox and email delivery records; closing the page does not delete those copies. Contact yurii@monardas.com to ask about information you submitted, request a correction or deletion, or ask us to stop following up. Do not send sensitive identity documents with your initial request.",
  ],
  [
    "Changes",
    "Changes to this website’s information handling will be reflected in this policy. Review this page before submitting new information.",
  ],
] as const;

const terms = [
  [
    "Website operator",
    "MONARDAS is operated by Iurii Shalygin in Georgia. MONARDAS provides B2B revenue-recovery and workflow automation services for home-service businesses, with a current focus on recovering unsold HVAC replacement estimates. Contact: yurii@monardas.com.",
  ],
  [
    "About this website",
    "The MONARDAS website provides business information and a way to inquire about B2B revenue-recovery and workflow automation services for home-service businesses. The current focus is recovering unsold HVAC replacement estimates. Questions about the website or these terms can be sent to yurii@monardas.com. These terms concern website use; they are not an agreement to deliver services.",
  ],
  [
    "Inquiries and pilot agreements",
    "The initial HVAC revenue-recovery review is free and does not commit you to a paid pilot. Any pilot is paid and custom. Its scope, timing, responsibilities, pricing and other commercial terms are agreed before work begins; messaging, contact method, exclusions and sales handoff are agreed before homeowner outreach. Payment is due under the agreed terms and invoice. Sending a form does not purchase a service, reserve capacity or authorize homeowner outreach.",
  ],
  [
    "Information you submit",
    "Provide accurate business contact information and only information you are authorized to share. The inquiry form is for a description of your business needs, not for transferring homeowner records or sensitive information. Any later transfer of estimate records requires separate arrangements.",
  ],
  [
    "Contractor responsibilities",
    "Your team remains responsible for technical recommendations, equipment selection, pricing, financing, appointments and closing sales. Before supplying homeowner or lead records for a pilot, you must have the authority and lawful basis required to share and use those records for the agreed purpose. Eligible contacts, exclusions and outreach arrangements must be agreed before work begins. These terms do not establish that any particular contact may lawfully be approached.",
  ],
  [
    "Cancellation and refund requests",
    "Cancellation and refund terms for each paid pilot are defined in its proposal or order before payment. Requests are considered against the agreed scope and work already performed. Contact yurii@monardas.com to discuss a request. The Pilot Cancellation and Refund Policy provides further information; it does not replace the separately agreed pilot terms.",
  ],
  [
    "Examples and outcomes",
    "Demonstrations and calculator outputs are illustrative, not customer results, forecasts or promises. Actual responses, sales and revenue depend on the records, homeowner decisions and your team’s sales process. MONARDAS does not guarantee replies, conversions or revenue. A described workflow does not establish that an integration is available for your systems.",
  ],
  [
    "Acceptable use",
    "Use the website for legitimate inquiries and information. Do not submit spam, impersonate others, attempt unauthorized access or interfere with the website or its forms.",
  ],
  [
    "Availability and external links",
    "Website information may be updated and the site or form may occasionally be unavailable. If a submission fails, try again or contact yurii@monardas.com. Links to other websites are provided for reference; those websites have their own terms and privacy practices.",
  ],
  [
    "Privacy and changes",
    "The Privacy Policy explains the current website’s handling of inquiry information. Updated website terms will appear on this page. Any paid pilot remains subject to the separate terms agreed for that pilot.",
  ],
] as const;

const refunds = [
  [
    "Scope",
    "MONARDAS is operated by Iurii Shalygin in Georgia. This policy concerns separately scoped B2B HVAC recovery pilots. The initial estimate recovery review is free and does not commit you to a purchase.",
  ],
  [
    "Before a paid pilot",
    "Scope, price, payment terms and applicable cancellation and refund terms are agreed in the proposal or order before payment and before work starts. Please review those terms before accepting a pilot.",
  ],
  [
    "Cancellation and refunds",
    "To request cancellation or a refund, contact yurii@monardas.com with your company name and pilot reference. Requests are considered according to the agreed scope, the proposal or order and work already performed. A request does not automatically establish entitlement to a full refund. Nothing in this policy removes rights that cannot be excluded under applicable law.",
  ],
  [
    "Subscriptions",
    "MONARDAS does not currently offer an active subscription product through this website. Subscription cancellation rules will be published if subscription products become available.",
  ],
] as const;

export function LegalPage({
  page,
}: {
  page: "privacy" | "terms" | "refund-policy";
}) {
  const title =
    page === "privacy"
      ? "Privacy Policy"
      : page === "terms"
        ? "Terms of Use"
        : "Pilot Cancellation and Refund Policy";
  return (
    <section className="container page-hero legal">
      <Eyebrow>
        MONARDAS /{" "}
        {page === "privacy"
          ? "Privacy"
          : page === "terms"
            ? "Website terms"
            : "Pilot policy"}
      </Eyebrow>
      <h1>{title}</h1>
      {(page === "privacy" ? privacy : page === "terms" ? terms : refunds).map(
        ([heading, copy]) => (
          <div key={heading}>
            <h2>{heading}</h2>
            <p>{copy}</p>
          </div>
        ),
      )}
      <Button href={page === "terms" ? "/privacy" : "/terms"} secondary>
        {page === "terms" ? "Privacy Policy" : "Terms of Use"}
      </Button>
    </section>
  );
}
