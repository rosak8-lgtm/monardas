import { Button, Eyebrow, SectionHeading } from "./site";
import {
  ProductFounder,
  RecoveryProcess,
  RevenueCTA,
} from "./revenue-sections";

export function AIPage() {
  return (
    <div className="product-page">
      <section className="container page-hero product-hero">
        <Eyebrow>MONARDAS AI</Eyebrow>
        <h1>
          Recover revenue from opportunities{" "}
          <em>you&apos;ve already paid to generate.</em>
        </h1>
        <p>
          MONARDAS AI builds focused revenue-recovery systems around gaps in
          existing demand. Our first workflow re-engages unsold HVAC replacement
          estimates and returns interested homeowners to your sales team.
        </p>
        <div className="button-row">
          <Button href="/hvac">Explore HVAC Revenue Recovery</Button>
          <Button href="/contact?intent=hvac-pilot" secondary>
            Get a Free Estimate Recovery Audit
          </Button>
        </div>
        <ul className="product-promises">
          <li>No more leads required.</li>
          <li>No replacement for your sales team.</li>
          <li>We work the opportunities already sitting in your pipeline.</li>
        </ul>
      </section>
      <section className="dark section">
        <div className="container split">
          <SectionHeading
            label="Revenue recovery systems / From friction to system"
            title="One operating sequence. A measurable outcome."
            description="The system supports follow-up. Your team owns the customer relationship, the advice and the sale."
          />
          <RecoveryProcess />
        </div>
      </section>
      <section className="container section split">
        <div className="product-copy">
          <Eyebrow>First commercial workflow / HVAC</Eyebrow>
          <h2>
            Existing demand.
            <br />
            <em>Unfinished conversations.</em>
          </h2>
          <p>
            HVAC Unsold Replacement Estimate Recovery starts with quotes your
            team has already prepared. A founder-led managed pilot follows up on
            a selected batch and hands renewed conversations back to you. We
            start narrow, evaluate the economics and operating process, then
            decide what is worth automating or expanding.
          </p>
          <Button href="/hvac">Explore HVAC Revenue Recovery</Button>
        </div>
        <div className="product-copy">
          <div className="steps">
            <article>
              <span>01</span>
              <div>
                <h3>Unsold Estimate Recovery</h3>
                <p>
                  Start with 25–50 replacement estimates. Agree on messaging,
                  eligible contacts and the sales handoff before outreach.
                </p>
              </div>
            </article>
            <article>
              <span>02</span>
              <div>
                <h3>Human sales handoff</h3>
                <p>
                  Your team receives the homeowner’s response and estimate
                  context. You handle advice, pricing and closing.
                </p>
              </div>
            </article>
          </div>
          <div className="handoff-note">
            <Eyebrow>Future direction</Eyebrow>
            <p>
              Additional revenue-recovery workflows may follow after the first
              workflow is proven. Missed-call recovery remains a future
              possibility, outside the current pilot.
            </p>
          </div>
        </div>
      </section>
      <ProductFounder />
      <RevenueCTA />
    </div>
  );
}
