import ForgotPasswordForm from "./forgot-password-form";

export default function ForgotPasswordPage() {
  return (
    <main className="auth-card">
      <h1>Reset your password</h1>
      <p>Enter your email and we&apos;ll send you a reset link.</p>
      <ForgotPasswordForm />
    </main>
  );
}
