"use client";

import { useState } from "react";
import IntakeForm from "./intake-form";
import SubmissionSummary from "./submission-summary";
import type { IntakePayload } from "./actions";

export default function PortalContent({ submission }: { submission: IntakePayload | null }) {
  const [editing, setEditing] = useState(false);

  if (submission && !editing) {
    return (
      <>
        <p>Thanks — we&apos;ve received your project intake.</p>
        <SubmissionSummary payload={submission} />
        <button type="button" onClick={() => setEditing(true)}>
          Edit submission
        </button>
      </>
    );
  }

  return (
    <>
      <p>
        {submission ? "Update your project details." : "Tell us about your project to get started."}
      </p>
      <IntakeForm initialValues={submission ?? undefined} onSuccess={() => setEditing(false)} />
    </>
  );
}
