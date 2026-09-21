import { pageMetadata } from "@/lib/seo";
import { Check, ArrowUpRight } from "lucide-react";
import { Eyebrow } from "@/components/site";
import { ContactForm } from "@/components/contact-form";
export const metadata = pageMetadata(
  "Request a Revenue Recovery Audit",
  "Explore a focused roofing or HVAC estimate recovery pilot. Share your pipeline, estimate volume and sales workflow.",
  "/contact",
);
export default function Contact() {
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
      <ContactForm />
    </section>
  );
}
