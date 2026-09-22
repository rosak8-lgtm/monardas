import { Button, Eyebrow, Flow, SectionHeading } from "./site";
import { Calculator } from "./calculator";
import {
  ProductFounder,
  RecoveryAudit,
  RecoveryProcess,
  RevenueCTA,
  ReviewList,
} from "./revenue-sections";

export function HVACPage() {
  return (
    <div className="product-page">
      <section className="container page-hero product-hero">
        <Eyebrow>MONARDAS AI / HVAC Revenue Recovery</Eyebrow>
        <h1>
          Recover revenue from HVAC opportunities{" "}
          <em>you’ve already paid to generate.</em>
        </h1>
        <p>
          Automated follow-up for missed calls and unsold replacement estimates
          — designed to identify homeowner intent and return qualified
          opportunities to your team.
        </p>
        <div className="button-row">
          <Button>Get a Revenue Recovery Audit</Button>
          <Button href="#system" secondary>
            See How It Works
          </Button>
        </div>
        <p className="fine-print">
          Built for growing HVAC companies with existing lead flow and CRM/FSM
          infrastructure.
        </p>
      </section>
      <section className="dark section">
        <div className="container split">
          <h2>
            You already paid for <em>these opportunities.</em>
          </h2>
          <div className="product-copy">
            <p className="lead">
              The homeowner called.
              <br />
              Your team quoted the job.
              <br />
              Then the conversation stopped.
            </p>
            <p>
              Before buying another lead, recover the opportunity already
              sitting in your pipeline.
            </p>
          </div>
        </div>
      </section>
      <section className="section container">
        <div className="split">
          <SectionHeading
            label="01 / Missed Call Recovery"
            title="Turn missed calls into active conversations."
          />
          <div className="product-copy">
            <p>
              When a homeowner contacts several contractors, speed matters. A
              missed call does not have to be the end of the opportunity.
            </p>
            <p>
              A fast automated response identifies the need, checks intent and
              returns the conversation to your team. Your team confirms
              availability and books the next step.
            </p>
          </div>
        </div>
        <Flow
          items={[
            "Missed call",
            "Fast automated response",
            "Intent qualification",
            "Human handoff",
            "Booked opportunity",
          ]}
        />
        <p className="fine-print">
          An intended workflow, not a guarantee of bookings.
        </p>
      </section>
      <section className="section product-tint">
        <div className="container">
          <div className="split">
            <SectionHeading
              label="02 / Unsold Estimate Recovery"
              title="Bring dormant replacement estimates back into the pipeline."
            />
            <div className="product-copy">
              <p>
                AC, furnace, heat pump and full-system replacement decisions can
                go quiet after the quote. Timing, financing or an unanswered
                question may still stand between the estimate and the job.
              </p>
              <p>
                Structured follow-up reduces reliance on technicians or office
                staff remembering every conversation manually. Buying intent and
                questions return to the salesperson with context.
              </p>
            </div>
          </div>
          <Flow
            items={[
              "Estimate issued",
              "Structured follow-up",
              "Homeowner responds",
              "Buying intent identified",
              "Opportunity returned to sales",
            ]}
          />
        </div>
      </section>
      <section className="section container split" id="system">
        <SectionHeading
          label="How it works"
          title="A focused revenue recovery system."
          description="Agree on eligible contacts, approved messaging, exclusions and handoff ownership before launch. Requests to stop end further follow-up."
        />
        <RecoveryProcess />
      </section>
      <section className="dark section">
        <div className="container">
          <div className="split">
            <SectionHeading
              label="The economics"
              title="Before buying more leads, recover the opportunities already in your pipeline."
            />
            <div className="product-copy">
              <p>
                A missed opportunity has already cost something. Demand may come
                from Google Ads, Local Services Ads, SEO, referrals, repeat
                customers, financing campaigns or seasonal promotions.
              </p>
              <p>
                Revenue recovery operates in the gaps between these stages. The
                first question is whether an existing opportunity can still move
                forward.
              </p>
            </div>
          </div>
          <Flow
            items={[
              "Lead generated",
              "Lead contacted",
              "Estimate issued",
              "Job booked",
            ]}
          />
        </div>
      </section>
      <section className="section container split" id="founding-partners">
        <div className="product-copy">
          <Eyebrow>Founding Partner Program</Eyebrow>
          <h2>
            Building the first revenue-recovery systems with a small group of
            HVAC operators.
          </h2>
          <p>
            We’re inviting a limited number of HVAC companies to work closely
            with us to refine recovery workflows, integrations and operating
            processes.
          </p>
          <Button href="/contact?intent=founding-partner">
            Apply as a Founding Partner
          </Button>
        </div>
        <div className="product-copy">
          <Eyebrow>Founding partners receive</Eyebrow>
          <ReviewList
            items={[
              "Direct founder involvement",
              "Implementation around the existing workflow",
              "Close measurement of recovered opportunities",
              "Early commercial terms",
              "Influence over product development",
            ]}
          />
          <p className="fine-print">
            Scope, terms and success measures are agreed together before
            implementation.
          </p>
        </div>
      </section>
      <section className="section product-tint">
        <div className="container">
          <SectionHeading
            label="Illustrative economics"
            title="What could recovery be worth?"
            description="Use your own unsold estimate volume and average replacement ticket. The recovery rate is an assumption you control, not a measured MONARDAS result."
          />
          <Calculator />
        </div>
      </section>
      <section className="section container split">
        <div className="product-copy">
          <Eyebrow>Operator fit</Eyebrow>
          <h2>Built for HVAC operators that already generate demand.</h2>
          <p>MONARDAS is not a lead-generation agency.</p>
          <p>
            It is designed for businesses that already have demand but lose
            opportunities during follow-up.
          </p>
        </div>
        <ReviewList
          items={[
            "$500k–$3M annual revenue",
            "3–20 technicians",
            "Existing CRM/FSM",
            "Active paid or organic lead generation",
            "Meaningful estimate volume",
            "50+ Google reviews",
            "No large internal reactivation department",
          ]}
        />
      </section>
      <section className="section product-tint">
        <div className="container split">
          <SectionHeading
            label="Workflow / Integration"
            title="Designed around the systems HVAC companies already use."
            description="Improve follow-up around the current operation, without assuming an operating-system replacement or another dashboard to manage all day."
          />
          <div className="product-copy">
            <Eyebrow>Examples of CRM/FSM environments</Eyebrow>
            <ReviewList
              items={[
                "ServiceTitan",
                "Housecall Pro",
                "Jobber",
                "Other CRM/FSM environments",
              ]}
            />
            <p>
              Integration scope depends on the client’s existing stack and
              available interfaces.
            </p>
            <p className="fine-print">
              These are examples, not claims of completed native integrations.
            </p>
          </div>
        </div>
      </section>
      <section className="dark section">
        <div className="container split">
          <div className="product-copy">
            <Eyebrow>Business outcomes</Eyebrow>
            <h2>Measure what actually matters.</h2>
            <p>
              Not vanity AI metrics.
              <br />
              Not number of automated messages sent.
            </p>
            <h3>
              <em>Recovered revenue.</em>
            </h3>
          </div>
          <div className="product-copy">
            <ReviewList
              items={[
                "Missed leads recovered",
                "Conversations restarted",
                "Appointments booked",
                "Unsold estimates reactivated",
                "Qualified opportunities returned to the team",
                "Closed revenue attributed to recovery workflows",
              ]}
            />
            <p className="fine-print">
              Track stages separately. A restarted conversation is not closed
              revenue.
            </p>
          </div>
        </div>
      </section>
      <RecoveryAudit />
      <ProductFounder />
      <RevenueCTA />
    </div>
  );
}
