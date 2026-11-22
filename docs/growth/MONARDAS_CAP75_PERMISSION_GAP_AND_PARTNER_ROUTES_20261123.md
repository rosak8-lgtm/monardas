# MONARDAS — CAP75 eligibility and partnership research
**Snapshot:** 2026-11-23 (Asia/Tbilisi). **Status:** REVIEW ONLY, no recipient list import and no sender change.

## Owner-proven operational state
- Owner Lenovo run 2026-11-22 18:01:30 UTC: pinned CAP75 sender `e8e83dd82b65e3ed7951e46ac7726141b713852fe0f2471ab937414c391efde3`; HTML `bdacfb75709a244f7c855672334c87befece23a64c36072f6126190cf507ac7c`.
- Mon 2026-11-23 17:05 UTC sender user timer ACTIVE; postrun observer Mon 18:15 UTC ACTIVE. *No new delivery result is proven in the preview.*
- 33 jobs in existing production queue: 30 Monday READY in a read-only preview, three already SMTP accepted (Callbook, ServiceMerge, Notifi) and NO-RETRY. Existing 19 historic Oracle ledger entries. Sender MAX_DAILY_NEW=75, but this is a limit, **not** 75 recipients.
- Owner ran `MONARDAS_CAP75_ELIGIBILITY_GATE_V1_20261122` locally: ZIP and 6 file hashes PASS; 12 tests PASS; `HOLD_NOT_75_ELIGIBLE`, `new_evidence_approved_by_fields=0`, `remaining_slots_without_complete_evidence=45`. 30 baseline entries have 30 distinct emails and 30 distinct domains.
- On 2026-11-22 scoped Cloudflare API safely created `send.monardas.com` SPF TXT `v=spf1 include:rp.oracleemaildelivery.com ~all`; read-only check *from Oracle* returned `SPF_RECORD_PUBLISHED`, CTA HTTP200, DKIM CNAME matched historical expected target, sender/template SHA PASS. This is **not** fresh recipient inbox proof.

## Oracle provider boundary
Oracle's published FAQ disallows bulk unsolicited messages to recipients with no prior business/personal relationship: https://www.oracle.com/application-development/email-delivery/faq/
Oracle bulk list best practices require genuine opt-in: https://docs.oracle.com/en-us/iaas/Content/Email/Reference/deliverabilitybestpractices_topic-bestpractices.htm

**DO NOT** promote old 45 PG `approved=no` records, the 22 workbook prospects, scraped/public addresses or this research list into `approved_jobs.jsonl`. First-party partner-application pages are alternative official *application channels*, not evidence of opt-in to 75 outbound emails. Likewise do not repurpose the three already attempted companies, change source/date/suppression/history flags, bypass local recipient hours, or trigger manual `send`.

## New official application channels to assess (NOT EMAIL RECIPIENTS)
The following direct, first-party partner pages were publicly verified on 2026-11-23. Applications may require qualification, provider review and separate action by the MONARDAS owner. No message, form, or email has been sent.

| Company | Official program / application | Potential fit | Status |
|---|---|---|---|
| ClearView FSM | https://clearviewfsm.com/partner-apply/ | Explicit service/technology/supplier partner application for field-service vendors | RESEARCH_NOT_SUBMITTED |
| Simpro | https://www.simprogroup.com/partners | Field-service technology/consulting/referral partner network | RESEARCH_NOT_SUBMITTED |
| Workiz | https://www.workiz.com/partners/ | Field-service marketplace partnership applications | RESEARCH_NOT_SUBMITTED |
| Sunwell CRM | https://www.sunwellcrm.com/partners/ | Referral/supplier/consultant partner application serving HVAC and trades | RESEARCH_NOT_SUBMITTED |
| ServiceTrade | https://servicetrade.com/company/partners/ | Form to propose commercial field-service partnership | RESEARCH_NOT_SUBMITTED |
| ServiceTitan | https://www.servicetitan.com/partners | Partner marketplace application; eligibility/fee review required | RESEARCH_NOT_SUBMITTED |
| Housecall Pro | https://www.housecallpro.com/partner/ | Partner referral/network application; eligibility review required | RESEARCH_NOT_SUBMITTED |
| HAXX Service | https://haxxservice.com/partners/ | Trade/referral collaboration, geography/fit to be checked | RESEARCH_NOT_SUBMITTED |
| DLV Energy | https://dlvenergy.com/partners | HVAC strategic/referral partnership ideas; business fit to be checked | RESEARCH_NOT_SUBMITTED |
| Climapulse | https://climapulse.com/en/partners | HVAC software partner application; non-US fit needs review | RESEARCH_NOT_SUBMITTED |

These programs may be more appropriate for individually completed official applications than for a bulk promotional email. No public contact address is added without explicit channel and delivery-entitlement checks. Invitations to apply **do not automatically establish an existing business relationship or marketing permission**.

## Operational release gate for the intended 75
1. Obtain up to 45 **additional genuine, separate, documented, permission-eligible recipients**. Preserve source URL, time, nature of prior relationship or actual opt-in, intended message and jurisdiction.
2. For each, verify complete cross-channel history: live Oracle SQLite (all senders), Lark corporate mailbox, Gmail/Resend, suppression, previous attempt, explicit opt-out, bounce/complaint, unique mailbox and unique business domain, recipient-local business hours. Do not fill boolean flags without underlying evidence.
3. Stage only those that independently pass through the **existing SHA-pinned OCI sender and shared lock**, not through a newly invented parallel email tool; read-only `MONARDAS_CAP75_MONDAY_GATE_V1_20261121` must confirm READY at the target run time. Never promise exactly 75; runtime quota and eligibility may defer them.
4. Check `MONARDAS_CAP75_POSTRUN_OBSERVER_V1_20261121` after 2026-11-23 18:15 UTC. Reconcile distinct accepted Message-ID, OCI OutboundRelayed, bounces, complaints, Lark replies, scheduled calls, pilots and paid customers. An accepted SMTP message is not guaranteed to land in inbox.

**No production code, queue, DNS, SMTP credentials, systemd units or sender configurations are changed by this documentation.**
