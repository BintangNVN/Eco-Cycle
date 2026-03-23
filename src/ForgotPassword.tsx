import { FormEvent, useId, useState } from "react";
import "./App.css";
import AuthLayout, { AuthEcoLogo } from "./AuthLayout";
import PasswordField from "./PasswordField";

type ForgotPasswordProps = {
  onBackToLogin: () => void;
};

export default function ForgotPassword({ onBackToLogin }: ForgotPasswordProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const emailId = useId();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: reset password API
    console.log({ email, password });
  };

  return (
    <AuthLayout pageLabel="Forgot Password">
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

        <PasswordField
          label="Password"
          value={password}
          onChange={setPassword}
          required
          minLength={8}
          autoComplete="new-password"
        />

        <button className="auth-btn-primary" type="submit">
          Reset Password
        </button>
      </form>

      <p className="auth-footer-text">
        <button type="button" className="auth-link-inline" onClick={onBackToLogin}>
          Sign in
        </button>
      </p>
    </AuthLayout>
  );
}
