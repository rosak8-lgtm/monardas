import { Button, Eyebrow, Flow, SectionHeading } from "./site";

const recoverySteps = [
  ["Capture", "Identify missed calls, unclosed estimates and follow-up gaps."],
  [
    "Respond",
    "Trigger fast, structured communication while buying intent is still active.",
  ],
  ["Qualify", "Separate real opportunities from low-intent conversations."],
  [
    "Recover",
    "Route qualified opportunities back to the team at the right moment.",
  ],
  [
    "Measure",
    "Track recovered conversations, appointments, estimates and revenue.",
  ],
];

function ReviewList({ items }: { items: string[] }) {
  return (
    <div className="scope-list" role="list">
      {items.map((item) => (
        <div role="listitem" key={item}>
          {item}
        </div>
      ))}
    </div>
  );
}

export function CurrentFocusPage() {
  return (
    <>
      <section className="container page-hero ai-hero">
        <div>
          <Eyebrow>Current Focus</Eyebrow>
          <h1>
            Recover missed HVAC leads and unsold estimates{" "}
            <em>automatically.</em>
          </h1>
          <p>
            MONARDAS helps HVAC companies recover revenue already sitting inside
            missed calls, unclosed estimates and inconsistent follow-up without
            adding more admin work to your team.
          </p>
          <div className="button-row">
            <Button>Request a Revenue Recovery Audit</Button>
            <Button href="#system" secondary>
              See how it works
            </Button>
          </div>
          <p className="fine-print">
            Built for HVAC companies with active lead flow, field teams and an
            existing CRM/FSM.
          </p>
        </div>
        <div className="recovery-visual">
          <Eyebrow>The opportunity / Existing demand</Eyebrow>
          <div className="estimate-sheet">
            <span>YOUR HVAC PIPELINE</span>
            <h2>
              Missed calls.
              <br />
              Unsold estimates.
              <br />
              <em>A next step.</em>
            </h2>
            <div>
              <span>Identify</span>
              <strong>Follow-up gaps</strong>
            </div>
            <div>
              <span>Respond</span>
              <strong>Qualify buying intent</strong>
            </div>
            <div>
              <span>Recover</span>
              <strong>Return to your team ↗</strong>
            </div>
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
              label="01 / Missed Call Recovery"
              title="Turn missed calls into booked opportunities."
            />
            <div className="pilot">
              <p>When a homeowner calls and nobody answers, speed matters.</p>
              <p>
                MONARDAS automatically follows up, qualifies the opportunity and
                brings qualified conversations back to your team before the lead
                moves on to a competitor.
              </p>
            </div>
          </div>
          <Flow
            items={[
              "Missed call",
              "Immediate follow-up",
              "Qualification",
              "Booked conversation",
            ]}
          />
          <div className="pilot">
            <p>
              Best suited for HVAC companies that generate consistent inbound
              calls from Google Ads, Local Services Ads, SEO, referrals and
              repeat customers.
            </p>
          </div>
        </div>
      </section>

      <section className="section container">
        <div className="split">
          <SectionHeading
            label="02 / Unsold Estimate Recovery"
            title="Bring forgotten estimates back into the pipeline."
          />
          <div className="pilot">
            <p>
              Most HVAC companies already have revenue sitting in estimates that
              were quoted but never closed.
            </p>
            <p>
              MONARDAS follows up automatically, identifies buying intent and
              routes warm opportunities back to your team.
            </p>
          </div>
        </div>
        <Flow
          items={[
            "Unsold estimate",
            "Structured follow-up",
            "Intent detected",
            "Sales opportunity",
          ]}
        />
        <div className="pilot">
          <p>
            Instead of relying on technicians or office staff to remember every
            follow-up, the system keeps working until the opportunity is
            resolved.
          </p>
        </div>
      </section>

      <section className="dark section">
        <div className="container split">
          <div className="section-heading">
            <h2>You may not need more leads.</h2>
            <p className="lead">
              You may need to recover more of the ones you already paid for.
            </p>
          </div>
          <div className="pilot">
            <p>Most HVAC growth strategies start with more advertising.</p>
            <p>We start somewhere else.</p>
            <p>
              We look at the demand already entering your business and identify
              where revenue disappears after the initial call, estimate or
              follow-up.
            </p>
            <p>The goal is simple:</p>
            <h3>
              Recover more booked jobs and closed revenue from the lead flow you
              already have.
            </h3>
          </div>
        </div>
      </section>

      <section className="section container split" id="system">
        <SectionHeading
          label="How it works"
          title="A focused revenue recovery system."
        />
        <div className="steps">
          {recoverySteps.map(([title, description], i) => (
            <article key={title}>
              <span>0{i + 1}</span>
              <div>
                <h3>{title}</h3>
                <p>{description}</p>
              </div>
              <span aria-hidden="true">↗</span>
            </article>
          ))}
        </div>
      </section>

      <section className="stone section">
        <div className="container split">
          <div className="pilot">
            <SectionHeading
              label="Revenue Recovery Audit"
              title="Find where revenue is leaking before buying more traffic."
              description="The Revenue Recovery Audit is a focused review of what happens to qualified opportunities after they enter your business."
            />
            <Button>Request a Revenue Recovery Audit</Button>
            <p className="fine-print">
              No software pitch. First we identify whether there is revenue
              worth recovering.
            </p>
          </div>
          <div>
            <ReviewList
              items={[
                "Missed-call follow-up",
                "Unsold estimate follow-up",
                "Lead response time",
                "CRM/FSM workflow",
                "Ownership of follow-up",
                "Stale opportunities",
                "Manual processes that should be automated",
              ]}
            />
            <div className="pilot">
              <p>
                You receive a practical view of where recovery opportunities may
                exist and which workflows are worth fixing first.
              </p>
              <p>
                Not to sell you more software.
                <br />
                Not to automate everything.
                <br />
                First, determine whether meaningful recoverable revenue exists.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section container split">
        <div className="pilot">
          <Eyebrow>Built for growing HVAC operators</Eyebrow>
          <h2>Who it is for.</h2>
          <p>
            MONARDAS is currently focused on HVAC businesses with
            characteristics such as:
          </p>
          <div className="handoff-note">
            <p>
              This is not designed for businesses that are still trying to
              generate their first handful of leads.
            </p>
            <p>
              It is designed for companies where lead flow already exists, but
              follow-up is imperfect.
            </p>
          </div>
        </div>
        <ReviewList
          items={[
            "3–20 technicians",
            "Consistent inbound lead flow",
            "An existing CRM or FSM platform",
            "Paid advertising or meaningful organic demand",
            "50+ Google reviews",
            "Enough lead volume for missed opportunities to matter",
            "No large internal call center handling every follow-up manually",
          ]}
        />
      </section>

      <section className="stone section">
        <div className="container">
          <div className="split">
            <div className="section-heading">
              <h2>Revenue recovery before lead generation.</h2>
            </div>
            <div className="pilot">
              <p>A missed opportunity has already cost something.</p>
              <p>It may have come from:</p>
              <ReviewList
                items={[
                  "Google Ads",
                  "Local Services Ads",
                  "SEO",
                  "Referrals",
                  "Repeat customers",
                  "Financing campaigns",
                  "Seasonal promotions",
                ]}
              />
              <p>
                If the lead already entered your system, recovering it is often
                more efficient than paying to replace it with another one.
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
          <div className="pilot">
            <p>That gap is where revenue recovery lives.</p>
          </div>
        </div>
      </section>

      <section className="section container split">
        <div className="section-heading">
          <h2>Designed to fit the systems you already use.</h2>
        </div>
        <div className="pilot">
          <p>
            MONARDAS is built around existing HVAC workflows rather than forcing
            a complete operating-system replacement.
          </p>
          <Eyebrow>CRM/FSM examples</Eyebrow>
          <ReviewList
            items={[
              "ServiceTitan",
              "Housecall Pro",
              "Jobber",
              "Other CRM/FSM platforms",
            ]}
          />
          <p className="fine-print">
            Specific connections are confirmed during scoping.
          </p>
          <p>
            The objective is to improve follow-up around your current operation,
            not create another dashboard your team has to manage all day.
          </p>
        </div>
      </section>

      <section className="dark section">
        <div className="container split">
          <div className="pilot">
            <Eyebrow>Measure what actually matters</Eyebrow>
            <h2>
              <em>Recovered revenue.</em>
            </h2>
            <p>We care about business outcomes such as:</p>
            <div className="handoff-note">
              <p>
                Not vanity AI metrics.
                <br />
                Not number of automated messages sent.
              </p>
            </div>
          </div>
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
        </div>
      </section>

      <section className="final-cta">
        <div className="container split">
          <h2>
            There may already be more revenue inside{" "}
            <em>your existing pipeline.</em>
          </h2>
          <div className="pilot">
            <p>
              Before spending more to create new demand, find out what is being
              lost in the demand you already have.
            </p>
            <Button>Request a Revenue Recovery Audit</Button>
            <p>
              We’ll review your current follow-up process and identify where
              recovery opportunities may exist.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
