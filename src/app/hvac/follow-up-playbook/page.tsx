import Link from "next/link";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(
  "Free HVAC Unsold Estimate Follow-Up Playbook",
  "A practical five-step workflow for residential HVAC contractors to organize unsold replacement estimates, assign owners and measure outcomes. No registration.",
  "/hvac/follow-up-playbook",
);

const steps = [
  { title: "Select a manageable backlog", body: "Start with one defined date range and a small batch of open replacement estimates. Use internal estimate IDs, not homeowner data, in shared review worksheets." },
  { title: "Review eligibility before contacting anyone", body: "Exclude sold, declined, opted-out, duplicated and otherwise ineligible records. Verify the contractor's permission, customer preferences and applicable channel rules before approving any contact." },
  { title: "Assign a next action and owner", body: "Record the estimate status, a named internal owner and a due date. Review context before drafting a personalized follow-up. Do not send automatically from this worksheet." },
  { title: "Separate responses from bookings", body: "Record completed actions, interested replies and confirmed appointments separately. An unanswered message or scheduled visit is not a closed sale." },
  { title: "Review the results weekly", body: "Reconcile the backlog with your existing CRM. Record only contractor-confirmed outcomes and revenue, and stop further contact when appropriate." },
];

export default function FollowUpPlaybook() {
  return (
    <div className="product-page hvac-page">
      <section className="container page-hero product-hero">
        <span className="eyebrow">MONARDAS / FREE HVAC RESOURCE</span>
        <h1>Five steps to organize <em>unsold HVAC estimates.</em></h1>
        <p>A practical follow-up workflow for residential HVAC contractors and their marketing partners. No account, no upload, no required CRM migration.</p>
        <div className="button-row">
          <Link href="/hvac/scorecard?utm_source=playbook&utm_medium=onsite">Take the free 3-minute check</Link>
          <a href="/resources/hvac-estimate-review.csv">Get the free estimate review worksheet</a>
        </div>
      </section>
      <section className="container section" aria-label="Five-step follow-up workflow">
        <div className="hvac-cards">
          {steps.map((step, i) => (
            <article key={step.title}><h2>{i + 1}. {step.title}</h2><p>{step.body}</p></article>
          ))}
        </div>
        <p className="fine-print">Educational workflow only. This is not legal advice, authorization to contact customers, a sales forecast or a promise of recovered revenue.</p>
      </section>
      <section className="container section" aria-label="Share with your team">
        <h2>Share the workflow with a contractor</h2>
        <p>Send this public resource to a colleague who requests it, or share it in a community that permits resource posts. No customer list or attachments are needed.</p>
        <p>Public link: <a href="https://monardas.com/hvac/follow-up-playbook">https://monardas.com/hvac/follow-up-playbook</a></p>
        <p>MONARDAS offers a separate, limited 30-day founder-supported pilot for up to two selected independent US residential HVAC businesses, covering up to 25 eligible estimates. No card, no automatic renewal, no guaranteed recovery.</p>
        <div className="button-row">
          <Link href="/hvac/free-pilot?utm_source=playbook&utm_medium=resource">Explore the free pilot</Link>
          <Link href="/contact?intent=agency-partner&utm_source=playbook&utm_medium=partner">Discuss a qualified partner introduction</Link>
        </div>
      </section>
    </div>
  );
}
