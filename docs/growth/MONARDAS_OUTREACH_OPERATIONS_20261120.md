# MONARDAS — Outreach operating state and next execution gates
**Date:** 2026-11-20 | **Status:** infrastructure active, acquisition funnel not yet proven | **Scope:** US HVAC contractors and invited technology partners

## Verified observations
- Oracle USER timer `monardas-oci-prod-v1.timer` last owner-proven active, with next programmed 2026-11-20 17:05 UTC. Legacy SYSTEM `monardas-oci-daily.timer` and PostgreSQL cohort bridge coexist; no service is disabled by this document.
- At 2026-11-19 17:05 UTC Production V1 accepted two official partner enquiries over SMTP, Callbook and ServiceMerge. Both have Message-IDs in shared Oracle SQLite. Latest owner-proven shared Oracle ledger: **18** entries `SMTP_ACCEPTED_NOT_DELIVERED`. SMTP acceptance does not prove final delivery or reply. **Never re-send these jobs without new, independently verified eligibility and a separate authorized follow-up.**
- Fresh Resend tool check 2026-11-20: domain `send.monardas.com` verified, sending enabled; **0 contacts**; **2 drafts**; **3 suppressed addresses**; **0 daily sends / 100 daily quota**; **15 monthly sends**; **12 delivered, 3 bounced (20%)**; **0 Resend webhooks**. Resend delivery figures do **not** include the separate Oracle SMTP ledger. Tracking of opens/clicks is disabled.
- Prospect research workbook `MONARDAS_HVAC_PROSPECTS_22_20261120.xlsx` contains **22 research candidates**, not an approved cohort. Every new address is `NOT_SENT`; Oracle ledger/suppression overlap and permission/channel entitlement are **not confirmed**. Two source addresses require additional verification.
- Draft PR #30 (provider acceptance copy) and #31 (signed webhook delivery journal) remain **unmerged draft PRs**, although their latest queried GitHub workflow runs conclude **success**. Do not claim webhooks, durable lead inbox, or a deployed D1 journal until the PRs, migrations, secrets, endpoint and provider webhook are deployed and tested.

## Persisted commercial constraints
- Sender: `sales@send.monardas.com`; business replies: `yurii@monardas.com`. Do not use personal Gmail as outbound marketing sender.
- Current public offer: founder-supported **30-day FREE** pilot for up to **two** independent US HVAC companies and **25 eligible open replacement quotes** each. No automatic paid renewal or payment card. Contractor team approves homeowner follow-up. Landing: https://monardas.com/hvac/free-pilot
- Count **qualified replies, scheduled calls, approved pilots, confirmed paid conversions**, not only accepted SMTP events.
- Dedupe and opt-out must be global across both Oracle senders, Resend and connected reply inboxes. Suppression applies even if a researcher discovers an alternative email address within the same company. Neither `MAILBOX_VERIFIED_READY` nor a published public email equals marketing permission.

## Provider boundaries and routing
- The FTC's CAN-SPAM guidance applies to B2B and requires accurate sender, non-deceptive subject, valid postal address and effective opt-out. The absence of a prior statutory opt-in requirement does not cancel sender-provider policy.
- Resend AUP prohibits unsolicited cold outreach, purchased or scraped lists. Oracle Email Delivery prohibits unsolicited bulk messaging to parties without pre-existing relationships and directs bulk marketing towards opt-in. Do **not** treat provider's 100/day quota as permission to import the 22 research rows.
- For a company that **explicitly invites partnership enquiries**, use its documented official application method or address after channel qualification and global history review. Document the invitation URL, campaign, individual permission basis, postal-address compliance and a working opt-out before staging. Do not replace the real permission basis with fictional `confirmed_optin`.

## Reusable operator audit (no SMTP)
On the owner Lenovo after the previously delivered 2026-11-20 two-channel control package is installed:

```bash
bash "$HOME/Загрузки/MONARDAS_TWO_CHANNEL_CONTROL_V1_20261120/run_from_lenovo.sh" audit
```

For independently installed Production V1, use its existing installer in **status/audit modes**:

```bash
bash "$HOME/Загрузки/MONARDAS_OCI_PRODUCTION_V1_20261118/install_from_lenovo.sh" status
bash "$HOME/Загрузки/MONARDAS_OCI_PRODUCTION_V1_20261118/install_from_lenovo.sh" audit
```

Run no manual `send` command during an ambiguous ledger state. Never reset `history_clear` or `approved` merely to increase throughput.

## Concrete next release gates
1. Read both Oracle journals and current shared SQLite under lock; verify sender lock, suppression paths, duplicate hashes and previous-oracle-attempt rows; reconcile PostgreSQL cohort bridge without disabling either timer.
2. Verify actual delivery outcomes (OCI OutboundRelayed/bounce/complaint reports), align final statuses to ledger, and inspect the corporate Lark inbox for replies/opt-outs. Avoid repeated sends on an inconclusive transport state.
3. Finish PR #30/#31 integration review, D1 migration, webhook secret and dashboard endpoint setup; send **one clearly labeled internal form QA**, then verify a real corporate inbox receipt and journal event.
4. Maintain research funnel and **official inbound partnership applications**; solicit voluntary interest through the website and other authorized professional channels. Attach each permission/evidence record before the approved queue gains a row.
5. When a qualified recipient is actually READY, the existing Oracle scheduler autonomously sends at its established time slot. Log Message-ID and monitor delivery/reply; do not create extra concurrent outbound mechanisms.
6. Track funnel by cohort: researched, verified, contact permitted, queued, attempted, relayed, replied, discovery call, pilot started, paid customer.

## Links
- Operator issue https://github.com/rosak8-lgtm/monardas/issues/18
- PR #30 https://github.com/rosak8-lgtm/monardas/pull/30
- PR #31 https://github.com/rosak8-lgtm/monardas/pull/31
- FTC https://www.ftc.gov/business-guidance/resources/can-spam-act-compliance-guide-business
- Resend policy https://resend.com/legal/acceptable-use
- Oracle email FAQ https://www.oracle.com/application-development/email-delivery/faq/

**No outbound email, sender service modification, database write, approval upgrade, webhook creation, or website deployment is performed by this documentation update.**
