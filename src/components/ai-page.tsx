import Link from "next/link";
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
          <em>you already paid to generate.</em>
        </h1>
        <p>
          MONARDAS AI builds revenue-recovery systems for home-service
          businesses — identifying missed opportunities, re-engaging qualified
          prospects and returning buying intent to your team.
        </p>
        <div className="button-row">
          <Button href="/hvac">Explore HVAC Revenue Recovery</Button>
          <Button secondary>Request a Revenue Recovery Audit</Button>
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
            label="The platform / From friction to system"
            title="One operating sequence. A measurable outcome."
            description="The system supports follow-up. Your team owns the customer relationship, the advice and the sale."
          />
          <RecoveryProcess />
        </div>
      </section>
      <section className="container section split">
        <div className="product-copy">
          <Eyebrow>First commercial vertical / HVAC</Eyebrow>
          <h2>
            Existing demand.
            <br />
            <em>Unfinished conversations.</em>
          </h2>
          <p>
            Missed calls and unsold replacement estimates are the starting
            point. Build a focused workflow around the gaps, then measure what
            comes back to the team.
          </p>
          <Button href="/hvac">Explore HVAC Revenue Recovery</Button>
        </div>
        <div className="product-copy">
          <div className="steps">
            <article>
              <span>01</span>
              <div>
                <h3>Missed Call Recovery</h3>
                <p>
                  Respond quickly when the team cannot answer. Qualify the need
                  and make a clear human handoff.
                </p>
              </div>
            </article>
            <article>
              <span>02</span>
              <div>
                <h3>Unsold Estimate Recovery</h3>
                <p>
                  Restart quiet replacement conversations and surface intent
                  that still needs a salesperson.
                </p>
              </div>
            </article>
          </div>
          <div className="handoff-note">
            <Eyebrow>Future vertical / Roofing</Eyebrow>
            <p>
              The same principles can apply to dormant roofing estimates. HVAC
              is our first go-to-market focus.
            </p>
            <Link className="text-link" href="/roofing">
              Explore the roofing direction ↗
            </Link>
          </div>
        </div>
      </section>
      <ProductFounder />
      <RevenueCTA />
    </div>
  );
}
