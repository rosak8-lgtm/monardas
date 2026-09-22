import Link from "next/link";
import { Button, Eyebrow, SectionHeading } from "./site";

export function ReviewList({ items }: { items: string[] }) {
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

export function RecoveryProcess() {
  const steps = [
    ["Identify", "Find missed calls, dormant estimates and gaps in follow-up."],
    [
      "Respond",
      "Start relevant, structured communication while the opportunity is still open.",
    ],
    [
      "Qualify",
      "Understand buying intent, timing and the questions behind a decision.",
    ],
    [
      "Recover",
      "Return qualified opportunities to the people who can close the job.",
    ],
    [
      "Measure",
      "Track conversations, appointments and attributed closed revenue separately.",
    ],
  ];
  return (
    <div className="steps" role="list">
      {steps.map(([title, description], i) => (
        <article role="listitem" key={title}>
          <span>0{i + 1}</span>
          <div>
            <h3>{title}</h3>
            <p>{description}</p>
          </div>
          <span aria-hidden="true">↗</span>
        </article>
      ))}
    </div>
  );
}

export function ProductFounder() {
  return (
    <section className="founder-band">
      <div className="container split">
        <div>
          <Eyebrow>The operating idea / Founder</Eyebrow>
          <h2>Yurii Shalygin</h2>
          <p>Entrepreneur / System Builder / Owner</p>
        </div>
        <div className="product-copy">
          <p>
            MONARDAS was built around a simple observation: businesses often
            don’t need more leads first. They need better systems for the
            opportunities they already have.
          </p>
          <p>
            We identify measurable friction, build a system around it and scale
            what works.
          </p>
          <Link className="text-link" href="/founder">
            The founder’s operating philosophy ↗
          </Link>
        </div>
      </div>
    </section>
  );
}

export function RecoveryAudit() {
  return (
    <section className="section" id="audit">
      <div className="container split">
        <div className="product-copy">
          <SectionHeading
            label="Revenue Recovery Audit"
            title="Find where revenue is leaking before buying more traffic."
            description="A focused review of what happens to qualified opportunities after they enter your business."
          />
          <Button>Get a Revenue Recovery Audit</Button>
          <p className="fine-print">
            Diagnosis first. We identify whether there is revenue worth
            recovering.
          </p>
        </div>
        <div className="product-copy">
          <ReviewList
            items={[
              "Missed-call follow-up",
              "Unsold estimate follow-up",
              "Lead response time",
              "CRM/FSM workflow",
              "Ownership of follow-up",
              "Stale opportunities",
              "Manual processes suitable for automation",
            ]}
          />
          <p>
            Not to sell you more software.
            <br />
            Not to automate everything.
          </p>
          <p>First, determine whether meaningful recoverable revenue exists.</p>
          <p>
            You receive a practical view of the gaps and which workflows are
            worth fixing first.
          </p>
        </div>
      </div>
    </section>
  );
}

export function RevenueCTA() {
  return (
    <section className="final-cta">
      <div className="container split">
        <h2>
          There may already be more revenue inside{" "}
          <em>your existing pipeline.</em>
        </h2>
        <div className="product-copy">
          <p>
            Before spending more to create new demand, find out what is being
            lost in the demand you already have.
          </p>
          <Button>Get a Revenue Recovery Audit</Button>
          <p className="fine-print">
            We’ll review your follow-up process and identify where recovery
            opportunities may exist.
          </p>
        </div>
      </div>
    </section>
  );
}
