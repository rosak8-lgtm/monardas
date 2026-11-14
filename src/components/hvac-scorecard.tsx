"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Copy, Share2 } from "lucide-react";
import styles from "@/app/hvac/scorecard/scorecard.module.css";

type Answer = "yes" | "no" | "unknown";
type CheckKey = "followUp" | "owner" | "history" | "exclusions" | "outcomes";
type Check = { key: CheckKey; title: string; fix: string };
const checks: Check[] = [
  { key: "followUp", title: "Does each new replacement estimate get a timely first follow-up?", fix: "Set a specific follow-up window for every unsold estimate." },
  { key: "owner", title: "Does every open estimate have a named next-action owner?", fix: "Assign one person responsible for the next step." },
  { key: "history", title: "Can your team see the previous attempts, replies and due dates?", fix: "Log attempts, outcomes and due dates in your current system." },
  { key: "exclusions", title: "Are sold jobs, opt-outs and ineligible contacts excluded?", fix: "Review eligibility and suppressions before any outreach." },
  { key: "outcomes", title: "Are replies, appointments and confirmed jobs measured separately?", fix: "Track conversations, handoffs and verified sales as separate outcomes." },
];
const defaults: Record<CheckKey, Answer> = {
  followUp: "unknown", owner: "unknown", history: "unknown",
  exclusions: "unknown", outcomes: "unknown",
};
const publicUrl = "https://monardas.com/hvac/scorecard";
const referralUrl = publicUrl + "?utm_source=agency&utm_medium=referral";

export function HVACScorecard() {
  const [quantity, setQuantity] = useState("25");
  const [answers, setAnswers] = useState(defaults);
  const [status, setStatus] = useState("");
  const score = useMemo(() => checks.filter((c) => answers[c.key] === "yes").length, [answers]);
  const answered = checks.filter((c) => answers[c.key] !== "unknown").length;
  const confirmedGaps = checks.filter((c) => answers[c.key] === "no");
  const toVerify = checks.filter((c) => answers[c.key] === "unknown");
  const priority = [...confirmedGaps, ...toVerify];
  const count = Number(quantity);
  const valid = quantity !== "" && Number.isInteger(count) && count >= 0 && count <= 100000;
  const description = answered === 0
    ? "Complete the checks to see priorities"
    : score === 5
      ? "Controls reported in place"
      : confirmedGaps.length
        ? "Follow-up gaps to address"
        : "Some controls still unverified";
  const summary = [
    "MONARDAS HVAC Follow-Up Leak Check",
    "Self-reported confirmed controls: " + score + "/5 (" + answered + " answered, " + (5 - answered) + " not sure)",
    "Unsold estimates: " + (valid ? count : "not supplied"),
    ...checks.map((c) => answers[c.key].toUpperCase() + ": " + c.title),
    "Suggested first steps:",
    ...(priority.length ? priority.slice(0, 3).map((c) => "- " + (answers[c.key] === "unknown" ? "Verify: " : "Improve: ") + c.fix) : ["- Validate your answers against actual CRM records."]),
    "Not a verified audit, sales forecast or predicted recovered revenue.",
    publicUrl,
  ].join("\n");

  async function copy(value: string, success: string) {
    try {
      await navigator.clipboard.writeText(value);
      setStatus(success);
    } catch {
      setStatus("Clipboard unavailable. You can copy the page URL or results manually.");
    }
  }

  async function share(url = publicUrl) {
    try {
      if (navigator.share) {
        await navigator.share({ title: "HVAC Follow-Up Leak Check", url });
        return;
      }
    } catch {
      // The visitor can cancel sharing without sending anything.
    }
    await copy(url, "Tool link copied.");
  }

  return (
    <div className="product-page hvac-page">
      <section className={"container " + styles.hero}>
        <span className="eyebrow">MONARDAS / FREE HVAC RESOURCE</span>
        <h1>Where do your <em>unsold estimates</em> go?</h1>
        <p className={styles.intro}>
          A three-minute self-check for HVAC contractors. Find process gaps that
          can leave residential replacement quotes unattended. No account, CRM
          connection, homeowner list or personal contact details required.
        </p>
        <p className={styles.note}>Free · No upload · No sign-up · Your inputs stay in your browser</p>
      </section>
      <section className={"container " + styles.workspace}>
        <div className={styles.form}>
          <p className={styles.eyebrow}>01 / YOUR PIPELINE</p>
          <label className={styles.countLabel} htmlFor="scorecard-count">
            How many unsold replacement estimates are you reviewing?
          </label>
          <input
            id="scorecard-count" type="number" min="0" max="100000" step="1"
            value={quantity} onChange={(event) => setQuantity(event.target.value)}
            aria-invalid={!valid} className={styles.count}
          />
          <p className={styles.helper}>
            Use a consistent period (e.g. last 90 days). Do not enter homeowner data.
            {!valid && " Enter an integer from 0 to 100,000."}
          </p>
          <p className={styles.eyebrow}>02 / FIVE CHECKS</p>
          {checks.map((check, index) => (
            <fieldset key={check.key} className={styles.check}>
              <legend>{index + 1}. {check.title}</legend>
              <div className={styles.options}>
                {(["yes", "no", "unknown"] as const).map((value) => (
                  <label key={value} className={styles.option}>
                    <input
                      type="radio" name={check.key} value={value}
                      checked={answers[check.key] === value}
                      onChange={() => setAnswers((old) => ({ ...old, [check.key]: value }))}
                    />
                    {value === "yes" ? "Yes" : value === "no" ? "No" : "Not sure"}
                  </label>
                ))}
              </div>
            </fieldset>
          ))}
        </div>
        <aside className={styles.results} aria-labelledby="scorecard-heading">
          <p className={styles.eyebrow}>YOUR INSTANT RESULT</p>
          <div className={styles.score} aria-live="polite" aria-atomic="true">
            <strong>{answered === 0 ? "—" : score}<span>/5</span></strong>
            <div>
              <h2 id="scorecard-heading">{description}</h2>
              <p>{answered} of 5 checks answered · {5 - answered} not sure. This is not an estimate of revenue or conversion probability.</p>
            </div>
          </div>
          <div className={styles.countResult}>
            <span>Unsold estimates reviewed</span>
            <strong>{valid ? count.toLocaleString("en-US") : "—"}</strong>
          </div>
          <h3>Your first actions</h3>
          <ol className={styles.actions}>
            {(priority.length ? priority.slice(0, 3) : checks.slice(0, 1)).map((check, i) => (
              <li key={check.key}><b>{i + 1}</b>{priority.length ? (answers[check.key] === "unknown" ? "Verify: " : "Improve: ") + check.fix : "Verify the controls against real estimates before scaling outreach."}</li>
            ))}
          </ol>
          <p className={styles.disclaimer}>
            These answers are not independently verified and are not stored or submitted.
            This is not legal advice, a sales forecast or a promise of recovered jobs.
            Contact eligibility and exclusions must be reviewed before any outreach.
          </p>
          <div className={styles.actionsRow}>
            <button type="button" onClick={() => void copy(summary, "Summary copied.")}><Copy size={16} /> Copy results</button>
            <button type="button" data-growth-share="true" onClick={() => void share()}><Share2 size={16} /> Share tool</button>
          </div>
          <p role="status" className={styles.status}>{status}</p>
          <Link className={styles.cta} href="/contact?intent=hvac-pilot&utm_source=scorecard&utm_medium=free_tool">
            Discuss a Free Backlog Assessment <ArrowUpRight size={17} />
          </Link>
          <p className={styles.disclaimer}>The assessment is free. A separate limited founder program offers a 30-day founder-supported follow-up program for a limited batch; any homeowner outreach requires an additional agreement.</p>
          <Link className={styles.cta} href="/hvac/free-pilot?utm_source=scorecard&utm_medium=founding-cohort">Apply for the Free 30-Day HVAC Pilot <ArrowUpRight size={17} /></Link>
        </aside>
      </section>
      <section className={"container " + styles.partner}>
        <div>
          <span className="eyebrow">FOR HVAC MARKETING AGENCIES & CONSULTANTS</span>
          <h2>Share a useful tool, not another sales pitch.</h2>
          <p>Help contractors see what happens after a replacement quote is sent. Share the free checklist, then introduce MONARDAS only where a managed pilot fits.</p>
        </div>
        <div className={styles.partnerLinks}>
          <button type="button" data-growth-share="true" onClick={() => void share(referralUrl)}><Share2 size={17} /> Share with a contractor</button>
          <Link href="/contact?intent=agency-partner&utm_source=scorecard&utm_medium=partner">Discuss a partner introduction <ArrowUpRight size={17} /></Link>
        </div>
      </section>
      <section className={"container " + styles.bottom}>
        <Link href="/hvac">← MONARDAS HVAC Recovery</Link>
        <Link href="/hvac/demo">Try the fictional estimate demo →</Link>
      </section>
    </div>
  );
}
