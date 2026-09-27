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
        ...(["privacy", "terms"].includes(page)
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
            Every pipeline is different. Agree on scope and pricing before
            launch, based on data readiness, estimate volume and the handoff
            your team needs.
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
          <Button>Recover Lost Revenue</Button>
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
  if (page === "privacy" || page === "terms") return <LegalPage page={page} />;
  return <CompanyPage page={page} />;
}
