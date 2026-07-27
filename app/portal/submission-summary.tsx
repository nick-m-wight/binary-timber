import type { IntakePayload } from "./actions";

export default function SubmissionSummary({ payload }: { payload: IntakePayload }) {
  return (
    <div className="app-page-card">
      <p className="app-page-card-label">Project</p>
      <p className="app-page-card-value">{payload.projectName}</p>

      <p className="app-page-card-label">Division</p>
      <p className="app-page-card-value">{payload.division}</p>

      <p className="app-page-card-label">Description</p>
      <p className="app-page-card-value">{payload.description}</p>
    </div>
  );
}
