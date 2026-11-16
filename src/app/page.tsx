import Link from "next/link";
import {
  ArrowRight, ArrowUpRight, CheckCircle2, ClipboardCheck,
  FileCheck2, Gauge, LockKeyhole, MessageCircleMore,
  PlayCircle, ShieldCheck, Sparkles
} from "lucide-react";
import { pageMetadata } from "@/lib/seo";
import styles from "./home-conversion.module.css";

export const metadata = pageMetadata(
  "HVAC Estimate Follow-Up & Revenue Recovery",
  "MONARDAS helps U.S. residential HVAC contractors organize follow-up on unsold replacement estimates. Apply for a limited founder-supported 30-day free pilot or explore a fictional interactive demo.",
  "/",
);

const exampleRows = [
  { job: "Heat pump replacement", status: "Review next step", tone: "amber", note: "Quote sent · no decision" },
  { job: "Furnace replacement", status: "Draft for approval", tone: "blue", note: "Eligible record · team-owned" },
  { job: "AC replacement", status: "Weekly review", tone: "green", note: "Outcome to be verified" },
] as const;

const stages = [
  { number:"01", icon:ClipboardCheck, title:"Select the right estimates", text:"Choose up to 25 suitable, still-unsold residential replacement quotes. Check status, exclusions and eligibility before any follow-up.", detail:"No homeowner personal details are needed in the initial website application." },
  { number:"02", icon:MessageCircleMore, title:"Approve each next action", text:"We prepare a clear next-action list and message drafts. Your approved team stays in control of any homeowner communication.", detail:"At most two agreed follow-up actions per eligible estimate." },
  { number:"03", icon:Gauge, title:"Review real outcomes", text:"See completed actions, replies, appointments and contractor-confirmed sales separately, with weekly progress reviews.", detail:"No guaranteed sales and no invented recovered-revenue figures." },
] as const;

const questions = [
  ["Is this another CRM I have to buy?", "No. The founding pilot is a founder-supported service for a small, agreed estimate batch. There is no mandatory migration or promised native CRM integration."],
  ["Does MONARDAS contact homeowners automatically?", "No. Your approved team controls homeowner communication. Independent outreach by MONARDAS requires separate written authorization, channel eligibility and suppression review."],
  ["What happens after 30 days?", "The limited pilot ends. There is no credit-card requirement, automatic renewal or obligation to buy. Any paid work requires a separate agreement."],
  ["Can I try the product without sharing customer records?", "Yes. The interactive demo uses fictional estimates, and the free follow-up scorecard is completed in your browser. Neither requires homeowner data."],
] as const;

function ActionLink({ href, children, quiet = false }: { href:string; children:React.ReactNode; quiet?:boolean }) {
  return (
    <Link className={quiet ? styles.ghostCta : styles.mainCta} href={href}>
      {children}<ArrowUpRight size={18} aria-hidden="true" />
    </Link>
  );
}

export default function Home() {
  return (
    <div className={styles.home}>
      <section className={`corporate-hero ${styles.hero}`} aria-labelledby="home-title">
        <div className={`container ${styles.heroGrid}`}>
          <div className={styles.heroCopy}>
            <div className={styles.eyebrow}><span className={styles.dot} aria-hidden="true" /> Built for residential HVAC owners in the USA</div>
            <h1 id="home-title">The estimate went out. <span>Don't let the opportunity disappear.</span></h1>
            <p className={styles.heroLead}>MONARDAS helps your team follow up on unsold HVAC replacement quotes with a clear plan, approved next steps and honest reporting. No new leads required.</p>
            <div className={styles.heroActions}>
              <ActionLink href="/hvac/free-pilot">Apply for 30 days free</ActionLink>
              <ActionLink href="/hvac/demo" quiet>Explore the interactive demo</ActionLink>
            </div>
            <div className={styles.offerLine}>
              <span><CheckCircle2 size={16} aria-hidden="true" /> Up to 25 eligible estimates</span>
              <span><ShieldCheck size={16} aria-hidden="true" /> Your team controls outreach</span>
              <span><LockKeyhole size={16} aria-hidden="true" /> No card or auto-renewal</span>
            </div>
            <Link className={styles.textLink} href="/hvac">Explore HVAC Revenue Recovery <ArrowRight size={16} aria-hidden="true" /></Link>
          </div>
          <div className={styles.productVisual} aria-label="Fictional example of MONARDAS estimate follow-up tracking">
            <div className={styles.mockTop}><span className={styles.mockBrand}><span className={styles.mockMark} aria-hidden="true" /> MONARDAS</span><span className={styles.mockDemo}>ILLUSTRATIVE WORKFLOW</span></div>
            <div className={styles.mockBody}>
              <div className={styles.mockHeader}><span>Estimate follow-up</span><span className={styles.mockPill}>Example only</span></div>
              <div className={styles.mockIntro}>From open quotes to clear next steps</div>
              <div className={styles.mockSteps} aria-label="Three parts of the review workflow">
                <div><FileCheck2 size={20} aria-hidden="true"/><strong>Review</strong><small>Identify fit</small></div>
                <div><ClipboardCheck size={20} aria-hidden="true"/><strong>Approve</strong><small>Next action</small></div>
                <div><Gauge size={20} aria-hidden="true"/><strong>Report</strong><small>Track outcomes</small></div>
              </div>
              <div className={styles.sampleTitle}><span>Sample estimate list</span><span>Fictional records</span></div>
              <div className={styles.mockRows}>
                {exampleRows.map((row) => (
                  <div className={styles.mockRow} key={row.job}>
                    <span className={styles.mockFile}><FileCheck2 size={17} aria-hidden="true"/></span>
                    <span className={styles.mockJob}><strong>{row.job}</strong><small>{row.note}</small></span>
                    <span className={`${styles.mockStatus} ${row.tone==="amber"?styles.statusAmber:row.tone==="blue"?styles.statusBlue:styles.statusGreen}`}>{row.status}</span>
                  </div>
                ))}
              </div>
              <Link className={styles.mockExplore} href="/hvac/demo">Open the working demo <ArrowUpRight size={17} aria-hidden="true"/></Link>
            </div>
            <p className={styles.mockCaption}>A conceptual preview, not a client account, live automation or proof of recovered sales.</p>
          </div>
        </div>
        <div className={`container ${styles.heroFoot}`}>
          <span>30 DAYS · FOUNDING PILOT · $0</span>
          <span>For up to two selected U.S. businesses, subject to fit and capacity</span>
        </div>
      </section>

      <section className={`container ${styles.trust}`} aria-label="What you can verify today">
        <div><Sparkles size={22} aria-hidden="true"/><strong>A real process, not a promise</strong><span>A defined service scope and founder support</span></div>
        <div><PlayCircle size={22} aria-hidden="true"/><strong>Try before you talk</strong><span>A fictional-data demo with no account</span></div>
        <div><ShieldCheck size={22} aria-hidden="true"/><strong>Contractor stays in charge</strong><span>Approved contact and clear exclusions</span></div>
      </section>

      <section className={`container ${styles.section}`} id="how-it-works">
        <div className={styles.sectionLead}>
          <span className={styles.sectionKicker}>THE PROBLEM AND THE PLAN</span>
          <h2>You've done the hard part. <em>Finish the conversation.</em></h2>
          <p>Your estimator visited, scoped the job and sent a replacement quote. If no one owns the next step, a real opportunity can sit untouched. MONARDAS makes that work visible — without taking over your sales process.</p>
        </div>
        <div className={styles.stageGrid}>
          {stages.map((stage) => (
            <article className={styles.stage} key={stage.number}>
              <div className={styles.stageTop}><span>{stage.number}</span><stage.icon size={29} strokeWidth={1.6} aria-hidden="true"/></div>
              <h3>{stage.title}</h3><p>{stage.text}</p>
              <div className={styles.stageDetail}><CheckCircle2 size={17} aria-hidden="true"/>{stage.detail}</div>
            </article>
          ))}
        </div>
        <div className={styles.sectionActions}><ActionLink href="/hvac/free-pilot">Apply for the free pilot</ActionLink><Link className={styles.inlineLink} href="/hvac#system">Read the complete workflow <ArrowRight size={17} aria-hidden="true"/></Link></div>
      </section>

      <section className={styles.proofSection} aria-labelledby="proof-title">
        <div className={`container ${styles.proofGrid}`}>
          <div>
            <span className={styles.sectionKicker}>SEE IT BEFORE YOU COMMIT</span>
            <h2 id="proof-title">Explore what's real. <em>No invented success stories.</em></h2>
            <p>We are inviting our first founding participants. Until a contractor verifies actual results, we show the workflow, sample dashboard and exact program boundaries — not fabricated testimonials or recovered revenue.</p>
          </div>
          <div className={styles.proofCards}>
            <Link href="/hvac/demo" className={styles.proofCard}><PlayCircle size={29} aria-hidden="true"/><strong>Interactive product demo</strong><span>Explore fictional estimates, pipeline actions and reports.</span><ArrowUpRight size={19} aria-hidden="true"/></Link>
            <Link href="/hvac/scorecard" className={styles.proofCard}><Gauge size={29} aria-hidden="true"/><strong>3-minute follow-up scorecard</strong><span>Check your process without uploading homeowner details.</span><ArrowUpRight size={19} aria-hidden="true"/></Link>
            <Link href="/hvac/free-pilot#pilot-faq" className={styles.proofCard}><FileCheck2 size={29} aria-hidden="true"/><strong>Exact 30-day scope</strong><span>See limits, privacy rules and what happens after the trial.</span><ArrowUpRight size={19} aria-hidden="true"/></Link>
          </div>
        </div>
      </section>

      <section className={`container ${styles.section} ${styles.audienceSection}`}>
        <div className={styles.sectionLead}><span className={styles.sectionKicker}>CHOOSE YOUR ROLE</span><h2>One offer. Two ways to start.</h2></div>
        <div className={styles.audienceGrid}>
          <article className={styles.audiencePrimary}><span className={styles.audienceTag}>HVAC OWNER / GENERAL MANAGER</span><h3>Have open replacement quotes?</h3><p>Apply for a founder-supported 30-day pilot covering one agreed batch of up to 25 eligible estimates, with no payment details and no automatic continuation.</p><ActionLink href="/hvac/free-pilot">Request a founding pilot</ActionLink></article>
          <article className={styles.audienceSecondary}><span className={styles.audienceTag}>AGENCY / CONSULTANT</span><h3>Work with HVAC contractors?</h3><p>Introduce a suitable business or explore a voluntary co-service conversation. No referral fee, partner certification or integration is implied.</p><ActionLink href="/contact?intent=agency-partner" quiet>Discuss a partnership</ActionLink></article>
        </div>
      </section>

      <section className={`container ${styles.section} ${styles.faqSection}`} aria-labelledby="homepage-faq">
        <div><span className={styles.sectionKicker}>THE IMPORTANT DETAILS</span><h2 id="homepage-faq">No surprises before you apply.</h2><Link className={styles.inlineLink} href="/hvac/free-pilot#pilot-faq">All pilot terms <ArrowRight size={16} aria-hidden="true"/></Link></div>
        <div className={styles.faqItems}>{questions.map(([question,answer])=><details key={question}><summary>{question}<span aria-hidden="true">+</span></summary><p>{answer}</p></details>)}</div>
      </section>

      <section className={styles.lastSection} aria-labelledby="last-cta">
        <div className={`container ${styles.lastInner}`}>
          <div><span className={styles.sectionKicker}>NEXT STEP</span><h2 id="last-cta">Give your unsold estimates a clear next step.</h2><p>Start with a free, limited pilot. No homeowner data required to apply. Selection and scope are agreed before work begins.</p></div>
          <div className={styles.lastActions}><ActionLink href="/hvac/free-pilot">Apply for 30 days free</ActionLink><Link href="/hvac/scorecard" className={styles.lastAlt}>Not ready? Take the free follow-up check <ArrowUpRight size={16} aria-hidden="true"/></Link></div>
        </div>
      </section>

      <section className={`container ${styles.corporateNote}`} aria-label="About the MONARDAS group">
        <div><strong>MONARDAS</strong><p>Starting with a focused HVAC revenue-recovery service, built with a long-term systems mindset. Our corporate strategy and other developing business areas remain separate from this offer.</p></div>
        <Link href="/strategy">About the company <ArrowRight size={17} aria-hidden="true"/></Link>
      </section>
    </div>
  );
}
