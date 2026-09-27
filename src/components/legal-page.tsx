import { Button, Eyebrow } from "@/components/site";

const privacy = [
  [
    "Website operator",
    "MONARDAS is operated by Yurii Shalygin, Individual Entrepreneur registered in Georgia. Business/legal address: Georgia, Kutaisi, Paliashvilli str., 35-34. Privacy and support contact: yurii@monardas.com.",
  ],
  [
    "Scope and contact",
    "This policy describes how the MONARDAS website handles information submitted through its inquiry forms. For questions about this policy or your inquiry, contact yurii@monardas.com. It does not cover homeowner records supplied for a recovery pilot; arrangements for those records must be defined separately before a pilot begins.",
  ],
  [
    "Information you provide",
    "The HVAC audit form asks for your first name, company, company website and work email. Phone number, CRM/FSM or export format, approximate unsold replacement estimate count and a message are optional. Other inquiry forms also ask for your last name, industry and estimate volume. Please do not submit homeowner lists, passwords, payment details or sensitive personal information through this form.",
  ],
  [
    "How the form uses your information",
    "Your submission is used to review your inquiry, assess whether a recovery pilot may be suitable and respond to you. The form sends your details and request type to the MONARDAS lead inbox through Resend. Your email address is included as the reply-to address. Submitting an inquiry does not enroll you in a subscription or commit you to a paid pilot.",
  ],
  [
    "Website and email processing",
    "The website is configured to run on Cloudflare Workers with request logging enabled. Cloudflare processes requests to serve the site and operate that infrastructure. Resend processes the submitted form fields to deliver the inquiry email. The receiving email service also processes and stores the delivered message. The website application does not save submissions to an application database or intentionally write form contents to its logs.",
  ],
  [
    "Cookies and browser storage",
    "The current website application does not set cookies, use advertising pixels or analytics scripts, or save form entries in browser local storage or session storage. Calculator inputs are processed in the page and are not submitted by the calculator. This describes the application itself; infrastructure request logging is described above.",
  ],
  [
    "Access and retention",
    "Within MONARDAS, inquiry access is currently limited to Yurii Shalygin. We retain inquiry data only for as long as reasonably necessary to respond to the inquiry, manage a potential business relationship, and comply with applicable legal obligations.",
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
    "MONARDAS is operated by Yurii Shalygin, Individual Entrepreneur registered in Georgia. Business/legal address: Georgia, Kutaisi, Paliashvilli str., 35-34. Contact: yurii@monardas.com.",
  ],
  [
    "About this website",
    "The MONARDAS website provides business information and a way to inquire about services. Questions about the website or these terms can be sent to yurii@monardas.com. These terms concern website use; they are not an agreement to deliver a recovery pilot.",
  ],
  [
    "Inquiries and pilot agreements",
    "The initial HVAC revenue recovery review is free and does not commit you to a paid pilot. A pilot is paid. Pricing, scope, timing, responsibilities, messaging, contact method, exclusions and sales handoff are agreed separately before homeowner outreach begins. Sending a form does not purchase a service, reserve capacity or authorize homeowner outreach.",
  ],
  [
    "Information you submit",
    "Provide accurate business contact information and only information you are authorized to share. The inquiry form is for a description of your business needs, not for transferring homeowner records or sensitive information. Any later transfer of estimate records requires separate arrangements.",
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

export function LegalPage({ page }: { page: "privacy" | "terms" }) {
  return (
    <section className="container page-hero legal">
      <Eyebrow>
        MONARDAS / {page === "privacy" ? "Privacy" : "Website terms"}
      </Eyebrow>
      <h1>{page === "privacy" ? "Privacy Policy" : "Terms of Use"}</h1>
      {(page === "privacy" ? privacy : terms).map(([heading, copy]) => (
        <div key={heading}>
          <h2>{heading}</h2>
          <p>{copy}</p>
        </div>
      ))}
      <Button href={page === "privacy" ? "/terms" : "/privacy"} secondary>
        {page === "privacy" ? "Terms of Use" : "Privacy Policy"}
      </Button>
    </section>
  );
}
