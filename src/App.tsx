import { useEffect, useState } from "react";
import "./App.css";
import Dashboard from "./Dashboard";
import Landing from "./Landing";
import ForgotPassword from "./ForgotPassword";
import Login from "./Login";
import Register from "./Register";

type Page = "landing" | "login" | "register" | "forgot-password" | "dashboard";

function normalizePath(pathname: string): string {
  if (!pathname) return "/";
  const trimmed = pathname.replace(/\/+$/, "");
  return trimmed === "" ? "/" : trimmed;
}

function pageFromPath(pathname: string): Page {
  const path = normalizePath(pathname);
  if (path === "/login") return "login";
  if (path === "/register") return "register";
  if (path === "/forgot-password") return "forgot-password";
  if (path === "/dashboard") return "dashboard";
  return "landing";
}

function pathFromPage(page: Page): string {
  if (page === "login") return "/login";
  if (page === "register") return "/register";
  if (page === "forgot-password") return "/forgot-password";
  if (page === "dashboard") return "/dashboard";
  return "/";
}

function App() {
  const [page, setPage] = useState<Page>(() => pageFromPath(window.location.pathname));
  const [token, setToken] = useState<string | null>(null);

  const navigateTo = (nextPage: Page, replace = false) => {
    const nextPath = pathFromPage(nextPage);
    setPage(nextPage);

    if (window.location.pathname !== nextPath) {
      if (replace) {
        window.history.replaceState(null, "", nextPath);
      } else {
        window.history.pushState(null, "", nextPath);
      }
    }
  };

  useEffect(() => {
    const savedToken = window.localStorage.getItem("auth_token");

    if (savedToken) {
      setToken(savedToken);
      navigateTo("dashboard", true);
      return;
    }

    const initialPage = pageFromPath(window.location.pathname);
    if (initialPage === "dashboard") {
      navigateTo("login", true);
      return;
    }

    const canonicalPath = pathFromPage(initialPage);
    if (window.location.pathname !== canonicalPath) {
      window.history.replaceState(null, "", canonicalPath);
    }
  }, []);

  useEffect(() => {
    const onPopState = () => {
      const nextPage = pageFromPath(window.location.pathname);

      if (nextPage === "dashboard" && !token) {
        navigateTo("login", true);
        return;
      }

      setPage(nextPage);
    };

    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [token]);

  const handleLoginSuccess = (authToken: string) => {
    setToken(authToken);
    window.localStorage.setItem("auth_token", authToken);
    navigateTo("dashboard");
  };

  const handleLogout = () => {
    setToken(null);
    window.localStorage.removeItem("auth_token");
    navigateTo("login");
  };

  return page === "landing" ? (
    <Landing
      onNavigateToLogin={() => navigateTo("login")}
      onNavigateToRegister={() => navigateTo("register")}
    />
  ) : page === "login" ? (
    <Login
      onSwitchToRegister={() => navigateTo("register")}
      onLoginSuccess={handleLoginSuccess}
      onForgotPassword={() => navigateTo("forgot-password")}
    />
  ) : page === "forgot-password" ? (
    <ForgotPassword onBackToLogin={() => navigateTo("login")} />
  ) : page === "register" ? (
    <Register onSwitchToLogin={() => navigateTo("login")} />
  ) : (
    <Dashboard token={token ?? ""} onLogout={handleLogout} />
  );
}

export default App;
