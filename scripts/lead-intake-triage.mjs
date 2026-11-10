/**
 * MONARDAS lead triage: pure, offline, privacy-minimizing preview.
 * Never grants consent, triggers a send, creates billing, or changes CRM.
 * Deliberately does not read credentials or contact identifiers.
 */
export function triageLead(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    throw new TypeError('Expected a validated lead object');
  }
  const intent = input.intent === 'hvac-pilot' ? 'hvac-pilot' : 'general';
  const industry = input.industry === 'HVAC' ? 'HVAC' : 'unverified';
  const rawVolume = typeof input.volume === 'string' ? input.volume.trim() : '';
  const hasValidVolume = /^\d{1,7}$/.test(rawVolume) && Number(rawVolume) <= 1000000;
  const volume = hasValidVolume ? Number(rawVolume) : null;
  const crmProvided = typeof input.crm === 'string' && input.crm.trim().length > 0;
  const websiteProvided = typeof input.companyWebsite === 'string' && input.companyWebsite.trim().length > 0;
  const notesProvided = typeof input.message === 'string' && input.message.trim().length > 0;
  // Replying to an inbound inquiry does not grant outbound marketing consent.
  const nextAction = intent === 'hvac-pilot'
    ? 'MANAGER_REVIEW_FREE_ASSESSMENT'
    : 'MANAGER_REVIEW_GENERAL_INQUIRY';
  const missing = [
    ...(!crmProvided ? ['CRM_OR_EXPORT_FORMAT'] : []),
    ...(!websiteProvided ? ['COMPANY_WEBSITE'] : []),
    ...(volume === null ? ['UNSOLD_ESTIMATE_COUNT'] : []),
    ...(industry !== 'HVAC' ? ['HVAC_INDUSTRY_VERIFICATION'] : []),
  ];
  return Object.freeze({
    schema_version: 1,
    intent,
    industry,
    volume_band: volume === null ? 'unknown' : volume < 25 ? 'under_25' : volume <= 50 ? '25_to_50' : 'over_50',
    crm_provided: crmProvided,
    website_provided: websiteProvided,
    notes_provided: notesProvided,
    missing_for_assessment: missing,
    next_action: nextAction,
    human_review_required: true,
    duplicate_status: 'UNKNOWN',
    marketing_consent: 'NOT_ESTABLISHED',
    outbound_send_authorized: false,
    payment_requested: false,
    offer_status: 'NOT_PROPOSED',
  });
}
