"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { submitIntake, type IntakeActionState, type IntakePayload } from "./actions";
import { BASE_ESTIMATE, FEATURES, PLATFORMS, computeEstimate } from "@/lib/feature-catalog";

const initialState: IntakeActionState = { error: null };

function formatUSD(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

type IntakeFormProps = {
  initialValues?: IntakePayload;
  onSuccess?: () => void;
};

export default function IntakeForm({ initialValues, onSuccess }: IntakeFormProps) {
  const [state, formAction, pending] = useActionState(submitIntake, initialState);
  const [division, setDivision] = useState<string>(initialValues?.division ?? "AI Software");
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>(
    initialValues?.selectedFeatures ?? [],
  );
  const [platform, setPlatform] = useState<string>(initialValues?.platform ?? "web");

  const wasPending = useRef(false);
  useEffect(() => {
    if (wasPending.current && !pending && !state.error) {
      onSuccess?.();
    }
    wasPending.current = pending;
  }, [pending, state.error, onSuccess]);

  const showPicker = division === "AI Software" || division === "Both";
  const estimate = computeEstimate(selectedFeatures, platform);
  const isEdit = !!initialValues;

  function toggleFeature(id: string) {
    setSelectedFeatures((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id],
    );
  }

  return (
    <form action={formAction}>
      <div className="form-group">
        <label htmlFor="projectName">Project name</label>
        <input
          type="text"
          id="projectName"
          name="projectName"
          required
          maxLength={200}
          defaultValue={initialValues?.projectName}
        />
      </div>

      <div className="form-group">
        <label htmlFor="division">Division of interest</label>
        <select
          id="division"
          name="division"
          value={division}
          onChange={(e) => setDivision(e.target.value)}
        >
          <option>AI Software</option>
          <option>CNC Manufacturing</option>
          <option>Both</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="description">Project description</label>
        <textarea
          id="description"
          name="description"
          required
          maxLength={5000}
          defaultValue={initialValues?.description}
        ></textarea>
      </div>

      {showPicker && (
        <>
          <div className="form-group">
            <label>Platform</label>
            <div className="platform-options">
              {PLATFORMS.map((p) => (
                <label key={p.id}>
                  <input
                    type="radio"
                    name="platform"
                    value={p.id}
                    checked={platform === p.id}
                    onChange={() => setPlatform(p.id)}
                  />
                  {p.label}
                </label>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Features</label>
            <div className="feature-list">
              {FEATURES.map((f) => (
                <div className="feature-row" key={f.id}>
                  <label>
                    <input
                      type="checkbox"
                      name="features"
                      value={f.id}
                      checked={selectedFeatures.includes(f.id)}
                      onChange={() => toggleFeature(f.id)}
                    />
                    {f.label}
                  </label>
                  <span className="feature-row-price">
                    {formatUSD(f.priceLow)}&ndash;{formatUSD(f.priceHigh)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="estimate-box">
            <div className="estimate-box-label">Estimated range</div>
            <div className="estimate-box-value">
              {formatUSD(estimate.low)} &ndash; {formatUSD(estimate.high)}
            </div>
            <p style={{ fontSize: "0.8rem", color: "var(--ink-soft)", marginTop: "0.5rem" }}>
              Includes a {formatUSD(BASE_ESTIMATE.low)}&ndash;{formatUSD(BASE_ESTIMATE.high)} base
              build. A rough estimate to start the conversation, not a binding quote.
            </p>
          </div>
        </>
      )}

      {state.error && (
        <p role="alert" className="form-message show error">
          {state.error}
        </p>
      )}
      <button type="submit" disabled={pending}>
        {pending ? "Saving..." : isEdit ? "Save changes" : "Submit"}
      </button>
    </form>
  );
}
