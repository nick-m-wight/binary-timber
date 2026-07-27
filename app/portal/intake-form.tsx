"use client";

import { useActionState } from "react";
import { submitIntake, type IntakeActionState } from "./actions";

const initialState: IntakeActionState = { error: null };

export default function IntakeForm() {
  const [state, formAction, pending] = useActionState(submitIntake, initialState);

  return (
    <form action={formAction}>
      <div className="form-group">
        <label htmlFor="projectName">Project name</label>
        <input type="text" id="projectName" name="projectName" required maxLength={200} />
      </div>
      <div className="form-group">
        <label htmlFor="division">Division of interest</label>
        <select id="division" name="division" defaultValue="AI Software">
          <option>AI Software</option>
          <option>CNC Manufacturing</option>
          <option>Both</option>
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="description">Project description</label>
        <textarea id="description" name="description" required maxLength={5000}></textarea>
      </div>
      {state.error && (
        <p role="alert" className="form-message show error">
          {state.error}
        </p>
      )}
      <button type="submit" disabled={pending}>
        {pending ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
}
