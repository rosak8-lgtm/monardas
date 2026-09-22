import { Button, Eyebrow } from "./site";

export function CurrentFocusPage() {
  return (
    <div className="product-page">
      <section className="container page-hero product-hero">
        <Eyebrow>Current Focus / MONARDAS AI</Eyebrow>
        <h1>
          HVAC revenue recovery.
          <br />
          <em>Our first commercial focus.</em>
        </h1>
        <p>
          We’re building systems for growing HVAC companies that already
          generate demand but lose opportunities during follow-up. The starting
          point: missed calls and unsold replacement estimates.
        </p>
        <div className="button-row">
          <Button href="/hvac">Explore HVAC Revenue Recovery</Button>
          <Button secondary>Get a Revenue Recovery Audit</Button>
        </div>
      </section>
      <section className="dark section">
        <div className="container split">
          <div>
            <Eyebrow>A focused starting point</Eyebrow>
            <h2>
              Two gaps.
              <br />
              <em>One recovery system.</em>
            </h2>
          </div>
          <div className="steps">
            <article>
              <span>01</span>
              <div>
                <h3>Missed calls</h3>
                <p>
                  A homeowner called. The team was busy. Fast, relevant
                  follow-up can restart the conversation.
                </p>
              </div>
            </article>
            <article>
              <span>02</span>
              <div>
                <h3>Unsold replacement estimates</h3>
                <p>
                  The job was quoted. The decision went quiet. Structured
                  follow-up brings intent back into view.
                </p>
              </div>
            </article>
          </div>
        </div>
      </section>
      <section className="section container split">
        <div>
          <Eyebrow>Founding Partner Program</Eyebrow>
          <h2>Build around the operation you already have.</h2>
        </div>
        <div className="product-copy">
          <p>
            We’re inviting HVAC operators to help shape the first workflows,
            integrations and operating processes through direct founder
            involvement.
          </p>
          <Button href="/hvac#founding-partners">
            Explore the Founding Partner Program
          </Button>
          <p>
            MONARDAS AI is the product platform. HVAC is the first vertical. The
            broader MONARDAS thesis remains intelligence, systems and ownership.
          </p>
          <Button href="/ai" secondary>
            Explore MONARDAS AI
          </Button>
        </div>
      </section>
    </div>
  );
}
