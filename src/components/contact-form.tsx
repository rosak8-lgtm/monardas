"use client";
import { useState } from "react";
import { ArrowUpRight, Check } from "lucide-react";
import {
  industries,
  volumes,
  validate,
  type ContactData,
  type Errors,
} from "@/lib/contact";
export function ContactForm() {
  const [errors, setErrors] = useState<Errors>({});
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );
  const [message, setMessage] = useState("");
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
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
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (!response.ok)
        throw new Error(result.error || "Unable to submit. Please try again.");
      setState("success");
      setMessage(result.message);
      form.reset();
    } catch (error) {
      setState("error");
      setMessage(
        error instanceof Error
          ? error.message
          : "Unable to submit. Please try again.",
      );
    }
  }
  const fields = [
    ["firstName", "First name", "text"],
    ["lastName", "Last name", "text"],
    ["company", "Company", "text"],
    ["email", "Email", "email"],
    ["phone", "Phone", "tel"],
    ["crm", "CRM / FSM", "text"],
  ] as const;
  return (
    <form className="contact-form" onSubmit={submit} noValidate>
      <h2>Let’s look at your pipeline.</h2>
      <p>
        Required fields are marked *. CRM / FSM and your message are optional.
      </p>
      <div className="form-grid">
        {fields.map(([name, label, type]) => (
          <div
            className={["company", "crm"].includes(name) ? "full-field" : ""}
            key={name}
          >
            <label htmlFor={name}>
              {label}
              {name !== "crm" && <span aria-hidden="true"> *</span>}
            </label>
            <input
              id={name}
              name={name}
              type={type}
              required={name !== "crm"}
              maxLength={name === "phone" ? 25 : 200}
              autoComplete={
                {
                  firstName: "given-name",
                  lastName: "family-name",
                  company: "organization",
                  email: "email",
                  phone: "tel",
                  crm: "off",
                }[name]
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
        {(
          [
            { name: "industry", label: "Industry", options: industries },
            {
              name: "volume",
              label: "Monthly estimate volume",
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
              defaultValue=""
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
            Message <span className="optional">(optional)</span>
          </label>
          <textarea
            id="message"
            name="message"
            rows={4}
            maxLength={3000}
            placeholder="Where does follow-up drop off in your pipeline?"
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
        disabled={state === "loading"}
        type="submit"
      >
        {state === "loading"
          ? "Validating…"
          : "Request a Revenue Recovery Audit"}
        <ArrowUpRight size={18} />
      </button>
      <div aria-live="polite" role="status">
        {state === "success" && (
          <p className="form-success">
            <Check size={18} />
            {message}
          </p>
        )}
        {state === "error" && <p className="field-error">{message}</p>}
      </div>
      <p className="form-note">
        Local demonstration: submissions are validated but not stored or
        delivered. Production submissions remain disabled until delivery is
        configured.
      </p>
    </form>
  );
}
