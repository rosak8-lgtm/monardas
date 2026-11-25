"use client";
import { useRef, useState, useSyncExternalStore } from "react";
import { ArrowUpRight, Check } from "lucide-react";
import Link from "next/link";
import Script from "next/script";
import { validate, type ContactData, type Errors } from "@/lib/contact";
import { captureAttribution } from "@/lib/attribution";

const subscribe = () => () => {};
const marketingTurnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "";
const fields = [
  ["firstName", "Name", "text", "name"],
  ["company", "Company", "text", "organization"],
  ["email", "Work email", "email", "email"],
  ["companyWebsite", "Website", "text", "url"],
  ["phone", "Phone", "tel", "tel"],
  ["crm", "CRM/FSM or export format", "text", "off"],
] as const;

export function ContactForm({
  foundingPartner = false,
  agencyPartner = false,
  freePilot = false,
  internalOptInQa = false,
}: {
  foundingPartner?: boolean;
  agencyPartner?: boolean;
  freePilot?: boolean;
  internalOptInQa?: boolean;
}) {
  const showMarketingOptIn = Boolean(marketingTurnstileSiteKey) && (process.env.NEXT_PUBLIC_MARKETING_OPTIN_MODE === "live" || internalOptInQa);
  const submissionLocked = useRef(false);
  const ready = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
  const [errors, setErrors] = useState<Errors>({});
  const [marketingNotice, setMarketingNotice] = useState<"none" | "sent" | "failed" | "verification-required">("none");
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submissionLocked.current) return;
    const form = event.currentTarget;
    const submission = new FormData(form);
    const data = Object.fromEntries(submission) as unknown as ContactData;
    data.marketingOptIn = showMarketingOptIn && submission.get("marketingOptIn") === "yes";
    data.turnstileToken = data.marketingOptIn ? String(submission.get("cf-turnstile-response") ?? "") : "";
    const found = validate(data);
    setErrors(found);
    if (Object.keys(found).length) {
      setState("idle");
      (form.elements.namedItem(Object.keys(found)[0]) as HTMLElement)?.focus();
      return;
    }
    data.attribution = captureAttribution();
    setState("loading");
    submissionLocked.current = true;
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("delivery-failed");
      const result = (await response.json()) as { marketing_confirmation_sent?: boolean; marketing_confirmation_status?: string };
      setMarketingNotice(data.marketingOptIn ? (result.marketing_confirmation_sent ? "sent" : result.marketing_confirmation_status === "verification_required" ? "verification-required" : "failed") : "none");
      setState("success");
    } catch {
      submissionLocked.current = false;
      setState("error");
    }
  }
  const renderField = ([name, label, type, autoComplete]: (typeof fields)[number]) => {
    const required = ["firstName", "company", "email"].includes(name);
    return (
      <div
        className={
          ["company", "crm", "companyWebsite"].includes(name)
            ? "full-field"
            : ""
        }
        key={name}
      >
        <label htmlFor={name}>
          {label}
          {required ? (
            <span aria-hidden="true"> *</span>
          ) : (
            <span className="optional"> (optional)</span>
          )}
        </label>
        <input
          id={name}
          name={name}
          type={type}
          required={required}
          placeholder={
            name === "companyWebsite" ? "yourcompany.com" : undefined
          }
          maxLength={name === "phone" ? 25 : 200}
          autoComplete={autoComplete}
          aria-invalid={!!errors[name]}
          aria-describedby={errors[name] ? `${name}-error` : undefined}
        />
        {errors[name] && (
          <span className="field-error" id={`${name}-error`}>
            {errors[name]}
          </span>
        )}
      </div>
    );
  };
  const messageField = (
    <div className="full-field">
              <label htmlFor="message">
                Notes <span className="optional">(optional)</span>
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                maxLength={3000}
                defaultValue={
                  freePilot
                    ? ""
                    : agencyPartner
                      ? ""
                    : foundingPartner
                      ? "I’d like to discuss an HVAC Recovery Pilot."
                      : ""
                }
                placeholder={freePilot ? "How many unsold estimates do you have? Which CRM do you use? No homeowner details." : agencyPartner ? "Which HVAC clients do you support, and what kind of collaboration are you exploring?" : "Anything we should know about your unsold replacement estimates?"}
                aria-invalid={!!errors.message}
                aria-describedby={errors.message ? "message-error" : undefined}
              />
              {errors.message && (
                <span id="message-error" className="field-error">
                  {errors.message}
                </span>
              )}
            </div>
  );
  const replyPreferences = (
    <fieldset className="full-field">
            <legend>How would you like MONARDAS to reply?</legend>
            <label htmlFor="preferredChannel">Preferred reply channel</label>
            <select id="preferredChannel" name="preferredChannel" defaultValue="email">
              <option value="email">Email (default)</option>
              <option value="whatsapp">WhatsApp — reply to the phone number above</option>
              <option value="telegram">Telegram — reply to the username below</option>
            </select>
            <label htmlFor="telegramHandle">Telegram username (only if you selected Telegram)</label>
            <input
              id="telegramHandle"
              name="telegramHandle"
              type="text"
              placeholder="@your_username"
              maxLength={33}
              autoComplete="off"
              aria-invalid={!!errors.telegramHandle}
              aria-describedby={errors.telegramHandle ? "telegramHandle-error" : undefined}
            />
            {errors.telegramHandle && (
              <span className="field-error" id="telegramHandle-error">
                {errors.telegramHandle}
              </span>
            )}
            {errors.preferredChannel && (
              <span className="field-error" id="preferredChannel-error">
                {errors.preferredChannel}
              </span>
            )}
            <p className="form-note">
              Your selection asks us to reply to this enquiry using your chosen
              channel. It is not a subscription to marketing messages. WhatsApp
              requires a phone number; Telegram requires a public username.
            </p>
          </fieldset>
  );

  return (
    <form
      className="contact-form"
      onSubmit={submit}
      method="post"
      action="/api/contact"
      noValidate
    >
      <input type="hidden" name="intent" value={freePilot ? "hvac-free-pilot" : agencyPartner ? "agency-partner" : "hvac-pilot"} />
      <input type="hidden" name="lastName" value="" />
      <input type="hidden" name="industry" value="HVAC" />
      <input type="hidden" name="volume" value="" />
      <h2>
        {freePilot
          ? "Apply for a Free 30-Day HVAC Pilot"
          : agencyPartner
            ? "Discuss an HVAC Agency Partnership"
          : foundingPartner
            ? "Discuss a Founder-led Recovery Pilot"
            : freePilot
              ? "Apply for the Free 30-Day HVAC Pilot"
              : agencyPartner
                ? "Discuss an HVAC Agency Partnership"
                : "Get a Free Estimate Recovery Assessment"}
      </h2>
      <p>
        {freePilot
          ? "Tell us about your HVAC company. Only your business name, name and work email are required. Do not enter any homeowner details."
          : agencyPartner
            ? "Tell us about your agency or consultancy. Your name, company and work email are required; other fields are optional."
          : "Start with your name, company and work email. All other fields are optional."}
      </p>
      <div className="form-grid">
        {fields.slice(0, 3).map(renderField)}
        {freePilot ? (
          <div className="full-field">
            <details className="contact-more-details">
              <summary>Optional: website, CRM, phone and other details</summary>
              <div className="form-grid">
                {fields.slice(3).map(renderField)}
                {messageField}
              </div>
              {replyPreferences}
            </details>
          </div>
        ) : (
          <>
            {fields.slice(3).map(renderField)}
            {messageField}
          </>
        )}
      </div>
      {!freePilot && replyPreferences}
      {internalOptInQa && !marketingTurnstileSiteKey && (
        <p className="field-error" role="status">
          Subscription QA is unavailable: the public Turnstile site key was not included in this build.
          The business enquiry can still be submitted, but no subscription will be created.
        </p>
      )}
      {showMarketingOptIn && (
        <div className="full-field">
          {internalOptInQa && <p className="form-note">Internal subscription test only — use the designated company mailbox. This is not a customer registration.</p>}
          <label htmlFor="marketingOptIn">
            <input id="marketingOptIn" name="marketingOptIn" type="checkbox" value="yes" />{" "}
            Optional: I want occasional MONARDAS HVAC recovery tips and offers by email. I can unsubscribe at any time.
          </label>
          <p className="form-note">Not required for your enquiry. A separate email confirmation is required before subscription.</p>
          <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" strategy="afterInteractive" />
          <div className="cf-turnstile" data-sitekey={marketingTurnstileSiteKey} />
        </div>
      )}
      <div className="honeypot" aria-hidden="true">
        <label htmlFor="website">
          Website
          <input id="website" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <button
        className="button button-dark form-submit"
        disabled={!ready || state === "loading" || state === "success"}
        type="submit"
      >
        {state === "loading"
          ? "Sending…"
          : state === "success"
            ? "Request received"
            : freePilot
              ? "Apply for the Free 30-Day Pilot"
              : agencyPartner
                ? "Ask About Partnership"
                : foundingPartner
                  ? "Discuss a Recovery Pilot"
                  : "Get a Free Estimate Recovery Assessment"}
        <ArrowUpRight size={18} />
      </button>
      <noscript>
        Please enable JavaScript to submit this form, or email
        yurii@monardas.com.
      </noscript>
      <div aria-live="polite" aria-atomic="true" role="status">
        {state === "success" && (
          <p className="form-success">
            <Check size={18} />
            <span>
              <strong>{freePilot
                ? "Your free-pilot application has been received."
                : agencyPartner
                  ? "Your partnership enquiry has been received."
                  : "Thanks — your assessment request has been received."}</strong>{" "}
              {freePilot
                ? "We will review fit for the 30-day program before confirming a place. No homeowner information is needed at application stage."
                : agencyPartner
                  ? "We will review whether a partner introduction makes sense."
                  : "I’ll review your current estimate follow-up process and get back to you directly."}
            </span>
          </p>
        )}
        {state === "success" && marketingNotice === "sent" && (
          <p className="form-note">Please check your email to confirm the optional subscription. You are not subscribed yet.</p>
        )}
        {state === "success" && marketingNotice === "verification-required" && (
          <p className="form-note">Your business enquiry was accepted, but the optional subscription verification was incomplete. You are not subscribed.</p>
        )}
        {state === "success" && marketingNotice === "failed" && (
          <p className="form-note">Your business enquiry was accepted, but optional subscription verification could not be sent. You are not subscribed.</p>
        )}
        {state === "error" && (
          <p className="field-error">
            We couldn&apos;t send your request. Please try again, or contact us
            directly at yurii@monardas.com.
          </p>
        )}
      </div>
      <p className="form-note">
        Your details are used to review and respond to your request. Submitting
        this form does not commit you to a paid pilot or guarantee selection for a free one.
        {" "}<Link href="/privacy">Privacy Policy</Link>
        {" · "}<Link href="/terms">Website &amp; Pilot Terms</Link>
        {freePilot && (
          <>
            {" · "}<Link href="/hvac/free-pilot#pilot-faq">Free Pilot FAQ</Link>
          </>
        )}
      </p>
    </form>
  );
}
