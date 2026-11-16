import Link from "next/link";
import { ArrowUpRight, Plus } from "lucide-react";
import { productGroups } from "@/lib/navigation";
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
export function Footer({ product = false }: { product?: boolean }) {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top">
          <div>
            <Logo />
            <p>
              {product
                ? "Founder-supported follow-up for unsold residential HVAC replacement estimates. Clear approvals, real reporting and no guaranteed sales."
                : "We build systems and businesses designed to compound value through technology, distribution and ownership."}
            </p>
          </div>
          {Object.entries(product ? productGroups : groups).map(
            ([name, links]) => (
              <div className="footer-column" key={name}>
                <h2>{name}</h2>
                {links.map(([label, url]) => (
                  <Link key={url} href={url}>
                    {label}
                  </Link>
                ))}
              </div>
            ),
          )}
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} MONARDAS</span>
          <span>Focused HVAC estimate recovery · Independent MONARDAS company</span>
          <div>
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
            <Link href="/refund-policy">Refunds & cancellation</Link>
          </div>
        </div>
        <p className="footer-identity">
          MONARDAS is operated by Iurii Shalygin in Georgia. Business inquiries:{" "}
          <a href="mailto:yurii@monardas.com">yurii@monardas.com</a>
        </p>
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
          <Button href="/hvac/free-pilot">Apply for the Free 30-Day Founding Pilot</Button>
          <p>Limited to two selected U.S. HVAC businesses. Any paid work is separate.</p>
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
    "Yes. The limited free founding pilot covers up to 25 suitable replacement estimates. Larger 25–50-estimate paid programs are separately negotiated.",
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
    "Your approved team sends eligible follow-ups using messaging and exclusions agreed in advance.",
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
  const offers = [
    {
      title: "30-day free founding pilot",
      description: "Up to two selected U.S. residential HVAC businesses. Up to 25 eligible unsold replacement estimates, up to two agreed actions each and weekly founder support. $0, no card or automatic renewal.",
      href: "/hvac/free-pilot",
      cta: "Apply for 30 Days Free",
    },
    {
      title: "Free 3-minute follow-up check",
      description: "Review gaps in your existing estimate process, inside your browser. No signup, CRM migration or homeowner data upload required.",
      href: "/hvac/scorecard",
      cta: "Take the Free Scorecard",
    },
    {
      title: "Optional paid managed service",
      description: "A separately agreed, founder-led engagement may cover a larger 25–50-estimate batch. Scope, eligibility, responsibilities and pricing are negotiated in writing before any work.",
      href: "/contact?intent=hvac-pilot",
      cta: "Discuss Separate Paid Work",
    },
  ];
  return (
    <div className="three-column">
      {offers.map((offer) => (
        <article key={offer.title}>
          <Eyebrow>Clear scope before any engagement</Eyebrow>
          <h3>{offer.title}</h3>
          <p>{offer.description}</p>
          <Button href={offer.href} secondary>{offer.cta}</Button>
        </article>
      ))}
    </div>
  );
}
