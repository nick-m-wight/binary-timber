import LoginForm from "./login-form";

export default function LoginPage() {
  return (
    <main style={{ maxWidth: 420, margin: "6rem auto", padding: "0 1.5rem" }}>
      <h1>Sign in</h1>
      <LoginForm />
    </main>
  );
}
