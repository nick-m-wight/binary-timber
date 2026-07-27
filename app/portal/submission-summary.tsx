import type { IntakePayload } from "./actions";
import { FEATURES, PLATFORMS } from "@/lib/feature-catalog";

function formatUSD(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

export default function SubmissionSummary({ payload }: { payload: IntakePayload }) {
  const selectedFeatures = FEATURES.filter((f) => payload.selectedFeatures?.includes(f.id));
  const platform = PLATFORMS.find((p) => p.id === payload.platform);

  return (
    <div className="app-page-card">
      <p className="app-page-card-label">Project</p>
      <p className="app-page-card-value">{payload.projectName}</p>

      <p className="app-page-card-label">Division</p>
      <p className="app-page-card-value">{payload.division}</p>

      <p className="app-page-card-label">Description</p>
      <p className="app-page-card-value">{payload.description}</p>

      {payload.estimate && (
        <>
          <p className="app-page-card-label">Estimated range</p>
          <p className="app-page-card-value">
            {formatUSD(payload.estimate.low)} &ndash; {formatUSD(payload.estimate.high)}
          </p>
        </>
      )}

      {platform && (
        <>
          <p className="app-page-card-label">Platform</p>
          <p className="app-page-card-value">{platform.label}</p>
        </>
      )}

      {selectedFeatures.length > 0 && (
        <>
          <p className="app-page-card-label">Selected features</p>
          <p className="app-page-card-value">{selectedFeatures.map((f) => f.label).join(", ")}</p>
        </>
      )}
    </div>
  );
}
