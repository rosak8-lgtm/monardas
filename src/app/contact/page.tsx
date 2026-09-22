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
  const foundingPartner = (await searchParams).intent === "founding-partner";
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
