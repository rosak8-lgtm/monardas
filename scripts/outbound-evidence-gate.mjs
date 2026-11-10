/**
 * MONARDAS sales / outbound evidence gate.
 *
 * Pure review-only logic. Never connects to mail provider, sends email,
 * changes a timer, or grants sender authorization.
 *
 * Evidence is deliberately three-valued (PASS/HOLD/UNKNOWN); missing evidence
 * is not clearance. Trusted upstream integrations must separately attest
 * checks; never accept caller-supplied flags as a production release decision.
 */
export const REQUIRED_EVIDENCE = Object.freeze([
  "providerPermission",
  "senderHealth",
  "identityVerified",
  "businessRelevance",
  "mailboxVerified",
  "suppressionClear",
  "optOutClear",
  "dedupeClear",
  "pendingDeliveryClear",
  "offerReviewed",
]);

const PRIORITY = Object.freeze([
  "PROVIDER_PERMISSION_NOT_CONFIRMED",
  "GLOBAL_SENDER_HOLD",
  "SUPPRESSION_NOT_CONFIRMED",
  "OPT_OUT_NOT_CONFIRMED",
  "PREVIOUS_ACTIVITY_NOT_CLEARED",
  "PENDING_DELIVERY_UNRESOLVED",
  "MAILBOX_NOT_VERIFIED",
  "BUSINESS_IDENTITY_NOT_VERIFIED",
  "HVAC_RELEVANCE_NOT_CONFIRMED",
  "OFFER_NOT_REVIEWED",
]);

const FAILURE_CODE = Object.freeze({
  providerPermission: "PROVIDER_PERMISSION_NOT_CONFIRMED",
  senderHealth: "GLOBAL_SENDER_HOLD",
  identityVerified: "BUSINESS_IDENTITY_NOT_VERIFIED",
  businessRelevance: "HVAC_RELEVANCE_NOT_CONFIRMED",
  mailboxVerified: "MAILBOX_NOT_VERIFIED",
  suppressionClear: "SUPPRESSION_NOT_CONFIRMED",
  optOutClear: "OPT_OUT_NOT_CONFIRMED",
  dedupeClear: "PREVIOUS_ACTIVITY_NOT_CLEARED",
  pendingDeliveryClear: "PENDING_DELIVERY_UNRESOLVED",
  offerReviewed: "OFFER_NOT_REVIEWED",
});

/**
 * Returns only non-sensitive codes. Does not accept or expose email addresses.
 * PASS requires evidence freshness and trustworthy source, handled elsewhere.
 */
export function evaluateOutboundEvidence(evidence = {}) {
  if (evidence === null || typeof evidence !== "object" || Array.isArray(evidence)) {
    throw new TypeError("evidence must be a plain object");
  }

  const blockers = [];
  for (const name of REQUIRED_EVIDENCE) {
    if (evidence[name] !== "PASS") {
      blockers.push(FAILURE_CODE[name]);
    }
  }
  blockers.sort((a, b) => PRIORITY.indexOf(a) - PRIORITY.indexOf(b));

  return Object.freeze({
    decision: "MANUAL_REVIEW_ONLY",
    canSend: false,
    passedRequirements: REQUIRED_EVIDENCE.length - blockers.length,
    requiredRequirements: REQUIRED_EVIDENCE.length,
    blockers: Object.freeze(blockers),
    status: blockers.length ? "HOLD_NO_SEND" : "EVIDENCE_COMPLETE_REVIEW_REQUIRED",
    note: "No message may be sent until an independent, authenticated live release authorizes the specific recipient and provider.",
  });
}
