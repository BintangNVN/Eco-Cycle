import { FormEvent, useId, useState } from "react";
import "../styles/css/forgot-password.css";
import AuthLayout, { AuthEcoLogo } from "../components/AuthLayout";
import PasswordField from "../components/PasswordField";
import { resetPassword } from "../services/api";

type ForgotPasswordProps = {
  onBackToLogin: () => void;
};

export default function ForgotPassword({ onBackToLogin }: ForgotPasswordProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const emailId = useId();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError(null);
    setLoading(true);
    try {
      // Di app ini, halaman "lupa password" digunakan sebagai "reset password"
      // (email + password baru).
      await resetPassword({ email, password });
      onBackToLogin();
    } catch (err: any) {
      const message =
        err?.response?.data?.message || err?.message || "Reset password gagal";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <AuthEcoLogo />
      <h1 className="auth-title">Reset Your Password</h1>
      <p className="auth-subtitle">
        Enter your email to receive a password reset link.
      </p>

      <form className="auth-form" onSubmit={handleSubmit}>
        <label className="auth-field" htmlFor={emailId}>
          <span className="auth-field__label">Email</span>
          <input
            id={emailId}
            className="auth-field__input"
            type="email"
            placeholder="reyla@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
        </label>

        <button className="auth-btn-primary" type="submit">
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>

      {error && <p className="auth-error">{error}</p>}
    </AuthLayout>
  );
}
