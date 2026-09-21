"use client";
import { useState } from "react";
import { ArrowUpRight, Info } from "lucide-react";
import Link from "next/link";
export function Calculator() {
  const [estimates, setEstimates] = useState(100);
  const [value, setValue] = useState(12000);
  const [close, setClose] = useState(30);
  const [reactivation, setReactivation] = useState(5);
  const unsold = estimates * (1 - close / 100);
  const reopened = (unsold * reactivation) / 100;
  const currency = (n: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(n);
  const fields = [
    {
      label: "Monthly estimates",
      value: estimates,
      set: setEstimates,
      min: 0,
      max: 1000,
      step: 1,
      suffix: "",
    },
    {
      label: "Average job value",
      value,
      set: setValue,
      min: 0,
      max: 100000,
      step: 500,
      suffix: "$",
    },
    {
      label: "Current close rate",
      value: close,
      set: setClose,
      min: 0,
      max: 100,
      step: 1,
      suffix: "%",
    },
    {
      label: "Possible reactivation rate",
      value: reactivation,
      set: setReactivation,
      min: 0,
      max: 100,
      step: 1,
      suffix: "%",
    },
  ];
  return (
    <div className="calculator">
      <div className="calculator-inputs">
        <div className="calculator-label">
          YOUR INPUTS / A SCENARIO, NOT A FORECAST
        </div>
        {fields.map((f, i) => (
          <div className="calc-field" key={f.label}>
            <div>
              <label htmlFor={`calc-${i}`}>{f.label}</label>
              <span className="number-wrap">
                {f.suffix === "$" && <span>$</span>}
                <input
                  id={`calc-${i}`}
                  type="number"
                  min={f.min}
                  max={f.max}
                  step={f.step}
                  value={f.value}
                  onChange={(e) =>
                    f.set(
                      Math.min(
                        f.max,
                        Math.max(f.min, Number(e.target.value) || 0),
                      ),
                    )
                  }
                />
                {f.suffix === "%" && <span>%</span>}
              </span>
            </div>
            <input
              aria-label={`${f.label} slider`}
              type="range"
              min={f.min}
              max={f.max}
              step={f.step}
              value={f.value}
              onChange={(e) => f.set(Number(e.target.value))}
            />
          </div>
        ))}
      </div>
      <div className="calculator-results" aria-live="polite" aria-atomic="true">
        <span className="calculator-label">
          ILLUSTRATIVE MONTHLY OPPORTUNITY
        </span>
        <div className="small-result">
          <span>
            Unsold pipeline
            <br />
            {Number(unsold.toFixed(1))} estimates
          </span>
          <strong>{currency(unsold * value)}</strong>
        </div>
        <div className="small-result">
          <span>Potential reopened opportunities</span>
          <strong>{Number(reopened.toFixed(1))}</strong>
        </div>
        <div className="big-result">
          <span>Illustrative revenue opportunity</span>
          <strong>{currency(reopened * value)}</strong>
          <span>Upper-bound value if every reopened opportunity closes.</span>
        </div>
        <Link href="/contact">
          Explore your pipeline
          <ArrowUpRight size={18} />
        </Link>
        <p>
          <Info size={14} />
          Illustrative estimate — not a guarantee.
        </p>
        <small className="formula-note">
          Illustrative model only. Actual results vary. Unsold estimates ×
          reactivation rate = reopened opportunities. Value assumes every
          reopened opportunity closes at the average job value; actual sales
          conversion and recovery costs reduce this amount.
        </small>
      </div>
    </div>
  );
}
