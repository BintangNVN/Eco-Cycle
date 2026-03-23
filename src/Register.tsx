import { FormEvent, useId, useState } from "react";
import "./App.css";
import AuthLayout, { AuthEcoLogo, GoogleIcon } from "./AuthLayout";
import PasswordField from "./PasswordField";

type RegisterProps = {
  onSwitchToLogin: () => void;
};

export default function Register({ onSwitchToLogin }: RegisterProps) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const usernameId = useId();
  const emailId = useId();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    // TODO: Implement register logic
    console.log({ username, email, password });
  };

  return (
    <AuthLayout pageLabel="Sign Up">
      <AuthEcoLogo />
      <h1 className="auth-title">Start Your Eco Journey Today</h1>
      <p className="auth-subtitle">
        Join our community to buy, sell, or share reusable items and make a positive impact on the
        environment.
      </p>

      <form className="auth-form" onSubmit={handleSubmit}>
        <label className="auth-field" htmlFor={usernameId}>
          <span className="auth-field__label">Username</span>
          <input
            id={usernameId}
            className="auth-field__input"
            placeholder="rayhan_kf"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            required
          />
        </label>

        <label className="auth-field" htmlFor={emailId}>
          <span className="auth-field__label">Email</span>
          <input
            id={emailId}
            className="auth-field__input"
            type="email"
            placeholder="Enter your email"
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

        <PasswordField
          label="Confirm Password"
          value={confirmPassword}
          onChange={setConfirmPassword}
          required
          minLength={8}
          autoComplete="new-password"
        />

        <button className="auth-btn-primary" type="submit">
          Sign Up
        </button>

        <button type="button" className="auth-btn-google" onClick={() => {}}>
          <GoogleIcon />
          Sign in with Google
        </button>
      </form>

      <p className="auth-footer-text">
        Already have an account?{" "}
        <button type="button" className="auth-link-inline" onClick={onSwitchToLogin}>
          Sign in
        </button>
      </p>
    </AuthLayout>
  );
}
