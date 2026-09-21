import Link from "next/link";
import {
  Button,
  Eyebrow,
  Flow,
  SectionHeading,
  Steps,
  FAQ,
  FinalCTA,
} from "./site";
import { Calculator } from "./calculator";
export function AIPage({ industry }: { industry?: "roofing" | "hvac" }) {
  return (
    <>
      <section className="container page-hero ai-hero">
        <div>
          <Eyebrow>
            MONARDAS AI /{" "}
            {industry
              ? `${industry} estimate recovery`
              : "Revenue recovery for home services"}
          </Eyebrow>
          <h1>
            {industry === "roofing" ? (
              <>
                Your next roofing job
                <br />
                could already be
                <br />
                <em>in your pipeline.</em>
              </>
            ) : industry === "hvac" ? (
              <>
                Your next replacement
                <br />
                could already be
                <br />
                <em>in your pipeline.</em>
              </>
            ) : (
              <>
                Recover revenue
                <br />
                already sitting
                <br />
                <em>in your pipeline.</em>
              </>
            )}
          </h1>
          <p>
            Your team already paid to generate the lead. Already inspected the
            property. Already created the estimate. We help re-engage
            opportunities that never reached a final decision.
          </p>
          <div className="button-row">
            <Button>Recover Lost Revenue</Button>
            <Button href="#system" secondary>
              See the System
            </Button>
          </div>
        </div>
        <div className="recovery-visual">
          <div className="eyebrow">The opportunity / A second conversation</div>
          <div className="estimate-sheet">
            <span>EXISTING PIPELINE</span>
            <h2>
              An estimate.
              <br />
              Not a final answer.
            </h2>
            <div>
              <span>Original opportunity</span>
              <strong>
                {industry === "hvac"
                  ? "System replacement"
                  : "Roof replacement"}
              </strong>
            </div>
            <div>
              <span>Decision</span>
              <strong>Still open</strong>
            </div>
            <div>
              <span>Next step</span>
              <strong>Relevant follow-up ↗</strong>
            </div>
          </div>
          <div className="recovery-caption">
            <span className="status-dot" />
            Context → Conversation → Sales team
          </div>
          <p className="fine-print">
            Illustrative workflow, not customer results.
          </p>
        </div>
      </section>
      <section className="stone section">
        <div className="container">
          <div className="split">
            <SectionHeading
              label="01 / The revenue leak"
              title="The lead was acquired. The decision is still open."
            />
            <p className="lead">
              When a homeowner doesn’t say yes immediately, follow-up can fade.
              The opportunity may still exist—waiting on timing, budget or an
              unanswered question.
            </p>
          </div>
          <Flow
            items={[
              "Paid ads / Lead",
              "Inspection",
              "Estimate",
              "No decision",
              "Lost follow-up",
            ]}
          />
        </div>
      </section>
      <section className="section container">
        <SectionHeading
          label="02 / A specific problem. A focused offer."
          title="Built around the buying decision."
        />
        <div className="offer-grid">
          <article>
            <Eyebrow>Primary / Roofing</Eyebrow>
            <h3>
              Unsold Estimate
              <br />
              Recovery.
            </h3>
            <p>
              Revisit cold estimates, quote comparisons, insurance delays,
              financing questions and postponed roof replacements.
            </p>
            <Link className="text-link" href="/roofing">
              Explore roofing recovery ↗
            </Link>
          </article>
          <article>
            <Eyebrow>Secondary / HVAC</Eyebrow>
            <h3>
              Replacement Estimate
              <br />
              Recovery.
            </h3>
            <p>
              Reconnect with homeowners considering AC, furnace, heat pump and
              full-system replacements whose decisions went quiet.
            </p>
            <Link className="text-link" href="/hvac">
              Explore HVAC recovery ↗
            </Link>
          </article>
        </div>
      </section>
      <section className="dark section" id="system">
        <div className="container split">
          <SectionHeading
            label="03 / How the system works"
            title="Restart the conversation. Keep the context."
            description="The original estimate is the starting point. The homeowner’s reply determines the next step."
          />
          <Steps />
        </div>
      </section>
      <section className="section container">
        <div className="split">
          <SectionHeading
            label="04 / Understand the reason"
            title="Every reply points somewhere."
            description="Buying intent is more useful than another message sent. Classify the response, then take a clear next step."
          />
          <div>
            <div className="intent-tags">
              {[
                "Price",
                "Financing",
                "Insurance",
                "Timing",
                "Competitor",
                "Need to discuss",
                "Not ready",
                "Call me",
                "Not interested",
              ].map((t) => (
                <span key={t}>{t}</span>
              ))}
            </div>
            <div className="handoff-note">
              <Eyebrow>The human handoff</Eyebrow>
              <h3>
                Automation re-engages.
                <br />
                Your salesperson closes.
              </h3>
              <p>
                Interested homeowners return to your team with the estimate, the
                reply, the reason for hesitation and a clear next action.
                Questions stay with the people qualified to answer them.
              </p>
            </div>
          </div>
        </div>
        <Flow
          items={[
            "Lead",
            "Inspection",
            "Estimate",
            "No decision",
            "Follow-up",
            "Re-engagement",
            "Salesperson",
            "Recovered opportunity",
          ]}
        />
      </section>
      <section className="stone section">
        <div className="container">
          <SectionHeading
            label="05 / Illustrative recovery model"
            title="What could a second conversation be worth?"
            description="Explore a scenario using your own estimate volume. Reopened opportunities still need to be closed by your sales team."
          />
          <Calculator />
        </div>
      </section>
      <section className="section container split">
        <div>
          <Eyebrow>06 / Start with a pilot</Eyebrow>
          <h2>
            A small batch.
            <br />
            <em>A useful answer.</em>
          </h2>
        </div>
        <div className="pilot">
          <span className="pilot-number">25–50</span>
          <p>
            old estimates. A focused test of data quality, homeowner response
            and the sales handoff.
          </p>
          <p>
            No CRM replacement required. Agree on eligible contacts, approved
            messaging, ownership and measurement before launch. Review actual
            outcomes before expanding.
          </p>
          <Button>Request a Revenue Recovery Audit</Button>
        </div>
      </section>
      <FAQ />
      <FinalCTA />
    </>
  );
}
