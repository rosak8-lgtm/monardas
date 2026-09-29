import { Button, Eyebrow, SectionHeading } from "./site";
import { Calculator } from "./calculator";

const pilotHref = "/contact?intent=hvac-pilot";
const faqs = [
  [
    "Will this annoy old customers?",
    "We can’t promise how every homeowner will react. You review the messaging, follow-up sequence and exclusions before launch. The aim is to ask whether revisiting the estimate is relevant, not pressure someone to buy.",
  ],
  [
    "What kinds of estimates are suitable?",
    "Unsold AC, furnace, heat pump and full-system replacement estimates. We agree on suitability together. Already-sold jobs and excluded contacts stay out.",
  ],
  [
    "How old can the estimates be?",
    "There is no fixed age requirement for this pilot. We review age, status and available context before selecting the batch.",
  ],
  [
    "Do I need to change my CRM?",
    "No CRM migration or complex integration is required. We can work from a usable CRM/FSM export or existing list, with data requirements agreed before launch. No native AI or CRM integration is promised.",
  ],
  [
    "How will homeowners be contacted?",
    "We agree on channels based on your records, approved messaging and eligible contacts. No outreach begins before the contact method and exclusions are agreed.",
  ],
  [
    "Does MONARDAS close the job?",
    "No. Your team owns technical advice, equipment recommendations, pricing, financing discussions, appointments and the close.",
  ],
  [
    "What records do you need?",
    "A CRM/FSM export or existing list linking homeowner contact details to the original estimate, its date and status. We agree on required fields and the transfer method before you share the batch.",
  ],
  [
    "Who decides which homeowners can be contacted?",
    "Your team confirms eligible records and exclusions before outreach begins. Already-sold jobs and excluded contacts stay out of the pilot.",
  ],
  [
    "What happens after a homeowner replies?",
    "MONARDAS reviews the response for questions and renewed interest. When there is a reason for a sales conversation, your assigned salesperson receives the reply and estimate context. A reply alone is not a qualified opportunity or a sale.",
  ],
  [
    "What if nobody responds?",
    "The report records that outcome and the follow-up activity. Replies, handoffs and closed jobs are reported separately. The pilot does not guarantee responses or sales.",
  ],
  [
    "How much does the pilot cost?",
    "The initial review is free. The pilot is paid. Pricing is agreed after we review the scope.",
  ],
  [
    "How long does the pilot run?",
    "Timing depends on the backlog’s size and condition, the follow-up sequence and your handoff process. We confirm the timeline before launch.",
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
          Recover revenue from HVAC replacement estimates{" "}
          <em>that never closed.</em>
        </h1>
        <p>
          You paid for the lead and delivered the quote. MONARDAS re-engages
          homeowners who never moved forward, identifies who is open to
          revisiting the estimate, and hands those conversations back to your
          sales team.
        </p>
        <p className="hvac-support">
          Before buying more leads, recover the opportunities already sitting in
          your pipeline.
        </p>
        <div className="button-row">
          <Button href={pilotHref}>Get a Free Estimate Recovery Assessment</Button>
          <Button href="#system" secondary>
            See How It Works
          </Button>
        </div>
        <p className="fine-print">
          <strong>Free initial review. No commitment to a paid pilot.</strong>
          <br />
          For U.S. residential HVAC contractors. We review backlog fit before
          discussing scope.
        </p>
        <ul className="hvac-hero-baseline">
          <li>25–50 estimates</li>
          <li>Founder-led managed pilot</li>
          <li>No CRM migration required</li>
          <li>Your sales team closes</li>
        </ul>
      </section>
      <section className="dark section">
        <div className="container split">
          <SectionHeading
            label="01 / The opportunity after the quote"
            title="You already paid for these opportunities."
          />
          <div className="product-copy">
            <p>
              A replacement lead came in. Your team handled the call, visited
              the home and prepared an estimate. Then the homeowner went quiet.
            </p>
            <p>
              Some homeowners have moved on. Others may still be weighing
              timing, cost or an unanswered question. A quiet estimate alone
              doesn’t tell you which.
            </p>
            <p className="lead">
              The first job is to find out which conversations are still worth
              reopening.
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
              "We review volume, age, where records are stored and who owns follow-up.",
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
          title="Start small. Prove it on your own pipeline."
          description="A founder-led managed pilot of 25–50 suitable unsold AC, furnace, heat pump or full-system replacement estimates."
        />
        <p className="hvac-intro">
          Use a CRM/FSM export or an existing list. No CRM migration is
          required. We agree on the batch, follow-up and handoff before outreach
          begins.
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
        <p className="hvac-fit-note">
          No commitment from the initial assessment. If the backlog isn’t a fit,
          we’ll tell you.
        </p>
      </section>
      <section className="section hvac-tint" id="system">
        <div className="container">
          <SectionHeading
            label="03 / The recovery process"
            title="Turn an old estimate into a live sales conversation."
          />
          <div className="hvac-demo split">
            <ol className="hvac-sequence">
              {[
                [
                  "Select the backlog",
                  "Start with 25–50 suitable unsold replacement estimates from your CRM, FSM or existing records.",
                ],
                [
                  "Re-engage",
                  "MONARDAS runs the agreed follow-up sequence using approved messaging and contact methods.",
                ],
                [
                  "Identify renewed intent",
                  "Track homeowner responses, questions and willingness to revisit the estimate.",
                ],
                [
                  "Hand back to sales",
                  "Your salesperson receives the estimate context, homeowner response and reason to follow up.",
                ],
                [
                  "Measure",
                  "Report activity, replies, meaningful responses and sales handoffs. Include sales outcomes only where your team confirms them.",
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
              <p className="fine-print">
                Illustrative example only. Not a customer case study or recorded
                result.
              </p>
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
          <div className="hvac-process-cta">
            <Button href={pilotHref}>Get a Free Estimate Recovery Assessment</Button>
          </div>
        </div>
      </section>
      <section className="section container">
        <SectionHeading
          label="04 / Clear responsibilities"
          title="What does MONARDAS actually do?"
        />
        <div className="split hvac-readiness">
          <div>
            <h3>MONARDAS runs the recovery workflow</h3>
            <dl className="hvac-list">
              {[
                [
                  "Review and prepare",
                  "Review the agreed estimate batch and help define approved recovery messaging.",
                ],
                [
                  "Follow up and track intent",
                  "Run the agreed sequence, track responses and identify homeowners open to revisiting their quote.",
                ],
                [
                  "Create handoff context",
                  "Connect the homeowner’s reply to the original estimate and the reason for a sales follow-up.",
                ],
                [
                  "Report what happened",
                  "Provide follow-up records, intent notes and a pilot report. Replies, handoffs and confirmed sales stay separate.",
                ],
              ].map(([title, copy]) => (
                <div key={title}>
                  <dt>{title}</dt>
                  <dd>{copy}</dd>
                </div>
              ))}
            </dl>
            <p className="fine-print">
              MONARDAS does not replace your sales team. It gives your sales
              team another reason to have a conversation.
            </p>
          </div>
          <div>
            <h3>Your team still owns the sale</h3>
            <dl className="hvac-list">
              {[
                [
                  "Provide usable records",
                  "A CRM/FSM export or list linking homeowner contact details to the original estimate. Required fields are agreed before transfer.",
                ],
                [
                  "Confirm eligible contacts",
                  "Your team confirms which records may be included and which contacts must be excluded before outreach begins.",
                ],
                [
                  "Assign a sales handoff owner",
                  "Someone who can pick up renewed conversations and report the outcome.",
                ],
                [
                  "Advise and close",
                  "Your team handles technical advice, equipment recommendations, pricing, financing discussions, appointments and the close.",
                ],
              ].map(([title, copy]) => (
                <div key={title}>
                  <dt>{title}</dt>
                  <dd>{copy}</dd>
                </div>
              ))}
            </dl>
            <p className="fine-print">
              Fit depends on records and follow-up capacity, not fixed revenue,
              technician or review-count thresholds.
            </p>
          </div>
        </div>
      </section>
      <section className="section hvac-founder" id="founding-partners">
        <div className="container split">
          <div>
            <Eyebrow>05 / Founder-led Recovery Pilot</Eyebrow>
            <h2>Founder-led from the first estimate to the final review.</h2>
            <p className="hvac-founder-name">
              Iurii Shalygin <span>Founder, MONARDAS</span>
            </p>
          </div>
          <div className="product-copy">
            <p>
              You work directly with Iurii, the person designing and operating
              the pilot. He reviews your backlog, defines the workflow, monitors
              follow-up and evaluates what came back to your sales team.
            </p>
            <p>
              Early pilots are intentionally founder-led so the process is built
              around real HVAC sales workflows, not assumptions made from a
              distance.
            </p>
            <Button href={pilotHref}>Discuss a Recovery Pilot</Button>
            <p className="fine-print">
              The pilot does not guarantee replies, bookings or recovered
              revenue.
            </p>
          </div>
        </div>
      </section>
      <section className="section container">
        <SectionHeading
          label="06 / Illustrative economics — not a forecast"
          title="You don’t necessarily need more leads."
          description="You may need more value from the leads you’ve already bought. If even a small number of homeowners in a meaningful backlog are still open to a conversation, re-engagement may be worth evaluating."
        />
        <p className="hvac-intro">
          Use your own numbers. Illustrative scenario only. Not a forecast.
          Actual outcomes depend on estimate quality, homeowner intent, sales
          follow-up and other factors.
        </p>
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
              Before you buy another lead,{" "}
              <em>find out what is still sitting in your pipeline.</em>
            </h2>
          </div>
          <div className="product-copy">
            <p>
              Tell us about your unsold replacement estimates. We’ll review the
              backlog, assess whether it looks suitable for recovery, and
              outline what a focused 25–50 estimate pilot could look like.
            </p>
            <Button href={pilotHref}>Get a Free Estimate Recovery Assessment</Button>
            <p className="fine-print">
              No commitment. If the backlog isn’t a fit, we’ll tell you.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
