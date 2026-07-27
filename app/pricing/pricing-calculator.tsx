"use client";

import Link from "next/link";
import { useState } from "react";
import { BASE_ESTIMATE, FEATURES, PLATFORMS, computeEstimate } from "@/lib/feature-catalog";

function formatUSD(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

export default function PricingCalculator() {
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [platform, setPlatform] = useState<string>("web");

  const estimate = computeEstimate(selectedFeatures, platform);

  function toggleFeature(id: string) {
    setSelectedFeatures((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id],
    );
  }

  return (
    <div>
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
          Includes a {formatUSD(BASE_ESTIMATE.low)}&ndash;{formatUSD(BASE_ESTIMATE.high)} base build.
          A rough estimate to start the conversation, not a binding quote.
        </p>
      </div>

      <p style={{ marginTop: "1.5rem" }}>
        <Link href="/auth/login">Sign in to submit your project &rarr;</Link>
      </p>
    </div>
  );
}
