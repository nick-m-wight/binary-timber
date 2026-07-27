"use client";

import Link from "next/link";
import { useActionState } from "react";
import { login, type AuthActionState } from "../actions";

const initialState: AuthActionState = { error: null };

export default function LoginForm() {
  const [state, formAction, pending] = useActionState(login, initialState);

  return (
    <form action={formAction}>
      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input type="email" id="email" name="email" required autoComplete="email" />
      </div>
      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          required
          autoComplete="current-password"
        />
      </div>
      <p className="auth-link">
        <Link href="/auth/forgot-password">Forgot password?</Link>
      </p>
      {state.error && (
        <p role="alert" className="form-message show error">
          {state.error}
        </p>
      )}
      <button type="submit" disabled={pending}>
        {pending ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}
