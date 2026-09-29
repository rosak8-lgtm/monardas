import { pageMetadata } from "@/lib/seo";
import { Check, ArrowUpRight } from "lucide-react";
import { Eyebrow } from "@/components/site";
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
  if (intent === "hvac-pilot")
    return (
      <section className="container contact-page hvac-pilot-contact">
        <div className="contact-copy">
          <Eyebrow>MONARDAS AI / HVAC estimate recovery</Eyebrow>
          <h1>Get a Free Estimate Recovery Assessment</h1>
          <p>
            Tell us about your current estimate backlog. We’ll review whether
            the records appear suitable for a focused HVAC recovery pilot.
          </p>
          <p>
            <strong>
              The initial review is free. Submitting the form does not commit
              you to a paid engagement.
            </strong>
          </p>
          <ul>
            {[
              "Review your estimate backlog",
              "Assess whether a recovery pilot makes sense",
              "Keep your sales team in control",
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
            <p>
              If the backlog looks suitable, we’ll discuss pilot scope,
              responsibilities, timing and commercial terms. Messaging, contact
              method, exclusions and sales handoff are agreed before homeowner
              outreach begins.
            </p>
            <p>
              The initial review is free. The pilot is paid. Pricing is agreed
              after we review the scope.
            </p>
          </div>
        </div>
        <ContactForm />
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
      </div>
      <ContactForm foundingPartner={foundingPartner} />
    </section>
  );
}
