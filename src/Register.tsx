import { FormEvent, useId, useState } from "react";
import "./css/register.css";
import { register } from "./api";
import AuthLayout, { AuthEcoLogo, GoogleIcon } from "./AuthLayout";
import PasswordField from "./PasswordField";

type RegisterProps = {
  onSwitchToLogin: () => void;
  onRegisterSuccess: () => void;
};

export default function Register({
  onSwitchToLogin,
  onRegisterSuccess,
}: RegisterProps) {
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const nameId = useId();
  const emailId = useId();
  const phoneId = useId();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      await register({
        name,
        email,
        password,
        phoneNumber,
      });

      alert("Register berhasil, silakan login");
      onRegisterSuccess();
    } catch (err: any) {
      const message =
        err?.response?.data?.data?.error ||
        err?.response?.data?.message ||
        "Register gagal";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout variant="split">
      <AuthEcoLogo />

      <h1 className="auth-title">Start Your Eco Journey Today</h1>
      <p className="auth-subtitle">
        Join our community to buy, sell, or share reusable items and make a positive impact on the environment.
      </p>

      <form className="auth-form" onSubmit={handleSubmit}>
        {/* NAME */}
        <label className="auth-field" htmlFor={nameId}>
          <span className="auth-field__label">Name</span>
          <input
            id={nameId}
            className="auth-field__input"
            placeholder="Bintang"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>

        {/* PHONE */}
        <label className="auth-field" htmlFor={phoneId}>
          <span className="auth-field__label">Phone Number</span>
          <input
            id={phoneId}
            className="auth-field__input"
            placeholder="08123456789"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
          />
        </label>

        {/* EMAIL */}
        <label className="auth-field" htmlFor={emailId}>
          <span className="auth-field__label">Email</span>
          <input
            id={emailId}
            type="email"
            className="auth-field__input"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>

        {/* PASSWORD */}
        <PasswordField
          label="Password"
          value={password}
          onChange={setPassword}
        />

        {/* CONFIRM */}
        <PasswordField
          label="Confirm Password"
          value={confirmPassword}
          onChange={setConfirmPassword}
        />

        <button className="auth-btn-primary" disabled={loading}>
          {loading ? "Signing up..." : "Sign Up"}
        </button>

        <button type="button" className="auth-btn-google">
          <GoogleIcon />
          Sign in with Google
        </button>

        {error && <p className="auth-error">{error}</p>}
      </form>

      <p className="auth-footer-text">
        Already have an account?{" "}
        <button onClick={onSwitchToLogin} className="auth-link-inline">
          Sign in
        </button>
      </p>
    </AuthLayout>
  );
}