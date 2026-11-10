import type { ContactData } from "./contact";
import { classifyInboundLead } from "./lead-triage";

export type PilotReplyDraft = Readonly<{
  subject: string;
  body: string;
  commercialStage: "FREE_ASSESSMENT" | "SCOPING_REQUIRED";
  priceStatus: "NOT_QUOTED";
  requiresManagerApproval: true;
  sendAuthorized: false;
}>;

/** Draft-only inbound response. Never creates an email, invoice, or CRM record.
 * Inputs must already have passed the server's ContactData validation.
 * Freeform customer notes are intentionally NOT inserted into the draft.
 */
export function preparePilotReplyDraft(data: ContactData): PilotReplyDraft {
  if (data.intent !== "hvac-pilot") {
    throw new Error("Pilot reply requires a validated inbound pilot request");
  }
  const triage = classifyInboundLead(data);
  // Names are displayed only in editable BODY text, never email headers.
  // Strip control characters to prevent untrusted multiline insertions.
  const name = (data.firstName || "").replace(/[\r\n\x00-\x1f\x7f]/g, " ").trim().slice(0, 100);
  const salutation = name ? `Hi ${name},` : "Hello,";
  const needs = triage.missing.filter(item => item !== "HVAC business verification");
  const questions = [
    "Approximately how many unsold replacement estimates would you like us to review (typically 25–50 for a pilot)?",
    "Which CRM or field-service platform currently stores those estimates?",
    "Is there a sales manager who would approve any homeowner follow-up before outreach?",
  ];
  const body = [
    salutation,
    "",
    "Thanks for requesting a free MONARDAS HVAC Estimate Recovery Assessment.",
    "We can review your existing unsold replacement estimate workflow and discuss whether a small, founder-led pilot is a fit.",
    "",
    ...(needs.length ? ["For the initial review, a few details are still useful:", ...questions.map(q => "- " + q), ""] : []),
    "The initial assessment is free and does not commit you to a paid pilot.",
    "If there is a fit, we will first agree on the pilot scope, price, permissions and any customer-contact requirements. No homeowner outreach will be initiated without your approval.",
    "",
    "Best regards,",
    "MONARDAS",
  ].join("\n");
  return Object.freeze({
    subject: "Re: Your MONARDAS HVAC assessment request",
    body,
    commercialStage: needs.length ? "SCOPING_REQUIRED" : "FREE_ASSESSMENT",
    priceStatus: "NOT_QUOTED",
    requiresManagerApproval: true,
    sendAuthorized: false,
  });
}
