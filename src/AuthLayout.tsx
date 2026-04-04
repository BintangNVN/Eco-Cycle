import type { ReactNode } from "react";

type AuthLayoutProps = {
  pageLabel?: string;
  children: ReactNode;
};

/** Shared shell: clean white background + split card (visual + form). */
export default function AuthLayout({ pageLabel, children }: AuthLayoutProps) {
  return (
    <div className="auth-screen">
      <div className="auth-screen__inner">
        {pageLabel ? <p className="auth-page-label">{pageLabel}</p> : null}
        <div className="auth-card">
          <div className="auth-card__visual" aria-hidden="true" />
          <div className="auth-card__panel">{children}</div>
        </div>
      </div>
    </div>
  );
}

export function AuthEcoLogo() {
  return (
    <div className="auth-panel-top" aria-hidden="true">
      <svg
        className="auth-eco-logo"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <circle cx="20" cy="20" r="19" stroke="#134e4a" strokeWidth="2" fill="none" />
        <path
          d="M20 8c-4.5 0-8 3.2-8 7.5 0 2.8 1.5 5.2 3.8 6.5-.2-1.8.8-3.5 2.5-4.2 1.2-.5 2.5-.3 3.5.4.9-.9 2.3-1.2 3.6-.6 1.8.8 2.8 2.7 2.5 4.6 2.4-1.3 4.1-3.8 4.1-6.7C32 11.2 28.4 8 24 8h-4z"
          fill="#134e4a"
        />
        <path
          d="M14 28c1.2 2.2 3.5 3.6 6 3.6 2.2 0 4.2-1 5.4-2.6-.8.2-1.7 0-2.4-.4-.9-.5-1.4-1.4-1.3-2.4-.9.6-2.1.7-3.1.2-1.4-.7-2.1-2.3-1.7-3.8C15.6 24.5 14 26.1 14 28z"
          fill="#134e4a"
          opacity="0.85"
        />
      </svg>
    </div>
  );
}

export function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden>
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"
      />
      <path
        fill="#FBBC05"
        d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707s.102-1.167.282-1.707V4.961H.957C.348 6.175 0 7.55 0 9s.348 2.825.957 4.039l3.007-2.332z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.961L3.964 7.293C4.672 5.163 6.656 3.58 9 3.58z"
      />
    </svg>
  );
}
