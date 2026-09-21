import Link from "next/link";
import { ArrowUpRight, Plus } from "lucide-react";
export function Logo() {
  return (
    <Link href="/" className="logo" aria-label="MONARDAS home">
      MONARDAS
    </Link>
  );
}
export function Button({
  children,
  href = "/contact",
  secondary = false,
}: {
  children: React.ReactNode;
  href?: string;
  secondary?: boolean;
}) {
  return (
    <Link
      className={`button ${secondary ? "button-outline" : "button-dark"}`}
      href={href}
    >
      {children}
      <ArrowUpRight size={17} />
    </Link>
  );
}
export function Eyebrow({ children }: { children: React.ReactNode }) {
  return <div className="eyebrow">{children}</div>;
}
export function SectionHeading({
  label,
  title,
  description,
}: {
  label: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="section-heading">
      <Eyebrow>{label}</Eyebrow>
      <h2>{title}</h2>
      {description && <p>{description}</p>}
    </div>
  );
}
export const groups = {
  Build: [
    ["AI", "/ai"],
    ["Systems", "/systems"],
    ["Commerce", "/commerce"],
  ],
  Own: [
    ["Ventures", "/ventures"],
    ["Capital", "/capital"],
    ["Nature", "/nature"],
  ],
  Company: [
    ["Strategy", "/strategy"],
    ["Founder", "/founder"],
    ["Contact", "/contact"],
  ],
};
export function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top">
          <div>
            <Logo />
            <p>
              We build systems and businesses designed to compound value through
              technology, distribution and ownership.
            </p>
          </div>
          {Object.entries(groups).map(([name, links]) => (
            <div className="footer-column" key={name}>
              <h2>{name}</h2>
              {links.map(([label, url]) => (
                <Link key={url} href={url}>
                  {label}
                </Link>
              ))}
            </div>
          ))}
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} MONARDAS</span>
          <span>Intelligence. Systems. Ownership.</span>
          <div>
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
export function Flow({ items }: { items: string[] }) {
  return (
    <ol className="flow">
      {items.map((item, i) => (
        <li key={item}>
          <span>{String(i + 1).padStart(2, "0")}</span>
          <strong>{item}</strong>
          <span aria-hidden="true">↗</span>
        </li>
      ))}
    </ol>
  );
}
export function Philosophy() {
  return (
    <section className="dark section">
      <div className="container">
        <Eyebrow>The operating discipline</Eyebrow>
        <h2 className="statement">
          Do the work.
          <br />
          Build the standard.
          <br />
          <em>Remove yourself.</em>
        </h2>
        <div className="philosophy-grid">
          {[
            ["10", "First ten times", "Do it yourself."],
            ["100", "Next hundred times", "Let the process do it."],
            ["10,000", "Next ten thousand times", "Let technology do it."],
          ].map(([n, l, t]) => (
            <div key={n}>
              <span className="eyebrow">{l}</span>
              <strong>{n}</strong>
              <p>{t}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
export function FinalCTA() {
  return (
    <section className="final-cta">
      <div className="container split">
        <h2>
          Before buying more leads,
          <br />
          <em>
            revisit the opportunities
            <br />
            you already have.
          </em>
        </h2>
        <div>
          <Button>Request a Revenue Recovery Audit</Button>
          <p>A focused conversation. A practical next step.</p>
        </div>
      </div>
    </section>
  );
}
const faqs = [
  [
    "Do I need to replace my CRM?",
    "No. We review how your opportunities are stored and agree on an export or connection. Native integrations are confirmed during scoping; no specific connection is assumed.",
  ],
  [
    "What happens when someone replies?",
    "Interested homeowners and callback requests return to your sales team with the original estimate, response and suggested next step.",
  ],
  [
    "Does AI sell the job?",
    "No. Automation re-engages and identifies intent. Your salesperson answers questions, advises the homeowner and closes the job.",
  ],
  [
    "Can we start with a small batch?",
    "Yes. Start with 25–50 old estimates, review the responses and decide whether a repeatable recovery workflow makes sense.",
  ],
  [
    "How is success measured?",
    "Track follow-ups, replies, qualified handoffs and confirmed sales separately. Reopened conversations are not booked revenue.",
  ],
  [
    "Who controls the follow-up?",
    "Your team approves messaging, eligible contacts, exclusions and handoff before a pilot. Requests to stop are excluded from further follow-up.",
  ],
];
export function FAQ() {
  return (
    <section className="section container split">
      <SectionHeading
        label="Questions, answered"
        title="A clear starting point."
      />
      <div className="faq-list">
        {faqs.map(([q, a]) => (
          <details key={q}>
            <summary>
              {q}
              <Plus size={18} />
            </summary>
            <p>{a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
export const steps = [
  [
    "Connect or export",
    "Review existing opportunities, data quality, contact permissions and exclusions.",
  ],
  [
    "Segment",
    "Group estimates by service, age and the context behind the decision.",
  ],
  [
    "Re-engage",
    "Send personalized follow-up with messaging approved by your team.",
  ],
  [
    "Understand intent",
    "Classify the reply and surface buying intent, questions or a request to stop.",
  ],
  [
    "Hand off",
    "Route interested homeowners to a salesperson with the conversation attached.",
  ],
];
export function Steps() {
  return (
    <div className="steps">
      {steps.map(([t, d], i) => (
        <article key={t}>
          <span>0{i + 1}</span>
          <div>
            <h3>{t}</h3>
            <p>{d}</p>
          </div>
          <span aria-hidden="true">↗</span>
        </article>
      ))}
    </div>
  );
}
export function PricingCards() {
  return (
    <div className="three-column">
      {[
        ["Pilot", "Validate the opportunity with 25–50 old estimates."],
        ["Core", "Standardize an ongoing estimate recovery process."],
        [
          "Growth",
          "Explore additional workflows after the economics are proven.",
        ],
      ].map(([t, d]) => (
        <article key={t}>
          <Eyebrow>Scope agreed before launch</Eyebrow>
          <h3>{t}</h3>
          <p>{d}</p>
          <p>
            Pricing depends on volume, data readiness and implementation scope.
          </p>
          <Button secondary>Discuss {t}</Button>
        </article>
      ))}
    </div>
  );
}
