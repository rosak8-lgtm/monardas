"use client";
import { useRef, useState } from "react";
import { ArrowUpRight, Check } from "lucide-react";
import {
  industries,
  volumes,
  validate,
  type ContactData,
  type Errors,
} from "@/lib/contact";
export function ContactForm({
  foundingPartner = false,
  hvacPilot = false,
}: {
  foundingPartner?: boolean;
  hvacPilot?: boolean;
}) {
  const submissionLocked = useRef(false);
  const [errors, setErrors] = useState<Errors>({});
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );
  const [message, setMessage] = useState("");
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submissionLocked.current) return;
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form)) as ContactData;
    const found = validate(data);
    setErrors(found);
    if (Object.keys(found).length) {
      setState("idle");
      (form.elements.namedItem(Object.keys(found)[0]) as HTMLElement)?.focus();
      return;
    }
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
      setMessage(
        hvacPilot
          ? "We’ll review the information you provided and contact you about whether your estimate backlog looks suitable for a focused recovery pilot."
          : "Thanks — we’ll review your revenue recovery opportunities and get back to you shortly.",
      );
    } catch {
      submissionLocked.current = false;
      setState("error");
      setMessage(
        "We couldn't send your request. Please try again, or contact us directly at yurii@monardas.com.",
      );
    }
  }
  const fields: ReadonlyArray<readonly [keyof ContactData, string, string]> =
    hvacPilot
      ? [
          ["firstName", "First name", "text"],
          ["company", "Company", "text"],
          ["companyWebsite", "Company website", "text"],
          ["email", "Work email", "email"],
          ["phone", "Phone", "tel"],
          ["crm", "CRM/FSM or export format", "text"],
          [
            "volume",
            "Approximate number of unsold replacement estimates",
            "number",
          ],
        ]
      : ([
          ["firstName", "First name", "text"],
          ["lastName", "Last name", "text"],
          ["company", "Company", "text"],
          ["email", "Email", "email"],
          ["phone", "Phone", "tel"],
          ["crm", "CRM / FSM", "text"],
        ] as const);
  const required = (name: keyof ContactData) =>
    hvacPilot
      ? ["firstName", "company", "companyWebsite", "email"].includes(name)
      : name !== "crm";
  return (
    <form className="contact-form" onSubmit={submit} noValidate>
      {hvacPilot && (
        <>
          <input type="hidden" name="intent" value="hvac-pilot" />
          <input type="hidden" name="lastName" value="" />
          <input type="hidden" name="industry" value="HVAC" />
        </>
      )}
      <h2>
        {hvacPilot
          ? "Request a Free Estimate Recovery Audit"
          : foundingPartner
            ? "Discuss a Founder-led Recovery Pilot"
            : "Request a Free Estimate Recovery Audit"}
      </h2>
      <p>
        {hvacPilot
          ? "Start with a review of your estimate backlog. Required fields are marked *."
          : "Required fields are marked *. CRM / FSM and your message are optional."}
      </p>
      <div className="form-grid">
        {fields.map(([name, label, type]) => (
          <div
            className={
              ["company", "crm", "companyWebsite", "volume"].includes(name)
                ? "full-field"
                : ""
            }
            key={name}
          >
            <label htmlFor={name}>
              {label}
              {required(name) ? (
                <span aria-hidden="true"> *</span>
              ) : (
                hvacPilot && <span className="optional"> (optional)</span>
              )}
            </label>
            <input
              id={name}
              name={name}
              type={type}
              required={required(name)}
              min={name === "volume" ? 0 : undefined}
              max={name === "volume" ? 1000000 : undefined}
              step={name === "volume" ? 1 : undefined}
              placeholder={
                name === "companyWebsite" ? "yourcompany.com" : undefined
              }
              maxLength={name === "phone" ? 25 : 200}
              autoComplete={
                (
                  {
                    firstName: "given-name",
                    lastName: "family-name",
                    company: "organization",
                    email: "email",
                    phone: "tel",
                    crm: "off",
                    companyWebsite: "url",
                  } as Partial<Record<keyof ContactData, string>>
                )[name]
              }
              aria-invalid={!!errors[name]}
              aria-describedby={errors[name] ? `${name}-error` : undefined}
            />
            {errors[name] && (
              <span className="field-error" id={`${name}-error`}>
                {errors[name]}
              </span>
            )}
          </div>
        ))}
        {!hvacPilot &&
          (
            [
              {
                name: "industry",
                label: "Industry",
                options: [
                  "HVAC",
                  ...industries.filter((industry) => industry !== "HVAC"),
                ],
              },
              {
                name: "volume",
                label: "Unsold estimates per month",
                options: volumes,
              },
            ] as const
          ).map(({ name, label, options }) => (
            <div key={name}>
              <label htmlFor={name}>
                {label}
                <span aria-hidden="true"> *</span>
              </label>
              <select
                id={name}
                name={name}
                required
                defaultValue={
                  foundingPartner && name === "industry" ? "HVAC" : ""
                }
                aria-invalid={!!errors[name]}
                aria-describedby={errors[name] ? `${name}-error` : undefined}
              >
                <option value="" disabled>
                  Select an option
                </option>
                {options.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
              {errors[name] && (
                <span className="field-error" id={`${name}-error`}>
                  {errors[name]}
                </span>
              )}
            </div>
          ))}
        <div className="full-field">
          <label htmlFor="message">
            {hvacPilot ? "Anything we should know?" : "Message"}{" "}
            <span className="optional">(optional)</span>
          </label>
          <textarea
            id="message"
            name="message"
            rows={4}
            maxLength={3000}
            defaultValue={
              foundingPartner
                ? "I’d like to discuss an HVAC Recovery Pilot."
                : ""
            }
            placeholder={
              hvacPilot
                ? "The type and age of your estimates, where records are stored, and who would follow up with interested homeowners."
                : "Where does follow-up drop off in your pipeline?"
            }
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
      <div className="honeypot" aria-hidden="true">
        <label htmlFor="website">
          Website
          <input id="website" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <button
        className="button button-dark form-submit"
        disabled={state === "loading" || state === "success"}
        type="submit"
      >
        {state === "loading"
          ? "Sending…"
          : state === "success"
            ? "Request received"
            : "Request a Free Estimate Recovery Audit"}
        <ArrowUpRight size={18} />
      </button>
      <div aria-live="polite" aria-atomic="true" role="status">
        {state === "success" && (
          <p className="form-success">
            <Check size={18} />
            <span>
              <strong>
                {hvacPilot
                  ? "Thanks — your audit request has been received."
                  : "Request received."}
              </strong>{" "}
              {message}
            </span>
          </p>
        )}
        {state === "error" && <p className="field-error">{message}</p>}
      </div>
      <p className="form-note">
        {hvacPilot
          ? "Your details are used to review and respond to your request. Submitting this form does not commit you to a paid pilot."
          : "Your details are used to review your request and follow up with you."}
      </p>
    </form>
  );
}
