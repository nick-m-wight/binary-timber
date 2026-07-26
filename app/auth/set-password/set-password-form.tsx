"use client";

import { useActionState } from "react";
import { setPassword, type AuthActionState } from "../actions";

const initialState: AuthActionState = { error: null };

export default function SetPasswordForm() {
  const [state, formAction, pending] = useActionState(setPassword, initialState);

  return (
    <form action={formAction}>
      <div className="form-group">
        <label htmlFor="password">New password</label>
        <input
          type="password"
          id="password"
          name="password"
          required
          minLength={8}
          autoComplete="new-password"
        />
      </div>
      {state.error && (
        <p role="alert" className="form-message show error">
          {state.error}
        </p>
      )}
      <button type="submit" disabled={pending}>
        {pending ? "Saving..." : "Set password"}
      </button>
    </form>
  );
}
