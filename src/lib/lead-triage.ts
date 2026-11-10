import type { ContactData } from "./contact";

export type LeadTriage = {
  intent: "hvac-pilot" | "general";
  estimateBand: "unknown" | "under_25" | "25_to_50" | "over_50";
  missing: string[];
  action: "MANAGER_REVIEW_FREE_ASSESSMENT" | "MANAGER_REVIEW_GENERAL_INQUIRY";
  marketingConsent: "NOT_ESTABLISHED";
  duplicateCheck: "NOT_RUN";
  sendAuthorization: false;
};

/**
 * Deterministic inbound inquiry classification; it is NOT an outbound
 * qualification check and does not grant marketing consent.
 *
 * Only categorical metadata is returned. Never store this result as proof
 * of consent or as evidence that a contact passed suppression checks.
 */
export function classifyInboundLead(data: ContactData): LeadTriage {
  const pilot = data.intent === "hvac-pilot";
  const raw = pilot ? data.volume?.trim() ?? "" : "";
  const valid = /^\d{1,7}$/.test(raw) && Number(raw) <= 1000000;
  const amount = valid ? Number(raw) : null;
  const missing: string[] = [];

  if (pilot) {
    if (!data.companyWebsite?.trim()) missing.push("Company website");
    if (!data.crm?.trim()) missing.push("CRM / export format");
    if (amount === null) missing.push("Unsold estimate count");
    if (data.industry !== "HVAC") missing.push("HVAC business verification");
  }

  return {
    intent: pilot ? "hvac-pilot" : "general",
    estimateBand: amount === null ? "unknown" : amount < 25 ? "under_25" : amount <= 50 ? "25_to_50" : "over_50",
    missing,
    action: pilot ? "MANAGER_REVIEW_FREE_ASSESSMENT" : "MANAGER_REVIEW_GENERAL_INQUIRY",
    marketingConsent: "NOT_ESTABLISHED",
    duplicateCheck: "NOT_RUN",
    sendAuthorization: false,
  };
}
