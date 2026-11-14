import { Button, Eyebrow } from "@/components/site";
import { pageMetadata } from "@/lib/seo";
import Link from "next/link";

export const metadata = pageMetadata(
  "Founding HVAC Contractor Pilot — 7 Days Free",
  "MONARDAS is inviting two independent HVAC contractors to test a seven-day, no-cost, human-reviewed audit of up to 25 anonymized unsold replacement estimates. No card required.",
  "/hvac/free-pilot",
);

const terms = [
  ["Exactly what is free?", "A founder-led review of up to 25 de-identified, unsold residential replacement estimates over seven calendar days from agreed start. We return a prioritized process report and practical next-action recommendations."],
  ["What will you share?", "Only non-identifying estimate metadata at first: approximate value, age, status, previous contact activity, and assigned sales owner. No homeowner names, addresses, phone numbers, messages, or CRM passwords should be entered or uploaded through this page."],
  ["Will you contact homeowners?", "No. The free validation pilot is a read-only review. Any later outreach requires a separate written scope, eligible contacts and exclusion review, approved messaging, approved channels, and the contractor's explicit authorization."],
  ["Do we need new software?", "No native CRM integration or migration is included or required. We discuss a minimal, safe transfer process after fit is confirmed."],
  ["Do we have to buy anything?", "No. Zero cost, no credit card, and no obligation to upgrade. Any later managed customer outreach or ongoing service requires a separate paid agreement."],
  ["Do you guarantee recovered revenue?", "No. You receive an inspection report and a baseline for decisions. A reported improvement, confirmed sale, review, endorsement or public case study is never assumed."],
];

export default function FreePilotPage() {
  return (
    <div className="product-page hvac-page">
      <section className="container page-hero product-hero">
        <Eyebrow>MONARDAS / FOUNDING CONTRACTOR PROGRAM</Eyebrow>
        <h1>Test your unsold-estimate process. <em>7 days, $0.</em></h1>
        <p>
          We are selecting up to two independent US residential HVAC contractors
          to review a real backlog of up to 25 anonymized AC, furnace or heat-pump
          replacement estimates. You get a human-reviewed follow-up gap report,
          not another software subscription.
        </p>
        <p className="hvac-support">
          We help identify which estimates have no owner, no next action,
          incomplete history, or unresolved exclusions — your team decides what to do next.
        </p>
        <div className="button-row">
          <Button href="/contact?intent=hvac-free-pilot&utm_source=founding-cohort&utm_medium=onsite">
            Apply for the Free 7-Day Pilot
          </Button>
          <Button href="/hvac/scorecard" secondary>Try the Free 3-Minute Check First</Button>
        </div>
        <p className="fine-print">
          Two pilot slots offered, subject to fit and availability. Applying does not
          mean acceptance. No card, no obligation, no homeowner contact and no upload
          of homeowner records through this site.
        </p>
      </section>
      <section className="section container" aria-labelledby="founding-steps">
        <Eyebrow>HOW IT WORKS</Eyebrow>
        <h2 id="founding-steps">One small backlog. One useful answer.</h2>
        <div className="hvac-cards">
          <article>
            <h3>1. Apply</h3>
            <p>Tell us about your business and how you currently manage unsigned replacement quotes. Just your business contact details — no customer data.</p>
          </article>
          <article>
            <h3>2. Audit</h3>
            <p>If selected, we agree on a safe, de-identified list of up to 25 estimates and review its follow-up process over seven days.</p>
          </article>
          <article>
            <h3>3. Decide</h3>
            <p>Get a prioritized report, a check-in with the founder and a clear recommendation. You decide whether a separately paid recovery pilot makes sense.</p>
          </article>
        </div>
      </section>
      <section className="container section" aria-label="Free pilot questions">
        <Eyebrow>REALISTIC EXPECTATIONS</Eyebrow>
        <h2>What participation means</h2>
        <div className="hvac-faq">
          {terms.map(([question, answer]) => (
            <details key={question}>
              <summary>{question}</summary>
              <p>{answer}</p>
            </details>
          ))}
        </div>
        <div className="button-row">
          <Button href="/contact?intent=hvac-free-pilot&utm_source=founding-cohort&utm_medium=onsite">
            Request a Free Pilot Spot
          </Button>
          <Link href="/hvac">Compare with the separately paid managed pilot</Link>
        </div>
      </section>
    </div>
  );
}
