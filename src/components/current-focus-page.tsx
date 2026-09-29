import { Button, Eyebrow } from "./site";

export function CurrentFocusPage() {
  return (
    <div className="product-page">
      <section className="container page-hero product-hero">
        <Eyebrow>Current Focus / MONARDAS AI</Eyebrow>
        <h1>
          HVAC estimate recovery.
          <br />
          <em>Our first commercial workflow.</em>
        </h1>
        <p>
          We’re starting with unsold HVAC replacement estimates: opportunities
          your team already generated, quoted and paid to acquire. For U.S. HVAC
          contractors, a focused paid pilot combines structured, founder-led
          follow-up with a human sales handoff.
        </p>
        <div className="button-row">
          <Button href="/contact?intent=hvac-pilot">
            Get a Free Estimate Recovery Assessment
          </Button>
          <Button href="/hvac" secondary>
            Explore HVAC Revenue Recovery
          </Button>
        </div>
      </section>
      <section className="dark section">
        <div className="container split">
          <div>
            <Eyebrow>A focused starting point</Eyebrow>
            <h2>
              Dormant estimates.
              <br />
              <em>A clear next conversation.</em>
            </h2>
          </div>
          <dl className="focus-facts">
            {[
              ["Who", "U.S. HVAC contractors"],
              ["What", "Unsold replacement estimates"],
              ["How", "Structured follow-up + human sales handoff"],
              ["Stage", "Focused paid pilot"],
            ].map(([label, value]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
      <section className="section container split">
        <div>
          <Eyebrow>Founder-led Recovery Pilot</Eyebrow>
          <h2>Build around the operation you already have.</h2>
        </div>
        <div className="product-copy">
          <p>
            Start with a free backlog review, with no commitment. If there’s a
            fit, we agree on a paid pilot of 25–50 estimates, using a CRM/FSM
            export or existing list. Scope and terms are confirmed before
            launch.
          </p>
          <Button href="/hvac#founding-partners">
            Explore the Founder-led Recovery Pilot
          </Button>
          <p>
            You work directly with the person designing and operating the pilot.
            The broader MONARDAS thesis remains intelligence, systems and
            ownership.
          </p>
          <Button href="/ai" secondary>
            Explore MONARDAS AI
          </Button>
        </div>
      </section>
    </div>
  );
}
