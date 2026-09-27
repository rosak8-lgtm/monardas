import { Button, Eyebrow, SectionHeading } from "./site";
import { Calculator } from "./calculator";

const pilotHref = "/contact?intent=hvac-pilot";
const faqs = [
  [
    "What kinds of estimates are suitable?",
    "Unsold AC, furnace, heat pump and full-system replacement estimates. We review the records together and agree on which estimates are appropriate for follow-up. Already-sold jobs and excluded contacts stay out of the pilot.",
  ],
  [
    "How old should the estimates be?",
    "There is no fixed age requirement for this pilot. We review age, status and available context before selecting the batch.",
  ],
  [
    "Do we need a specific CRM or an integration?",
    "A usable CRM/FSM export or existing list can be the starting point. We review the available data and agree on how to work with it before launch. This is a founder-led managed recovery pilot; no native AI or CRM integration is promised.",
  ],
  [
    "How will homeowners be contacted?",
    "Contact channels are agreed with the contractor before launch based on the available records, approved messaging and which contacts may be included. No outreach begins before the contact method and exclusions are agreed.",
  ],
  [
    "Who handles the sale?",
    "Your sales team does. MONARDAS identifies renewed intent and passes the conversation back with context. Your team handles advice, pricing, appointments and closing.",
  ],
  [
    "What if nobody is interested?",
    "The report will show that outcome. You receive a record of the activity and responses, but the pilot does not guarantee interested opportunities or sales.",
  ],
  [
    "Is the review free, and how is the pilot priced?",
    "The initial review is free. The pilot is paid. Pricing is agreed after we review the scope.",
  ],
  [
    "How long does the pilot run?",
    "Pilot timing depends on the size and condition of the estimate backlog, the agreed follow-up sequence and your team’s handoff process. We confirm the timeline before launch.",
  ],
  [
    "Does this pilot include missed calls or other services?",
    "The current pilot covers unsold HVAC replacement estimates. Missed-call recovery, roofing and broader automation projects are outside its scope.",
  ],
];

export function HVACPage() {
  return (
    <div className="product-page hvac-page">
      <section className="container page-hero product-hero">
        <Eyebrow>MONARDAS AI / HVAC ESTIMATE RECOVERY</Eyebrow>
        <h1>
          Recover revenue from HVAC estimates{" "}
          <em>you&apos;ve already paid to generate.</em>
        </h1>
        <p>
          MONARDAS runs structured follow-up on unsold replacement estimates,
          identifies homeowners who are open to revisiting their quote, and
          hands those conversations back to your sales team.
        </p>
        <p className="hvac-support">
          Before buying more leads, recover the opportunities already sitting in
          your pipeline.
        </p>
        <div className="button-row">
          <Button href={pilotHref}>Request a Revenue Recovery Audit</Button>
          <Button href="#system" secondary>
            See How It Works
          </Button>
        </div>
        <p className="fine-print">
          <strong>Free initial review. No commitment.</strong>
          <br />
          We’ll look at your unsold estimate backlog, confirm whether it’s
          suitable for recovery, and explain what a paid 25–50 estimate pilot
          could look like.
        </p>
        <div className="hvac-hero-baseline">
          For U.S. HVAC contractors · Founder-led managed recovery
        </div>
      </section>
      <section className="dark section">
        <div className="container split">
          <SectionHeading
            label="01 / The opportunity after the quote"
            title="The estimate went out. The conversation went quiet."
          />
          <div className="product-copy">
            <p>
              You paid to generate the lead. Your team assessed the replacement
              and prepared an estimate. The homeowner didn’t move forward—and
              follow-up eventually stopped.
            </p>
            <p>
              Some homeowners may have chosen another contractor. Others may
              still be weighing timing, cost or an unanswered question. A quiet
              estimate alone doesn’t tell you which.
            </p>
            <p className="lead">
              The first job is to find out who is still open to a conversation.
            </p>
          </div>
        </div>
      </section>
      <section
        className="section container"
        aria-labelledby="what-happens-next"
      >
        <Eyebrow>WHAT HAPPENS NEXT</Eyebrow>
        <h2 id="what-happens-next">
          A simple path from backlog review to a focused pilot.
        </h2>
        <div className="hvac-cards">
          {[
            [
              "1. Tell us about your unsold estimates",
              "We review how many you have, where the records are stored, how old they are, and who currently owns follow-up.",
            ],
            [
              "2. We assess whether a recovery pilot makes sense",
              "We identify a suitable starting batch, discuss messaging, contact method, exclusions and sales handoff.",
            ],
            [
              "3. If there’s a fit, we define a paid pilot",
              "Scope, timing, responsibilities and commercial terms are agreed before any homeowner outreach begins.",
            ],
          ].map(([title, copy]) => (
            <article key={title}>
              <h3>{title}</h3>
              <p>{copy}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="section container">
        <SectionHeading
          label="02 / The recovery pilot"
          title="Start with 25–50 unsold replacement estimates."
          description="A focused, founder-led managed pilot for AC, furnace, heat pump and full-system replacement estimates."
        />
        <p className="hvac-intro">
          MONARDAS runs a structured recovery follow-up sequence, tracks replies
          and renewed intent, and returns interested homeowners to your sales
          team. You receive a clear report of the activity and outcomes.
        </p>
        <div className="hvac-cards">
          {[
            [
              "One selected batch",
              "Start with existing estimates your team can identify and review.",
            ],
            [
              "An agreed follow-up sequence",
              "Define the messaging, contact approach and exclusions before outreach begins.",
            ],
            [
              "A clear sales handoff",
              "Agree on who receives interested opportunities and what context they need.",
            ],
          ].map(([title, copy], i) => (
            <article key={title}>
              <Eyebrow>0{i + 1}</Eyebrow>
              <h3>{title}</h3>
              <p>{copy}</p>
            </article>
          ))}
        </div>
        <div className="hvac-pilot-next">
          <Button href={pilotHref}>Discuss a Recovery Pilot</Button>
          <p className="fine-print">
            The initial review is free. The pilot is paid. Pricing is agreed
            after we review the scope.
          </p>
        </div>
      </section>
      <section className="section hvac-tint" id="system">
        <div className="container">
          <SectionHeading
            label="03 / Demonstration + process"
            title="From a quiet estimate to an actionable conversation."
          />
          <p className="fine-print">
            Illustrative example only. This is not a customer case study or a
            recorded result.
          </p>
          <div className="hvac-demo split">
            <ol className="hvac-sequence">
              {[
                [
                  "Estimate selected",
                  "An unsold heat pump replacement estimate is included in the agreed pilot list.",
                ],
                [
                  "Follow-up begins",
                  "The homeowner receives an approved follow-up asking whether they are still considering the replacement.",
                ],
                [
                  "Homeowner responds",
                  "Example reply: “We’re still considering it. Can someone walk us through the options again?”",
                ],
                [
                  "Your team takes over",
                  "The assigned salesperson receives the estimate reference, reply, open question and suggested next action.",
                ],
              ].map(([title, copy], i) => (
                <li key={title}>
                  <span aria-hidden="true">0{i + 1}</span>
                  <div>
                    <h3>{title}</h3>
                    <p>{copy}</p>
                  </div>
                </li>
              ))}
            </ol>
            <aside className="hvac-handoff" aria-label="Example sales handoff">
              <Eyebrow>Example sales handoff</Eyebrow>
              <h3>Ready for a human conversation.</h3>
              <dl>
                {[
                  ["Estimate", "Heat pump replacement"],
                  ["Homeowner intent", "Open to revisiting the quote"],
                  ["Question", "Wants to review the options"],
                  [
                    "Next action",
                    "Salesperson follows up to discuss the existing estimate",
                  ],
                ].map(([label, value]) => (
                  <div key={label}>
                    <dt>{label}</dt>
                    <dd>{value}</dd>
                  </div>
                ))}
              </dl>
              <p className="fine-print">
                A reply or a handoff is not a closed job. Your team confirms the
                sales outcome.
              </p>
            </aside>
          </div>
          <h3 className="hvac-process-title">
            How it works: select, re-engage, hand back.
          </h3>
          <div className="hvac-cards">
            {[
              [
                "1. Select the estimates",
                "Share a CRM/FSM export or an existing list. Together, we review suitability and agree on exclusions, the follow-up approach and the handoff owner.",
              ],
              [
                "2. Run recovery follow-up",
                "MONARDAS runs the agreed sequence, tracks replies and identifies homeowners open to revisiting their quote.",
              ],
              [
                "3. Return opportunities and report",
                "Your team receives interested opportunities with context. The report shows activity, responses, handoffs and sales outcomes where your team has confirmed them.",
              ],
            ].map(([title, copy]) => (
              <article key={title}>
                <h3>{title}</h3>
                <p>{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="section container">
        <SectionHeading
          label="04 / Readiness + deliverables"
          title="Bring your estimate backlog. Get a clear record of what happens next."
        />
        <div className="split hvac-readiness">
          <div>
            <h3>What MONARDAS needs</h3>
            <dl className="hvac-list">
              {[
                [
                  "An existing estimate backlog",
                  "You already invest in lead generation and have 25–50 suitable unsold replacement estimates to review.",
                ],
                [
                  "Usable records",
                  "A CRM/FSM export or list linking the homeowner, contact details and original estimate. We agree on the required fields before transfer.",
                ],
                [
                  "Eligible contacts",
                  "Your team confirms which records may be included and which contacts must be excluded before outreach begins.",
                ],
                [
                  "A sales handoff owner",
                  "Someone who can pick up renewed conversations and report what happened next.",
                ],
              ].map(([title, copy]) => (
                <div key={title}>
                  <dt>{title}</dt>
                  <dd>{copy}</dd>
                </div>
              ))}
            </dl>
            <p className="fine-print">
              Fit depends on your estimates, data and follow-up capacity.
              Revenue, technician count and review count are not fixed entry
              requirements.
            </p>
          </div>
          <div>
            <h3>What your team receives</h3>
            <dl className="hvac-list">
              {[
                [
                  "A reviewed pilot list",
                  "The agreed batch of estimates and any exclusions.",
                ],
                [
                  "Follow-up records and intent notes",
                  "Outreach status, homeowner replies and the context behind renewed interest.",
                ],
                [
                  "Actionable sales handoffs",
                  "Interested opportunities linked to the original estimate, with the information needed to continue.",
                ],
                [
                  "A pilot report and review",
                  "Activity, replies and handoffs, plus sales outcomes and revenue only where your team confirms them.",
                ],
              ].map(([title, copy]) => (
                <div key={title}>
                  <dt>{title}</dt>
                  <dd>{copy}</dd>
                </div>
              ))}
            </dl>
            <p className="fine-print">
              Replies, handoffs and closed jobs are reported separately.
            </p>
          </div>
        </div>
      </section>
      <section className="section hvac-founder" id="founding-partners">
        <div className="container split">
          <div>
            <Eyebrow>05 / Founder-led pilot</Eyebrow>
            <h2>
              Work directly with the person building the recovery process.
            </h2>
            <p className="hvac-founder-name">
              Yurii Shalygin <span>Founder, MONARDAS</span>
            </p>
          </div>
          <div className="product-copy">
            <p>
              Yurii leads the pilot setup, workflow review and results
              discussion. Your team works directly with the founder to define
              estimate selection, the follow-up approach and the sales handoff.
            </p>
            <p>
              Early pilots help refine the process around real contractor
              workflows. Your feedback informs that work; the paid scope remains
              the agreed recovery pilot.
            </p>
            <Button href={pilotHref}>Discuss a Recovery Pilot</Button>
            <p className="fine-print">
              Responsibilities, scope, timing and commercial terms are agreed
              before launch. The pilot does not guarantee replies, bookings or
              recovered revenue.
            </p>
          </div>
        </div>
      </section>
      <section className="section container">
        <SectionHeading
          label="06 / Illustrative economics — not a forecast"
          title="Explore what recovered jobs could mean for your business."
          description="Use your own assumptions to explore a revenue scenario. This calculator does not predict the pilot’s results."
        />
        <Calculator />
      </section>
      <section className="section hvac-tint">
        <div className="container split">
          <SectionHeading
            label="07 / Questions before you start"
            title="A clear scope. An informed next step."
          />
          <div className="hvac-faq">
            {faqs.map(([question, answer]) => (
              <details key={question}>
                <summary>{question}</summary>
                <p>{answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
      <section className="final-cta" id="audit">
        <div className="container split">
          <div>
            <Eyebrow>Next step / Your estimate backlog</Eyebrow>
            <h2>
              Start with 25–50 estimates <em>already in your pipeline.</em>
            </h2>
          </div>
          <div className="product-copy">
            <p>
              Tell us about your unsold replacement estimates, how your records
              are stored and who would handle renewed homeowner interest.
            </p>
            <p>
              We’ll review whether a focused recovery pilot is a fit and discuss
              the scope and commercial terms.
            </p>
            <Button href={pilotHref}>Discuss a Recovery Pilot</Button>
            <p className="fine-print">
              Submitting a request starts a conversation. It does not commit you
              to a pilot.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
