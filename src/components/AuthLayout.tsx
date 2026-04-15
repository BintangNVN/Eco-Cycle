import React from "react";
import LogoImg from "../assets/images/logo.png"
import AuthImg from "../assets/images/auth-image.png"

type AuthLayoutProps = {
  children: React.ReactNode;
  pageLabel?: string;
  variant?: "split" | "full";
};

export default function AuthLayout({
  children,
  pageLabel,
  variant = "split",
}: AuthLayoutProps) {
  return (
    <div className="auth-screen">
      <div className="auth-screen__inner">
        {pageLabel && <p className="auth-page-label">{pageLabel}</p>}

        <div className={`auth-card ${variant === "full" ? "auth-card--full" : ""}`}>
          
          {/* Image */}
          {variant === "split" && (
            <div className="auth-card__visual" style={{ padding: '24px', background: '#fff' }}>
              <img 
                src={AuthImg}
                alt="Register Visual" 
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'cover', 
                  borderRadius: '20px' 
                }} 
              />
            </div>
          )}
          
          {/* Form */}
          <div className="auth-card__panel">{children}</div>
        </div>
      </div>
    </div>
  );
}

/* ===== LOGO ECO ===== */
export function AuthEcoLogo() {
  return (
    <div className="auth-panel-top flex justify-start">
      <img 
        src={LogoImg} 
        alt="EcoCycle Logo" 
        style={{ width: '80px', height: 'auto', minWidth: 'unset', maxWidth: 'none' }}
      />
    </div>
  );
}

/* ===== GOOGLE ICON ===== */
export function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48">
      <path
        fill="#EA4335"
        d="M24 9.5c3.54 0 6.73 1.22 9.24 3.6l6.9-6.9C35.86 2.36 30.31 0 24 0 14.82 0 6.78 5.64 2.82 13.66l8.02 6.23C12.94 13.06 17.98 9.5 24 9.5z"
      />
      <path
        fill="#4285F4"
        d="M46.1 24.5c0-1.64-.15-3.21-.42-4.73H24v9h12.4c-.53 2.84-2.13 5.25-4.53 6.86l7.02 5.46C43.98 36.94 46.1 31.2 46.1 24.5z"
      />
      <path
        fill="#FBBC05"
        d="M10.84 28.89A14.49 14.49 0 0 1 9.5 24c0-1.7.29-3.34.82-4.89l-8.02-6.23A23.93 23.93 0 0 0 0 24c0 3.84.92 7.46 2.56 10.66l8.28-5.77z"
      />
      <path
        fill="#34A853"
        d="M24 48c6.48 0 11.92-2.14 15.9-5.81l-7.02-5.46c-2 1.34-4.56 2.13-8.88 2.13-6.02 0-11.06-3.56-13.16-8.69l-8.28 5.77C6.78 42.36 14.82 48 24 48z"
      />
    </svg>
  );
}