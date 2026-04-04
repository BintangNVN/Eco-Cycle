import { FormEvent, useId, useState } from "react";
import "./css/register.css";
import { login, register } from "./api";
import AuthLayout, { AuthEcoLogo, GoogleIcon } from "./AuthLayout";
import PasswordField from "./PasswordField";

type RegisterProps = {
  onSwitchToLogin: () => void;
  onRegisterSuccess: () => void;
};

export default function Register({ onSwitchToLogin, onRegisterSuccess }: RegisterProps) {
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const nameId = useId();
  const emailId = useId();
  const phoneId = useId();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    // validasi password
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      // ✅ REGISTER SESUAI API
      await register({
        name,
        email,
        password,
        phoneNumber,
      });

      // tampilkan popup sukses dan arahkan ke login
      window.alert("Pendaftaran berhasil. Silakan login di halaman Login.");
      setSuccess("Pendaftaran berhasil. Silakan login.");
      setError(null);
      onRegisterSuccess();
    } catch (err: any) {
      console.log(err.response?.data); // debug

      const message =
        err?.response?.data?.data?.error ||
        err?.response?.data?.message ||
        err?.message ||
        "Register gagal. Silakan coba lagi.";

      setError(message);
    } finally {
      setLoading(false);
    }
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
        {/* ✅ NAME */}
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

        {/* ✅ PHONE NUMBER */}
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
            className="auth-field__input"
            type="email"
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
          required
          minLength={6}
          autoComplete="new-password"
        />

        {/* CONFIRM PASSWORD */}
        <PasswordField
          label="Confirm Password"
          value={confirmPassword}
          onChange={setConfirmPassword}
          required
          minLength={6}
          autoComplete="new-password"
        />

        <button className="auth-btn-primary" type="submit" disabled={loading}>
          {loading ? "Signing up…" : "Sign Up"}
        </button>

        <button type="button" className="auth-btn-google">
          <GoogleIcon />
          Sign in with Google
        </button>

        {success && <p className="auth-success">{success}</p>}
        {error && <p className="auth-error">{error}</p>}
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