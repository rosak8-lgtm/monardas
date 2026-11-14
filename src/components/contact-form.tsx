"use client";
import { useRef, useState, useSyncExternalStore } from "react";
import { ArrowUpRight, Check } from "lucide-react";
import { validate, type ContactData, type Errors } from "@/lib/contact";
import { captureAttribution } from "@/lib/attribution";

const subscribe = () => () => {};
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
}: {
  foundingPartner?: boolean;
  agencyPartner?: boolean;
}) {
  const submissionLocked = useRef(false);
  const ready = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
  const [errors, setErrors] = useState<Errors>({});
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submissionLocked.current) return;
    const form = event.currentTarget;
    const data = Object.fromEntries(
      new FormData(form),
    ) as unknown as ContactData;
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
      setState("success");
    } catch {
      submissionLocked.current = false;
      setState("error");
    }
  }
  return (
    <form
      className="contact-form"
      onSubmit={submit}
      method="post"
      action="/api/contact"
      noValidate
    >
      <input type="hidden" name="intent" value={agencyPartner ? "agency-partner" : "hvac-pilot"} />
      <input type="hidden" name="lastName" value="" />
      <input type="hidden" name="industry" value="HVAC" />
      <input type="hidden" name="volume" value="" />
      <h2>
        {agencyPartner
          ? "Discuss an HVAC Agency Partnership"
          : foundingPartner
            ? "Discuss a Founder-led Recovery Pilot"
            : "Get a Free Estimate Recovery Assessment"}
      </h2>
      <p>
        {agencyPartner
          ? "Tell us about your agency or consultancy. Your name, company and work email are required; other fields are optional."
          : "Start with your name, company and work email. All other fields are optional."}
      </p>
      <div className="form-grid">
        {fields.map(([name, label, type, autoComplete]) => {
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
        })}
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
              agencyPartner
                ? ""
                : foundingPartner
                  ? "I’d like to discuss an HVAC Recovery Pilot."
                  : ""
            }
            placeholder={agencyPartner ? "Which HVAC clients do you support, and what kind of collaboration are you exploring?" : "Anything we should know about your unsold replacement estimates?"}
            aria-invalid={!!errors.message}
            aria-describedby={errors.message ? "message-error" : undefined}
          />
          {errors.message && (
            <span id="message-error" className="field-error">
              {errors.message}
            </span>
          )}
        </div>
      </div>
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
              <strong>Thanks — your assessment request has been received.</strong>{" "}
              I’ll review your current estimate follow-up process and get back
              to you directly.
            </span>
          </p>
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
        this form does not commit you to a paid pilot.
      </p>
    </form>
  );
}
