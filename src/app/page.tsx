import Link from "next/link";
import {
  Button,
  Eyebrow,
  Flow,
  Philosophy,
  SectionHeading,
} from "@/components/site";
import { SystemMap } from "@/components/system-map";
import { pageMetadata } from "@/lib/seo";
export const metadata = pageMetadata(
  "Intelligence. Systems. Ownership.",
  "MONARDAS builds, automates and scales businesses designed to become durable assets. Explore our operating philosophy and current revenue recovery focus.",
  "/",
);
const units = [
  [
    "AI",
    "Scalable software. Measurable outcomes.",
    "Revenue-recovery systems for businesses with existing demand. Starting with HVAC.",
    "Product platform",
  ],
  [
    "Systems",
    "The work behind the software.",
    "Understand the real process. Validate the economics. Build a standard worth automating.",
    "Implementation layer",
  ],
  [
    "Ventures",
    "Build with an owner’s perspective.",
    "A long-term thesis for new products, acquisitions and operating businesses with systems upside.",
    "Long-term thesis",
  ],
  [
    "Capital",
    "Choose what compounds next.",
    "An internal framework for moving retained cash into productive assets.",
    "Internal allocation",
  ],
  [
    "Commerce",
    "Demand, understood through practice.",
    "Test products, build distribution and earn the right to scale through sound unit economics.",
    "Development direction",
  ],
  [
    "Nature",
    "Where the story began.",
    "The physical-product roots of Monardas, inspired by Siberian botanicals.",
    "Botanical origins",
  ],
];
export default function Home() {
  return (
    <>
      <section className="corporate-hero dark">
        <div className="container hero-grid">
          <div>
            <Eyebrow>Independent thinking. Enduring value.</Eyebrow>
            <h1>
              Intelligence.
              <br />
              Systems.
              <br />
              <em>Ownership.</em>
            </h1>
            <p>
              We build, automate and scale businesses
              <br className="desktop-break" /> designed to become durable
              assets.
            </p>
            <div className="button-row">
              <Button href="#architecture">Explore Monardas</Button>
              <Button href="/ai" secondary>
                Explore MONARDAS AI
              </Button>
            </div>
          </div>
          <SystemMap />
        </div>
        <div className="container hero-baseline">
          <span>BUILD. AUTOMATE. SCALE. OWN.</span>
          <span>A long-term company, built one system at a time.</span>
          <a href="#operating">Explore below ↓</a>
        </div>
      </section>
      <section className="section container" id="operating">
        <div className="split">
          <Eyebrow>01 / The operating idea</Eyebrow>
          <div>
            <h2>
              Find the friction.
              <br />
              Build the system.
              <br />
              <em>Own the outcome.</em>
            </h2>
            <p className="lead">
              Start with a real inefficiency. Understand it through the work.
              Turn a proven solution into a repeatable process—and that process
              into an asset.
            </p>
          </div>
        </div>
        <Flow items={["Identify", "Build", "Automate", "Scale", "Own"]} />
      </section>
      <section className="focus-section section">
        <div className="container split">
          <div>
            <Eyebrow>02 / MONARDAS AI</Eyebrow>
            <h2>
              Revenue systems for businesses <em>with existing demand.</em>
            </h2>
            <p className="lead">
              We identify measurable friction, build systems around it and scale
              what works.
            </p>
            <Button href="/ai">Explore MONARDAS AI</Button>
          </div>
          <div className="focus-index">
            <div className="focus-label">
              MONARDAS AI <span>REVENUE RECOVERY</span>
            </div>
            <Link href="/hvac">
              <span>01 / First commercial vertical</span>
              <h3>HVAC</h3>
              <p>Missed Call &amp; Unsold Estimate Recovery</p>
              <b aria-hidden="true">↗</b>
            </Link>
            <p>
              A focused starting point. Prove the workflow before expanding into
              future verticals.
            </p>
          </div>
        </div>
      </section>
      <section className="section container" id="architecture">
        <div className="section-heading-row">
          <SectionHeading
            label="03 / One company. Connected disciplines."
            title="Designed to work together."
          />
          <p>
            An umbrella architecture.
            <br />
            Built progressively, not all at once.
          </p>
        </div>
        <div className="unit-list">
          {units.map(([name, title, desc, status], i) => (
            <Link
              className={`unit unit-${name.toLowerCase()}`}
              key={name}
              href={`/${name.toLowerCase()}`}
            >
              <span className="unit-number">0{i + 1}</span>
              <div>
                <span className="eyebrow">MONARDAS</span>
                <h3>{name}</h3>
              </div>
              <div className="unit-description">
                <h4>{title}</h4>
                <p>{desc}</p>
              </div>
              <span className="unit-status">{status}</span>
              <span className="unit-arrow" aria-hidden="true">
                ↗
              </span>
            </Link>
          ))}
        </div>
      </section>
      <section className="section stone">
        <div className="container">
          <div className="split">
            <Eyebrow>04 / From service to asset</Eyebrow>
            <div>
              <h2>
                The destination is not more work.
                <br />
                <em>
                  It is a system that can
                  <br />
                  work without us.
                </em>
              </h2>
              <p className="lead">
                Manual work creates understanding. A documented standard makes
                that understanding repeatable. Technology scales the process
                once it is stable.
              </p>
            </div>
          </div>
          <Flow
            items={[
              "Service",
              "Productized service",
              "Automation",
              "SaaS",
              "Ownership",
            ]}
          />
          <Link className="text-link" href="/strategy">
            Read the operating thesis ↗
          </Link>
        </div>
      </section>
      <Philosophy />
      <section className="section container">
        <div className="split">
          <SectionHeading
            label="05 / Long-term group architecture"
            title="Earn. Build. Own. Allocate."
            description="Operating businesses create cash flow. Retained capital can fund the next productive asset. Ownership connects the two."
          />
          <div className="flywheel">
            {[
              "Operating businesses",
              "Cash flow",
              "Retained capital",
              "Investment / acquisitions",
              "Owned productive assets",
              "More cash flow",
            ].map((t, i) => (
              <div key={t}>
                <span>0{i + 1}</span>
                {t}
                <span aria-hidden="true">{i === 5 ? "↺" : "↓"}</span>
              </div>
            ))}
          </div>
        </div>
        <p className="fine-print">
          An internal capital-allocation philosophy, not investment services for
          third parties.
        </p>
      </section>
      <section className="founder-band">
        <div className="container split">
          <div>
            <Eyebrow>06 / Founder</Eyebrow>
            <h2>Yurii Shalygin</h2>
            <p>Entrepreneur / System Builder / Owner</p>
          </div>
          <div>
            <blockquote>
              “I build systems that turn inefficiency into scalable value.”
            </blockquote>
            <Link className="text-link" href="/founder">
              Founder philosophy ↗
            </Link>
          </div>
        </div>
      </section>
      <section className="closing container">
        <Eyebrow>A simple principle. A long horizon.</Eyebrow>
        <h2>
          Nature creates systems.
          <br />
          Intelligence improves them.
          <br />
          <em>Ownership compounds their value.</em>
        </h2>
        <Button href="/strategy" secondary>
          Explore the Strategy
        </Button>
      </section>
    </>
  );
}
