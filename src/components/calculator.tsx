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
  const [estimates, setEstimates] = useState(100);
  const [ticket, setTicket] = useState(8500);
  const [rate, setRate] = useState(5);
  const revenue = (estimates * ticket * rate) / 100;
  const fields = [
    {
      id: "estimates",
      label: "Unsold estimates per month",
      value: estimates,
      set: setEstimates,
      max: 10000,
      step: 1,
      suffix: "",
    },
    {
      id: "ticket",
      label: "Average replacement ticket",
      value: ticket,
      set: setTicket,
      max: 100000,
      step: 100,
      suffix: "$",
    },
    {
      id: "rate",
      label: "Illustrative recovery rate",
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
              value={field.value}
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
          Illustrative recovered revenue / month
        </span>
        <output
          className="big-result"
          aria-live="polite"
          aria-atomic="true"
          htmlFor="calc-estimates calc-ticket calc-rate"
        >
          <span>Illustrative recovered revenue</span>
          <strong>{currency(revenue)}</strong>
          <span>per month</span>
          <span data-testid="recovery-formula">
            {estimates.toLocaleString("en-US")} × {currency(ticket)} × {rate}% ={" "}
            {currency(revenue)}
          </span>
        </output>
        <p>Unsold estimates × average ticket × recovery rate.</p>
        <small className="formula-note">
          Recovery rate here means the share of unsold estimates that become
          closed jobs. It is an illustrative input, not an observed result.
        </small>
        <Link href="/contact">
          Get a Revenue Recovery Audit <ArrowUpRight size={18} />
        </Link>
        <p>
          Illustration only. This is not a forecast or guarantee. Actual
          recovery depends on lead quality, timing, sales process and market
          conditions.
        </p>
      </div>
    </div>
  );
}
