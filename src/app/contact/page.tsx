import { pageMetadata } from "@/lib/seo";
import { Check, ArrowUpRight } from "lucide-react";
import { Button, Eyebrow } from "@/components/site";
import { MONARDAS_HVAC_WHATSAPP_URL } from "@/lib/whatsapp";
import { ContactForm } from "@/components/contact-form";
export const metadata = pageMetadata(
  "Get a Free Estimate Recovery Assessment",
  "Request a free review of your unsold HVAC replacement estimates. Assess backlog fit before discussing a focused paid recovery pilot. No commitment.",
  "/contact",
);
export default async function Contact({
  searchParams,
}: {
  searchParams: Promise<{ intent?: string }>;
}) {
  const { intent } = await searchParams;
  const foundingPartner = intent === "founding-partner";
  const agencyPartner = intent === "agency-partner";
  const freePilot = intent === "hvac-free-pilot";
  if (intent === "hvac-pilot" || agencyPartner || freePilot)
    return (
      <section className={"container contact-page hvac-pilot-contact" + (freePilot ? " free-founder-contact" : "")}>
        <div className="contact-copy">
          <Eyebrow>{freePilot ? "MONARDAS / FOUNDING HVAC CONTRACTORS" : agencyPartner ? "MONARDAS / HVAC referral partners" : "MONARDAS AI / HVAC estimate recovery"}</Eyebrow>
          <h1>{freePilot ? "Apply for the Free 30-Day HVAC Pilot" : agencyPartner ? "Partner With MONARDAS" : "Get a Free Estimate Recovery Assessment"}</h1>
          <p>
            {freePilot
              ? "We are inviting up to two independent US residential HVAC contractors for a no-cost, 30-day founder-supported follow-up program for up to 25 eligible unsold replacement estimates. Applying does not guarantee selection."
              : agencyPartner
                ? "For HVAC marketing agencies, sales coaches and CRM consultants: discuss a referral or co-service introduction. MONARDAS focuses on reviewing open residential replacement estimates after the quote."
              : "Tell us about your current estimate backlog. We’ll review whether the records appear suitable for a focused HVAC recovery pilot."}
          </p>
          <p><strong>{freePilot
            ? "No card or commitment. Do not submit homeowner names, addresses, phone numbers, or account access. Our team prepares and tracks follow-up; your approved staff handles customer contact unless separate written authorization and contact eligibility reviews allow otherwise."
            : agencyPartner
              ? "No paid partnership, integration or commission is implied by submitting an enquiry."
            : "The initial review is free. Submitting the form does not commit you to a paid engagement."
          }</strong></p>
          <ul>
            {[
              ...(freePilot
                ? ["Free 30-day founder-supported follow-up", "No personal customer data for initial fit", "Receive weekly progress updates; no obligation to buy"]
                : agencyPartner
                  ? ["Share the free follow-up check with contractors", "Explore a qualified introduction", "Keep your clients and their sales team in control"]
                : ["Review your estimate backlog", "Assess whether a recovery pilot makes sense", "Keep your sales team in control"]),
            ].map((text) => (
              <li key={text}>
                <Check size={18} />
                {text}
              </li>
            ))}
          </ul>
          <div className="contact-next">
            <ArrowUpRight size={26} />
            <h3>What happens next</h3>
            <p>{freePilot
              ? "We confirm fit, agree on a limited de-identified backlog, and support approved next actions over 30 days. Your team retains control of homeowner contact, consent and exclusions."
              : agencyPartner
                ? "We will review the fit, decide together whether any introduction makes sense, and agree responsibilities before involving your clients."
              : "If the backlog looks suitable, we’ll discuss pilot scope, responsibilities, timing and commercial terms. Messaging, contact method, exclusions and sales handoff are agreed before homeowner outreach begins."}
            </p>
            <p>{freePilot
              ? "A paid managed pilot is a separate optional agreement. We do not promise recovered revenue or request testimonials without consent."
              : agencyPartner
                ? "No client information or homeowner contact lists are required for this first conversation."
              : "The initial review is free. The pilot is paid. Pricing is agreed after we review the scope."}
            </p>
          </div>
          <Button href={MONARDAS_HVAC_WHATSAPP_URL} secondary>
            Ask on WhatsApp
          </Button>
        </div>
        <ContactForm agencyPartner={agencyPartner} freePilot={freePilot} />
      </section>
    );
  return (
    <section className="container contact-page audit-contact">
      <div className="contact-copy">
        <Eyebrow>MONARDAS / Estimate recovery</Eyebrow>
        <h1>Get a Free Estimate Recovery Assessment</h1>
        <p>
          Tell us about your current estimate backlog. We’ll review whether the
          records appear suitable for a focused HVAC recovery pilot.
        </p>
        <p>
          The initial review is free. Submitting the form does not commit you to
          a paid engagement.
        </p>
        <ul>
          {[
            "Review your unsold replacement estimates",
            "Explore a small, focused pilot",
            "Keep your sales team in control",
          ].map((t) => (
            <li key={t}>
              <Check size={18} />
              {t}
            </li>
          ))}
        </ul>
        <div className="contact-next">
          <ArrowUpRight size={26} />
          <h3>What happens next</h3>
          <p>
            If the backlog looks suitable, we’ll discuss pilot scope,
            responsibilities, timing and commercial terms. The pilot is paid;
            pricing is agreed after the scope review.
          </p>
        </div>
        <Button href={MONARDAS_HVAC_WHATSAPP_URL} secondary>
          Ask on WhatsApp
        </Button>
      </div>
      <ContactForm foundingPartner={foundingPartner} />
    </section>
  );
}
