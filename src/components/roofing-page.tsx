import { Button, Eyebrow, Flow, SectionHeading } from "./site";
import { ProductFounder, ReviewList } from "./revenue-sections";

export function RoofingPage() {
  return (
    <div className="product-page">
      <section className="container page-hero product-hero">
        <Eyebrow>MONARDAS AI / Future vertical</Eyebrow>
        <h1>
          Roofing Unsold
          <br />
          <em>Estimate Recovery.</em>
        </h1>
        <p>
          A roof replacement quote is the beginning of a decision. Structured
          follow-up can help clarify what is holding that decision back and
          return interested homeowners to your sales team.
        </p>
        <div className="button-row">
          <Button>Discuss Roofing Recovery</Button>
          <Button href="/hvac" secondary>
            Explore our primary HVAC focus
          </Button>
        </div>
        <p className="fine-print">
          Roofing is a secondary direction. HVAC remains our first go-to-market
          vertical.
        </p>
      </section>
      <section className="dark section">
        <div className="container split">
          <SectionHeading
            label="The opportunity"
            title="The inspection happened. The decision is still open."
          />
          <div className="product-copy">
            <p>
              Your team visited the property, scoped the work and prepared a
              quote. The homeowner may still be comparing contractors,
              considering financing or waiting for the right time.
            </p>
            <p>
              Relevant follow-up starts with that context. The objective is to
              understand whether the job is still in play, then bring the
              conversation back to the person who can help.
            </p>
          </div>
        </div>
      </section>
      <section className="section container">
        <SectionHeading
          label="The proposed workflow"
          title="Restart the conversation with the estimate in view."
        />
        <Flow
          items={[
            "Roofing estimate",
            "Contextual follow-up",
            "Decision understood",
            "Qualified sales handoff",
          ]}
        />
        <div className="split handoff-note">
          <div className="product-copy">
            <h3>Understand the hesitation.</h3>
            <p>
              A request for a different material, a financing question or a
              change in timing needs a different next step. Automated follow-up
              surfaces the reason; your team advises and closes.
            </p>
          </div>
          <ReviewList
            items={[
              "Scope and material questions",
              "Quote comparisons",
              "Financing and project timing",
              "Insurance-related delays",
              "Requests to speak with the estimator",
            ]}
          />
        </div>
      </section>
      <section className="section product-tint">
        <div className="container split">
          <SectionHeading
            label="Explore fit first"
            title="Start with the quality of the opportunity."
            description="Review the age of estimates, available contact information, permissions, exclusions and who owns the next conversation."
          />
          <div className="product-copy">
            <p>
              Any roofing implementation would be scoped around the existing CRM
              and sales process. No native integration, launch timeline or
              recovery result is assumed.
            </p>
            <Button>Request a Revenue Recovery Audit</Button>
            <p className="fine-print">
              A conversation about fit, not a promise of a live roofing product.
            </p>
          </div>
        </div>
      </section>
      <ProductFounder />
    </div>
  );
}
