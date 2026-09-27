"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const currency = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);

export function Calculator() {
  const [estimates, setEstimates] = useState<number | "">(25);
  const [ticket, setTicket] = useState<number | "">("");
  const [rate, setRate] = useState<number | "">("");
  const complete = estimates !== "" && ticket !== "" && rate !== "";
  const revenue = (Number(estimates) * Number(ticket) * Number(rate)) / 100;
  const fields = [
    {
      id: "estimates",
      label: "Unsold estimates in the batch",
      value: estimates,
      set: setEstimates,
      max: 10000,
      step: 1,
      suffix: "",
    },
    {
      id: "ticket",
      label: "Average replacement job value",
      value: ticket,
      set: setTicket,
      max: 100000,
      step: 100,
      suffix: "$",
    },
    {
      id: "rate",
      label: "Assumed share that become closed jobs",
      value: rate,
      set: setRate,
      max: 100,
      step: 0.1,
      suffix: "%",
    },
  ];
  return (
    <div className="calculator">
      <div className="calculator-inputs">
        <div className="calculator-label">
          Your inputs / A scenario, not a forecast
        </div>
        {fields.map((field) => (
          <div className="calc-field" key={field.id}>
            <div>
              <label htmlFor={`calc-${field.id}`}>
                {field.label}
                {field.suffix === "$"
                  ? " (USD)"
                  : field.suffix === "%"
                    ? " (%)"
                    : ""}
              </label>
              <span className="number-wrap">
                {field.suffix === "$" && <span aria-hidden="true">$</span>}
                <input
                  id={`calc-${field.id}`}
                  type="number"
                  min={0}
                  max={field.max}
                  step={field.step}
                  value={field.value}
                  onChange={(event) => {
                    if (event.target.value === "") {
                      field.set("");
                      return;
                    }
                    const value = Number(event.target.value);
                    field.set(
                      Number.isFinite(value)
                        ? Math.min(field.max, Math.max(0, value))
                        : 0,
                    );
                  }}
                />
                {field.suffix === "%" && <span aria-hidden="true">%</span>}
              </span>
            </div>
            <input
              aria-label={`${field.label} slider`}
              type="range"
              min={0}
              max={field.max}
              step={field.step}
              value={field.value === "" ? 0 : field.value}
              onChange={(event) => field.set(Number(event.target.value))}
            />
          </div>
        ))}
        <p className="fine-print">
          Your inputs stay in this browser session. Nothing is saved or
          submitted.
        </p>
      </div>
      <div className="calculator-results">
        <span className="calculator-label">
          Illustrative gross revenue from recovered jobs
        </span>
        <output
          className="big-result"
          aria-live="polite"
          aria-atomic="true"
          htmlFor="calc-estimates calc-ticket calc-rate"
        >
          {complete ? (
            <>
              <strong>{currency(revenue)}</strong>
              <span data-testid="recovery-formula">
                {Number(estimates).toLocaleString("en-US")} ×{" "}
                {currency(Number(ticket))} × {rate}% = {currency(revenue)}
              </span>
            </>
          ) : (
            <span>Enter your assumptions to see a scenario.</span>
          )}
        </output>
        <p>
          Estimates in the batch × average job value × assumed closed-job rate.
        </p>
        <small className="formula-note">
          The assumed rate is the share of estimates that become closed jobs—not
          the share that reply. It is your scenario input, not a measured
          MONARDAS conversion rate.
        </small>
        <Link href="/contact?intent=hvac-pilot">
          Discuss a Recovery Pilot <ArrowUpRight size={18} />
        </Link>
        <p>
          This is gross revenue, not profit or ROI. It excludes pilot fees,
          equipment, labor and other job costs. Actual results may include no
          recovered jobs.
        </p>
      </div>
    </div>
  );
}
