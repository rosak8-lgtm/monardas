import { pageMetadata } from "@/lib/seo";
import { Check, ArrowUpRight } from "lucide-react";
import { Eyebrow } from "@/components/site";
import { ContactForm } from "@/components/contact-form";
export const metadata = pageMetadata(
  "Request a Revenue Recovery Audit",
  "Identify missed-call and unsold-estimate follow-up gaps in your HVAC business. Start with a focused Revenue Recovery Audit or founding partner conversation.",
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
          <h1>Request a Revenue Recovery Audit</h1>
          <p>
            Tell us about your unsold replacement estimate backlog. We’ll review
            whether a focused recovery pilot is a fit for your HVAC business.
          </p>
          <p>
            <strong>
              The initial review is free and does not commit you to a paid
              pilot.
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
              We’ll review your records and discuss messaging, contact method,
              exclusions and sales handoff. If there’s a fit, scope, timing,
              responsibilities and commercial terms are agreed before any
              homeowner outreach begins.
            </p>
            <p>
              The initial review is free. The pilot is paid. Pricing is agreed
              after we review the scope.
            </p>
          </div>
        </div>
        <ContactForm hvacPilot />
      </section>
    );
  return (
    <section className="container contact-page">
      <div className="contact-copy">
        <Eyebrow>Let’s find your next opportunity</Eyebrow>
        <h1>
          More opportunity.
          <br />
          <span>
            Closer than
            <br />
            you think.
          </span>
        </h1>
        <p>
          You’ve already done the hard work of generating leads. Let’s see
          what’s still waiting in your pipeline.
        </p>
        <ul>
          {[
            "Start with your existing leads and estimates",
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
          <h3>What we’ll explore</h3>
          <p>
            Your current pipeline, where follow-up drops off, and what a
            practical recovery program could look like for your business.
          </p>
        </div>
      </div>
      <ContactForm foundingPartner={foundingPartner} />
    </section>
  );
}
