import Link from "next/link";
import { Button, Eyebrow, Flow, Philosophy, SectionHeading } from "./site";
import { SystemMap } from "./system-map";

const principles = [
  [
    "Research",
    "Personally understand the actual problem, the people doing the work and the constraints they face.",
  ],
  [
    "Validation",
    "Prove that the solution creates a result worth paying for before adding complexity.",
  ],
  [
    "Standard",
    "Document a repeatable process with clear inputs, decisions and ownership.",
  ],
  [
    "Automation",
    "Remove repetitive human dependency while preserving judgment where it matters.",
  ],
  [
    "Software",
    "Scale a stable process with technology, rather than encoding an unproven workflow.",
  ],
  ["Ownership", "Turn the system into an asset that can keep creating value."],
];
function Rows({ items }: { items: string[][] }) {
  return (
    <div className="editorial-rows">
      {items.map(([t, d], i) => (
        <article key={t}>
          <span className="row-index">0{i + 1}</span>
          <h3>{t}</h3>
          <p>{d}</p>
        </article>
      ))}
    </div>
  );
}
function End({
  title = "Build what works. Own what compounds.",
  href = "/strategy",
  label = "Explore the Strategy",
}: {
  title?: string;
  href?: string;
  label?: string;
}) {
  return (
    <section className="closing container">
      <Eyebrow>MONARDAS / A long-term perspective</Eyebrow>
      <h2>{title}</h2>
      <Button href={href} secondary>
        {label}
      </Button>
    </section>
  );
}
function Hero({
  label,
  title,
  description,
  children,
  tone = "",
}: {
  label: string;
  title: React.ReactNode;
  description: string;
  children?: React.ReactNode;
  tone?: string;
}) {
  return (
    <section className={`company-hero ${tone}`}>
      <div className={`container page-hero ${children ? "hero-grid" : ""}`}>
        <div>
          <Eyebrow>{label}</Eyebrow>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>
        {children}
      </div>
    </section>
  );
}
export function CompanyPage({ page }: { page: string }) {
  if (page === "systems")
    return (
      <>
        <Hero
          label="MONARDAS SYSTEMS / The learning & implementation layer"
          title={
            <>
              Turn manual work
              <br />
              into <em>repeatable systems.</em>
            </>
          }
          description="The best automation starts with understanding the work. We research the real process, validate its value and build a standard before introducing technology."
        />
        <section className="section stone">
          <div className="container">
            <SectionHeading
              label="The method"
              title="Learn it. Prove it. Make it repeatable."
            />
            <Flow
              items={[
                "Research",
                "Validate",
                "Standardize",
                "Automate",
                "Productize",
              ]}
            />
          </div>
        </section>
        <section className="section container">
          <div className="split">
            <SectionHeading
              label="Where systems matter"
              title="Workflows with an economic consequence."
              description="Automation must improve revenue, cost, speed, conversion or reliability. If the outcome is unclear, the workflow is not ready."
            />
            <div className="scope-list">
              {[
                "Lead Response",
                "Sales Recovery",
                "Workflow",
                "CRM Operations",
                "Document Collection",
                "Back-office Automation",
                "Collections",
                "Reporting",
              ].map((t, i) => (
                <div key={t}>
                  <span>0{i + 1}</span>
                  {t}
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className="dark section">
          <div className="container split">
            <Eyebrow>Services are the learning layer</Eyebrow>
            <div>
              <h2>
                The service teaches us
                <br />
                <em>what the software must do.</em>
              </h2>
              <p className="lead">
                Services are not the final destination. Doing the work exposes
                exceptions, broken handoffs and the decisions that matter. A
                proven standard can later become software.
              </p>
            </div>
          </div>
        </section>
        <section className="container section">
          <Rows items={principles.slice(0, 3)} />
        </section>
        <Philosophy />
        <End href="/ai" label="See the Current Focus" />
      </>
    );
  if (page === "ventures")
    return (
      <>
        <Hero
          label="MONARDAS VENTURES / Long-term ownership thesis"
          title={
            <>
              Build.
              <br />
              Acquire.
              <br />
              <em>Optimize.</em>
            </>
          }
          description="Own the system, not just the work. Our long-term direction is to build or acquire businesses where better operations, technology and distribution can create durable value."
          tone="dark"
        >
          <SystemMap />
        </Hero>
        <section className="section container">
          <Rows
            items={[
              [
                "Build",
                "Create a business around a repeatable, high-value problem. Start close to the customer and prove the economics.",
              ],
              [
                "Acquire",
                "Seek proven cash flow, understandable operations and a clear path to improvement. Acquisition is a future pathway, not an announced portfolio.",
              ],
              [
                "Optimize",
                "Apply systems, automation, distribution and disciplined capital allocation to strengthen the underlying business.",
              ],
            ]}
          />
        </section>
        <section className="stone section">
          <div className="container split">
            <SectionHeading
              label="Future opportunity areas"
              title="A focused search for systems upside."
              description="These are areas of interest, not existing portfolio companies or completed acquisitions."
            />
            <div className="scope-list">
              {[
                "Home Services",
                "Vertical SaaS",
                "Workflow Software",
                "Niche Consumer Brands",
                "Selected Operating Businesses",
              ].map((t) => (
                <div key={t}>
                  {t}
                  <span>↗</span>
                </div>
              ))}
            </div>
          </div>
        </section>
        <End title="A business worth owning starts with a problem worth solving." />
      </>
    );
  if (page === "capital")
    return (
      <>
        <Hero
          label="MONARDAS CAPITAL / Internal capital allocation"
          title={
            <>
              Earn. Build.
              <br />
              Own. <em>Allocate.</em>
            </>
          }
          description="Operating businesses create cash. Ownership converts cash into productive assets. Capital allocation determines what compounds next."
          tone="dark"
        />
        <section className="capital-notice">
          <div className="container">
            <p>
              Monardas Capital represents the group’s long-term internal
              capital-allocation framework. It does not provide investment
              advisory, brokerage or asset-management services to third parties.
              It does not manage client money.
            </p>
          </div>
        </section>
        <section className="section container">
          <SectionHeading
            label="The allocation cycle"
            title="From operating discipline to productive ownership."
          />
          <Flow
            items={["Operate", "Retain", "Allocate", "Acquire", "Compound"]}
          />
          <Rows
            items={[
              [
                "Earn before allocating",
                "Build useful businesses with understandable economics. Cash flow creates choices; growth alone does not.",
              ],
              [
                "Retain with intention",
                "Preserve the capacity to operate, improve and respond to opportunity before committing capital elsewhere.",
              ],
              [
                "Allocate with discipline",
                "Compare reinvestment in the existing business with new assets. Understand the downside, demands on attention and time horizon.",
              ],
            ]}
          />
        </section>
        <section className="stone section">
          <div className="container split">
            <SectionHeading
              label="Potential future asset categories"
              title="A framework, not a portfolio."
              description="Long-term internal allocation categories. No current holdings, commitments or returns are implied."
            />
            <div className="scope-list">
              {[
                "Operating Businesses",
                "Vertical SaaS",
                "Public Markets",
                "Private Opportunities",
                "Real Estate",
              ].map((t) => (
                <div key={t}>
                  {t}
                  <span>↗</span>
                </div>
              ))}
            </div>
          </div>
        </section>
        <End title="The next asset should strengthen the whole." />
      </>
    );
  if (page === "commerce")
    return (
      <>
        <Hero
          label="MONARDAS COMMERCE / Development direction"
          title={
            <>
              Consumer brands.
              <br />
              <em>Distribution systems.</em>
            </>
          }
          description="Commerce is a system for discovering and scaling demand. A product earns its place through customer response, sound economics and a reason to buy again."
        />
        <section className="commerce-panel">
          <div className="container split">
            <div className="commerce-graphic" aria-hidden="true">
              <span>01 / THESIS</span>
              <div className="graphic-square one" />
              <div className="graphic-square two" />
              <div className="graphic-square three" />
              <span>DEMAND → DISTRIBUTION</span>
            </div>
            <div>
              <Eyebrow>Build a brand, not a product list</Eyebrow>
              <h2>
                Demand is the question.
                <br />
                <em>Testing is the discipline.</em>
              </h2>
              <p className="lead">
                A compelling creative concept is only the start. Conversion,
                fulfillment, contribution margin and repeat purchase determine
                whether a product deserves more investment.
              </p>
            </div>
          </div>
        </section>
        <section className="section container">
          <SectionHeading
            label="The commerce model"
            title="Evidence before expansion."
          />
          <Flow
            items={[
              "Product thesis",
              "Creative testing",
              "Conversion",
              "Unit economics",
              "Repeat purchase",
              "Brand",
              "Scale or kill",
            ]}
          />
          <Rows
            items={[
              [
                "Test a clear thesis",
                "Define who the product serves, why they would choose it and what would disprove the idea.",
              ],
              [
                "Build distribution deliberately",
                "Treat creative, storefront experience and fulfillment as one system. Measure the economics beyond the first order.",
              ],
              [
                "Scale selectively",
                "Invest when the evidence supports demand and sustainable margins. Stop when it does not.",
              ],
            ]}
          />
        </section>
        <End
          href="/nature"
          label="Explore Our Botanical Origins"
          title="Physical products. A systems perspective."
        />
      </>
    );
  if (page === "nature")
    return (
      <>
        <Hero
          label="MONARDAS NATURE / Our botanical origins"
          title={
            <>
              Rooted in nature.
              <br />
              <em>Built through practice.</em>
            </>
          }
          description="Monardas began with physical products inspired by Siberian botanicals. Under the umbrella architecture, that history has a home: MONARDAS NATURE."
          tone="nature-tone"
        >
          <div className="botanical-art" aria-hidden="true">
            <svg viewBox="0 0 400 430" fill="none">
              <g stroke="currentColor" strokeWidth="1.2">
                <path d="M190 415C215 325 178 194 219 35M200 340C155 290 119 267 81 211M202 281C251 255 288 204 301 145M201 207C160 182 142 147 144 97M207 147C239 116 259 83 253 52" />
                {[
                  [81, 211, -35],
                  [301, 145, 30],
                  [144, 97, -25],
                  [253, 52, 35],
                  [120, 270, -50],
                  [262, 228, 40],
                  [174, 177, -30],
                  [212, 98, 20],
                ].map(([x, y, r]) => (
                  <ellipse
                    key={`${x}-${y}`}
                    cx={x}
                    cy={y}
                    rx="13"
                    ry="37"
                    transform={`rotate(${r} ${x} ${y})`}
                  />
                ))}
              </g>
              <circle
                cx="214"
                cy="227"
                r="158"
                stroke="currentColor"
                opacity=".14"
              />
            </svg>
            <span>BOTANICAL ORIGINS / MONARDAS</span>
          </div>
        </Hero>
        <section className="section container">
          <div className="split">
            <Eyebrow>The first connection</Eyebrow>
            <div>
              <h2>
                Nature creates systems.
                <br />
                <em>Working with products teaches us to see them.</em>
              </h2>
              <p className="lead">
                Physical products connect sourcing, quality, presentation,
                distribution and customer experience. That practical perspective
                remains part of how Monardas thinks about building businesses.
              </p>
            </div>
          </div>
        </section>
        <section className="stone section">
          <div className="container">
            <SectionHeading
              label="Existing product categories"
              title="A botanical foundation."
              description="The established product categories belong within Monardas Nature. This corporate page introduces the range; it is not a replacement storefront."
            />
            <Rows
              items={[
                [
                  "Sagan Dalya",
                  "A botanical category from the original Monardas physical-product business.",
                ],
                [
                  "Monarda CO₂ Extract",
                  "The extract category within the Monardas botanical range.",
                ],
                [
                  "Monarda Essential Oil",
                  "The essential-oil category within the existing botanical range.",
                ],
              ]}
            />
            <p className="fine-print">
              For ingredients, intended use and product-specific guidance, refer
              to the original product labeling and store listings.
            </p>
          </div>
        </section>
        <End
          title="The origins remain. The architecture evolves."
          href="/"
          label="Explore Monardas"
        />
      </>
    );
  if (page === "founder")
    return (
      <>
        <Hero
          label="YURII SHALYGIN / Founder of MONARDAS"
          title={
            <>
              Build systems.
              <br />
              Own assets.
              <br />
              <em>Allocate capital.</em>
            </>
          }
          description="My work is built around one principle: find inefficiency, redesign the system, automate repeatable work and turn the result into an asset."
        />
        <section className="founder-band">
          <div className="container split">
            <div>
              <Eyebrow>Entrepreneur / System Builder / Owner</Eyebrow>
              <h2>Yurii Shalygin</h2>
            </div>
            <p className="lead">
              The founder’s role should evolve with the business: from doing the
              work, to designing the system, to owning the asset and deciding
              where capital goes next.
            </p>
          </div>
        </section>
        <section className="section container">
          <SectionHeading
            label="Operating philosophy"
            title="Understanding comes before automation."
          />
          <Rows items={principles} />
        </section>
        <Philosophy />
        <section className="section container">
          <SectionHeading
            label="The intended evolution"
            title="Change the role. Keep the responsibility."
          />
          <Flow
            items={[
              "Operator",
              "System Architect",
              "Owner",
              "Capital Allocator",
            ]}
          />
          <div className="split section-inset">
            <div>
              <Eyebrow>Current focus</Eyebrow>
              <h3>
                Revenue Recovery.
                <br />
                Vertical AI.
                <br />
                Home Services.
              </h3>
            </div>
            <div>
              <h3>A long-term ownership thesis.</h3>
              <p className="lead">
                Build useful systems around real economic problems. Let evidence
                determine where to expand. Retain ownership of the assets that
                emerge, and allocate resources with a long horizon.
              </p>
              <Link className="text-link" href="/ai">
                See where we are building now ↗
              </Link>
            </div>
          </div>
        </section>
        <End />
      </>
    );
  return (
    <>
      <Hero
        label="MONARDAS / Operating thesis"
        title={
          <>
            Specific problems.
            <br />
            Repeatable systems.
            <br />
            <em>Durable ownership.</em>
          </>
        }
        description="The strongest software opportunities begin with a specific industry, a specific workflow and a measurable economic outcome. AI is leverage inside that system."
        tone="dark"
      />
      <section className="section container split">
        <Eyebrow>01 / Vertical depth over generic breadth</Eyebrow>
        <div>
          <h2>
            Understand the industry.
            <br />
            <em>Then build the intelligence.</em>
          </h2>
          <p className="lead">
            Industry context determines what matters: the buying decision, the
            workflow, the exceptions and the cost of failure. A general
            capability becomes valuable when it improves a specific outcome.
          </p>
          <div className="intent-tags">
            {[
              "Vertical SaaS",
              "Workflow SaaS",
              "Revenue SaaS",
              "AI-enabled SaaS",
            ].map((t) => (
              <span key={t}>{t}</span>
            ))}
          </div>
          <p className="lead">
            Connect automation to revenue, cost, speed or conversion. Technology
            is a means; a working economic model is the foundation.
          </p>
        </div>
      </section>
      <section className="stone section">
        <div className="container">
          <SectionHeading
            label="02 / The full business trajectory"
            title="A service can become an asset."
            description="Each stage earns the next. Expansion depends on a proven workflow and sound economics, not a predetermined launch schedule."
          />
          <Flow
            items={[
              "Service",
              "Productized Service",
              "Automation Platform",
              "Vertical SaaS",
              "Multi-Vertical Platform",
              "Acquisition",
              "Holding / Capital Allocation",
            ]}
          />
        </div>
      </section>
      <section className="section container">
        <div className="split">
          <SectionHeading
            label="03 / The practical starting point"
            title="One engine. Industry-specific understanding."
          />
          <div className="roadmap">
            <article>
              <Eyebrow>Now</Eyebrow>
              <h3>Revenue Recovery</h3>
              <p>Initial verticals: Roofing and HVAC.</p>
            </article>
            <article>
              <Eyebrow>Next / Expansion architecture</Eyebrow>
              <h3>Home Services Engine</h3>
              <p>
                Plumbing, Electrical, Garage Doors, Restoration, Pest Control,
                Solar and Landscaping—where the same recovery engine can apply.
              </p>
            </article>
            <article>
              <Eyebrow>Long-term direction</Eyebrow>
              <h3>Vertical SaaS → Multi-Vertical Platform</h3>
              <p>
                Potential acquisitions and a future holding structure follow
                demonstrated operating strength. These are strategic
                possibilities, not announced products.
              </p>
            </article>
          </div>
        </div>
      </section>
      <section className="dark section">
        <div className="container split">
          <SectionHeading
            label="04 / Beyond the initial market"
            title="A method that can travel. A focus that stays narrow."
            description="Other long-term areas of interest are not current product offerings. Each must pass the same test: a specific workflow and a measurable result."
          />
          <div className="scope-list">
            {[
              "Legal workflows",
              "Accounting workflows",
              "Property technology",
              "Commerce infrastructure",
              "Financial decision systems",
            ].map((t) => (
              <div key={t}>
                {t}
                <span>↗</span>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="section container">
        <Rows items={principles} />
      </section>
      <End
        href="/ai"
        label="Explore the Current Focus"
        title="Start where the value is already visible."
      />
    </>
  );
}
