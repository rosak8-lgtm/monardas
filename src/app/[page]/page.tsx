import { LegalPage } from "@/components/legal-page";
import { notFound } from "next/navigation";
import { CompanyPage } from "@/components/company-page";
import {
  Button,
  Eyebrow,
  FAQ,
  FinalCTA,
  PricingCards,
  SectionHeading,
  Steps,
} from "@/components/site";
import { pages } from "@/lib/pages";
import { pageMetadata } from "@/lib/seo";
export function generateStaticParams() {
  return Object.keys(pages).map((page) => ({ page }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ page: string }>;
}) {
  const { page } = await params;
  const data = pages[page];
  return data
    ? {
        ...pageMetadata(data.title, data.description, `/${page}`),
        ...(["privacy", "terms", "refund-policy"].includes(page)
          ? { robots: { index: false, follow: true } }
          : {}),
      }
    : {};
}
export default async function Page({
  params,
}: {
  params: Promise<{ page: string }>;
}) {
  const { page } = await params;
  if (!pages[page]) notFound();
  if (page === "pricing")
    return (
      <>
        <section className="page-hero container">
          <Eyebrow>MONARDAS AI / Scope & pricing</Eyebrow>
          <h1>
            Start with the opportunity.
            <br />
            <em>Grow with the evidence.</em>
          </h1>
          <p>
            Start with a limited founder-supported 30-day free pilot for up to
            25 eligible unsold HVAC replacement estimates. Any later paid work
            is separately scoped and agreed in writing.
          </p>
        </section>
        <section className="section container">
          <PricingCards />
        </section>
        <FAQ />
        <FinalCTA />
      </>
    );
  if (page === "how-it-works")
    return (
      <>
        <section className="page-hero container">
          <Eyebrow>MONARDAS AI / The recovery process</Eyebrow>
          <h1>
            Reconnect. Understand.
            <br />
            <em>Hand off. Recover.</em>
          </h1>
          <p>
            A practical process built around the people who close the job. Your
            team controls the messaging, the handoff and the sale.
          </p>
          <Button href="/hvac/free-pilot">Apply for the 30-Day Free Pilot</Button>
        </section>
        <section className="section stone">
          <div className="container split">
            <SectionHeading
              label="The workflow"
              title="Get the conversation moving again."
            />
            <Steps />
          </div>
        </section>
        <FAQ />
        <FinalCTA />
      </>
    );
  if (page === "privacy" || page === "terms" || page === "refund-policy") return <LegalPage page={page} />;
  return <CompanyPage page={page} />;
}
