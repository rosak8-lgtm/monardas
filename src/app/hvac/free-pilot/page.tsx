import { Button, Eyebrow } from "@/components/site";
import { pageMetadata } from "@/lib/seo";
import Link from "next/link";

export const metadata = pageMetadata(
  "Founding HVAC Contractor Pilot — 30 Days Free",
  "Apply for one of two no-cost, 30-day founder-supported HVAC estimate follow-up pilots. Up to 25 suitable unsold replacement estimates, weekly progress reports, no card or automatic paid renewal.",
  "/hvac/free-pilot",
);

const terms = [
  [
    "Exactly what is included for 30 days?",
    "Hands-on support for one agreed batch of up to 25 suitable, unsold residential replacement estimates: first-week backlog review, follow-up priorities, contractor-approved message drafts, a tracked next-action list, weekly progress updates and a final owner review. Up to two follow-up actions per eligible estimate during the pilot. We agree on the practical workflow before starting.",
  ],
  [
    "What do I share when applying?",
    "Only your business name, your own work contact details and a brief description of the problem. Do not submit homeowner names, addresses, phone numbers, conversation history, login credentials or full customer exports through this website.",
  ],
  [
    "Who actually contacts homeowners?",
    "Your business stays in control. During the free pilot we prepare and monitor the follow-up work, while your approved team can perform the contact. MONARDAS does not independently call, email or text homeowners unless an additional written authorization and eligibility, suppression and channel review are completed. No automatic bulk messages.",
  ],
  [
    "Do you need to integrate with our CRM?",
    "No forced migration or native integration. We can work with an agreed, limited, de-identified tracking extract and your team's outcome updates. A different secure data arrangement would need separate agreement first.",
  ],
  [
    "Will this turn into a paid subscription?",
    "No. Thirty calendar days begin only after both parties agree the pilot start and scope. It ends without automatic renewal, payment details or any charge. Paid recovery work is an optional, separately agreed next step.",
  ],
  [
    "What results will you report?",
    "Number of eligible and excluded estimates, assigned owners, completed follow-up actions, and any contractor-verified responses, appointments and closed jobs. These outcomes are tracked separately; we do not promise recovered revenue, customer testimonials or an integration.",
  ],
];

export default function FreePilotPage() {
  return (
    <div className="product-page hvac-page">
      <section className="container page-hero product-hero">
        <Eyebrow>MONARDAS / FOUNDING HVAC CONTRACTORS</Eyebrow>
        <h1>Let's work your open estimates together. <em>30 days free.</em></h1>
        <p>
          We are inviting up to two independent US residential HVAC companies
          to test a founder-supported follow-up service for up to 25 suitable,
          unsold AC, furnace or heat-pump replacement quotes.
        </p>
        <p className="hvac-support">
          Not another CRM subscription: MONARDAS organizes the next-action list,
          prepares approved follow-up drafts and checks progress with your team
          each week. You keep the sales relationship and decide whom to contact.
        </p>
        <div className="button-row">
          <Button href="/contact?intent=hvac-free-pilot&utm_source=founding-cohort&utm_medium=onsite">
            Apply for the Free 30-Day Pilot
          </Button>
          <Button href="/hvac/scorecard" secondary>Try the Free 3-Minute Check First</Button>
        </div>
        <p className="fine-print">
          Limited to two selected businesses, subject to fit and capacity.
          No credit card, no automatic charges, no guaranteed recovery.
          Do not upload homeowner information through this page.
          Submitting an application does not reserve a place.
        </p>
      </section>
      <section className="section container" aria-labelledby="founding-steps">
        <Eyebrow>YOUR FIRST MONTH</Eyebrow>
        <h2 id="founding-steps">Real operational support, in a manageable scope.</h2>
        <div className="hvac-cards">
          <article>
            <h3>Days 1–7 · Set up the backlog</h3>
            <p>A short owner call, safe record selection, status and exclusions review, and an agreed plan for up to 25 unsold estimates.</p>
          </article>
          <article>
            <h3>Days 8–23 · Support follow-up</h3>
            <p>We maintain a prioritized action list and draft eligible follow-ups for your team to approve and send. We check progress weekly, and record contractor-confirmed outcomes.</p>
          </article>
          <article>
            <h3>Days 24–30 · Review the outcome</h3>
            <p>We deliver a final report showing actions, responses, booked visits and any confirmed sales. You decide if further separately paid support is worthwhile.</p>
          </article>
        </div>
        <p className="fine-print">
          Up to two approved follow-up actions per eligible estimate.
          Outreach by MONARDAS itself requires a separately signed authorization,
          lawful contact eligibility, channel approval and opt-out safeguards.
        </p>
      </section>
      <section className="container section" aria-label="Free pilot questions">
        <Eyebrow>NO SURPRISES</Eyebrow>
        <h2>What the free pilot includes — and what it does not</h2>
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
            Request One of Two Free Places
          </Button>
          <Link href="/hvac">Explore the separately paid managed recovery service</Link>
        </div>
      </section>
    </div>
  );
}
