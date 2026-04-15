import { FormEvent, useId, useState } from "react";
import "../styles/css/login.css";
import { login } from "../services/api/api";
import AuthLayout, { AuthEcoLogo, GoogleIcon } from "../components/AuthLayout";
import PasswordField from "../components/PasswordField";

type LoginProps = {
  onSwitchToRegister: () => void;
  onLoginSuccess: (token: string) => void;
  onForgotPassword: () => void;
};

export default function Login({
  onSwitchToRegister,
  onLoginSuccess,
  onForgotPassword,
}: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const emailId = useId();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await login(email, password);
      
      // TAMBAHKAN BARIS INI UNTUK MENGINTIP DATA DARI BACKEND
      console.log("CEK DATA LOGIN:", response.data); 
      
      const token = response.data?.data?.token || response.data?.token;
      // ...
      const user = response.data?.data?.user; // <-- Menangkap data user

      if (!token) {
        throw new Error("Token tidak ditemukan dalam response API");
      }

      // Simpan Token DAN ID User sesuai pilihan "Remember me"
      if (remember) {
        localStorage.setItem("auth_token", token);
        if (user?.id) localStorage.setItem("user_id", user.id); // Simpan ID
        
        sessionStorage.removeItem("auth_token");
        sessionStorage.removeItem("user_id"); // Bersihkan session
      } else {
        sessionStorage.setItem("auth_token", token);
        if (user?.id) sessionStorage.setItem("user_id", user.id); // Simpan ID
        
        localStorage.removeItem("auth_token");
        localStorage.removeItem("user_id"); // Bersihkan local
      }

      onLoginSuccess(token);
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Login gagal";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout variant="split">
      <AuthEcoLogo />
      <h1 className="auth-title">Welcome Back to Your Eco Journey</h1>
      <p className="auth-subtitle">
        Sign in to continue exploring, trading, and making a positive impact.
      </p>

      <form className="auth-form" onSubmit={handleSubmit}>
        <label className="auth-field" htmlFor={emailId}>
          <span className="auth-field__label">Email</span>
          <input
            id={emailId}
            className="auth-field__input"
            type="email"
            placeholder="administrator@gmail.com"
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
          autoComplete="current-password"
        />

        <div className="auth-form-row">
          <label className="auth-checkbox">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
            />
            <span>Remember me</span>
          </label>

          <button
            type="button"
            className="auth-link"
            onClick={onForgotPassword}
          >
            Forgot Password
          </button>
        </div>

        {error && <p className="auth-error">{error}</p>}

        <button
          className="auth-btn-primary"
          type="submit"
          disabled={loading}
        >
          {loading ? "Signing in…" : "Sign In"}
        </button>

        <button type="button" className="auth-btn-google">
          <GoogleIcon />
          Sign in with Google
        </button>
      </form>

      <p className="auth-footer-text">
        Don&apos;t have an account?{" "}
        <button
          type="button"
          className="auth-link-inline"
          onClick={onSwitchToRegister}
        >
          Sign Up
        </button>
      </p>
    </AuthLayout>
  );
}