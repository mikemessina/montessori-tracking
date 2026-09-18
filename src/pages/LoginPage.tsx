import { useState, type FormEvent } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

function friendlyAuthError(error: unknown): string {
  if (!(error instanceof Error)) return "Sign-in failed. Please try again.";

  if (error.message.includes("auth/invalid-credential")) {
    return "The email or password is incorrect.";
  }
  if (error.message.includes("auth/invalid-email")) {
    return "Enter a valid email address.";
  }
  if (error.message.includes("auth/operation-not-allowed")) {
    return "Email/password sign-in has not been enabled in Firebase yet.";
  }

  return "Sign-in failed. Check your connection and try again.";
}

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
    } catch (submitError) {
      setError(friendlyAuthError(submitError));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="login-page">
      <form className="login-card" onSubmit={handleSubmit}>
        <div className="login-mark" aria-hidden="true">M</div>
        <h1>Montessori Tracking</h1>
        <p>Sign in with your teacher account to access classroom records.</p>

        <label>
          Email
          <input
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </label>
        <label>
          Password
          <input
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            minLength={6}
            required
          />
        </label>

        {error && <p className="form-error" role="alert">{error}</p>}

        <button className="btn-primary" type="submit" disabled={submitting}>
          {submitting ? "Please wait…" : "Sign In"}
        </button>
      </form>
    </main>
  );
}
