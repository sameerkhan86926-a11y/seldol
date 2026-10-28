"use client";

import { useEffect, useState, type FormEvent } from "react";
import { supabase } from "@/lib/supabase";


type AuthMode = "login" | "signup";

export default function LoginPage() {
  const [mode, setMode] = useState<AuthMode>("login");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    let active = true;

    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();

      if (active && data.session) {
        setLoggedIn(true);
        setUserEmail(data.session.user.email ?? "");
      }
    };

    void checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!active) return;

      setLoggedIn(Boolean(session));
      setUserEmail(session?.user.email ?? "");
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setMessage("");
    setLoading(true);

    try {
      if (mode === "signup") {
        if (fullName.trim().length < 2) {
          setError("Please enter your full name.");
          return;
        }

        if (password.length < 8) {
          setError("Password must contain at least 8 characters.");
          return;
        }

        const { data, error: signupError } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: {
              full_name: fullName.trim(),
            },
            emailRedirectTo: `${window.location.origin}/seldol/login/`,
          },
        });

        if (signupError) throw signupError;

        if (data.session) {
          setMessage("Your SELDOL account has been created successfully.");
          setLoggedIn(true);
          setUserEmail(data.session.user.email ?? email);
        } else {
          setMessage(
            "Account request submitted! Please check your email for the confirmation link before logging in."
          );
        }
      } else {
        const { data, error: loginError } =
          await supabase.auth.signInWithPassword({
            email: email.trim(),
            password,
          });

        if (loginError) throw loginError;

        setLoggedIn(true);
        setUserEmail(data.user.email ?? email);
        setMessage("Login successful! Welcome to SELDOL.");
      }
    } catch (err: unknown) {
      const text =
        err instanceof Error ? err.message : "Something went wrong.";

      setError(text);
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const { error: logoutError } = await supabase.auth.signOut();

      if (logoutError) throw logoutError;

      setLoggedIn(false);
      setUserEmail("");
      setPassword("");
      setMessage("You have been logged out.");
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Unable to log out."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <div className="auth-glow auth-glow-one" />
      <div className="auth-glow auth-glow-two" />

      <a className="auth-brand" href="/seldol/">
        <span className="brand-mark">S</span>
        <span>SEL<span className="brand-highlight">DOL</span></span>
      </a>

      <section className="auth-card">
        <div className="auth-badge">INDIA&apos;S SECOND-HAND MARKETPLACE</div>

        {loggedIn ? (
          <>
            <div className="auth-symbol">✓</div>
            <h1>You&apos;re signed in!</h1>
            <p className="auth-description">
              Welcome to your SELDOL account.
            </p>

            <div className="account-box">
              <span className="account-label">SIGNED IN AS</span>
              <strong>{userEmail}</strong>
            </div>

            {message && <p className="success-message">{message}</p>}
            {error && <p className="error-message">{error}</p>}

            <a className="primary-button" href="/seldol/">
              Explore SELDOL
            </a>

            <button
              className="secondary-button"
              onClick={handleLogout}
              disabled={loading}
            >
              {loading ? "Logging out..." : "Log out"}
            </button>
          </>
        ) : (
          <>
            <h1>
              {mode === "login" ? (
                <>Welcome <span>back.</span></>
              ) : (
                <>Join <span>SELDOL.</span></>
              )}
            </h1>

            <p className="auth-description">
              {mode === "login"
                ? "Sign in to continue your buying and selling journey."
                : "Create your account and get started with SELDOL."}
            </p>

            <div className="auth-tabs">
              <button
                type="button"
                className={mode === "login" ? "active" : ""}
                onClick={() => {
                  setMode("login");
                  setError("");
                  setMessage("");
                }}
              >
                Log in
              </button>

              <button
                type="button"
                className={mode === "signup" ? "active" : ""}
                onClick={() => {
                  setMode("signup");
                  setError("");
                  setMessage("");
                }}
              >
                Create account
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              {mode === "signup" && (
                <label className="input-label">
                  Full name
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    value={fullName}
                    onChange={(event) => setFullName(event.target.value)}
                    autoComplete="name"
                    minLength={2}
                    required
                  />
                </label>
              )}

              <label className="input-label">
                Email address
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  autoComplete="email"
                  required
                />
              </label>

              <label className="input-label">
                Password
                <input
                  type="password"
                  placeholder="At least 8 characters"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete={
                    mode === "login" ? "current-password" : "new-password"
                  }
                  minLength={8}
                  required
                />
              </label>

              {error && <p className="error-message">{error}</p>}
              {message && <p className="success-message">{message}</p>}

              <button
                className="primary-button"
                type="submit"
                disabled={loading}
              >
                {loading
                  ? "Please wait..."
                  : mode === "login"
                    ? "Log in to SELDOL"
                    : "Create my account"}
              </button>
            </form>

            <p className="auth-switch">
              {mode === "login"
                ? "New to SELDOL?"
                : "Already have an account?"}{" "}
              <button
                type="button"
                onClick={() => {
                  setMode(mode === "login" ? "signup" : "login");
                  setError("");
                  setMessage("");
                }}
              >
                {mode === "login" ? "Sign up" : "Log in"}
              </button>
            </p>
          </>
        )}

        <div className="auth-security">
          <span>●</span> Secure authentication powered by Supabase
        </div>
      </section>

      <footer className="auth-footer">
        SELDOL © {new Date().getFullYear()} · Buy Smart. Sell Easy.
      </footer>

      <style jsx>{`
        .auth-page {
          min-height: 100vh;
          padding: 28px 18px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          background: #0b1020;
          color: #f8fafc;
          font-family: Arial, Helvetica, sans-serif;
        }

        .auth-glow {
          position: absolute;
          width: 300px;
          height: 300px;
          border-radius: 50%;
          filter: blur(100px);
          opacity: 0.22;
          pointer-events: none;
        }

        .auth-glow-one {
          background: #7c3aed;
          top: -100px;
          left: -100px;
        }

        .auth-glow-two {
          background: #0891b2;
          right: -100px;
          bottom: -100px;
        }

        .auth-brand {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 25px;
          font-weight: 900;
          letter-spacing: -1px;
          margin-bottom: 30px;
          z-index: 1;
        }

        .brand-mark {
          display: grid;
          place-items: center;
          width: 42px;
          height: 42px;
          border-radius: 13px;
          background: linear-gradient(135deg, #a78bfa, #06b6d4);
          color: white;
          box-shadow: 0 8px 28px #7c3aed44;
        }

        .brand-highlight,
        h1 span {
          color: #a78bfa;
        }

        .auth-card {
          width: 100%;
          max-width: 440px;
          padding: 34px;
          border: 1px solid #ffffff18;
          border-radius: 24px;
          background: #141a2b;
          box-shadow: 0 25px 80px #00000045;
          z-index: 1;
        }

        .auth-badge {
          display: inline-block;
          padding: 7px 10px;
          border-radius: 7px;
          background: #8b5cf61a;
          color: #c4b5fd;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 1px;
        }

        h1 {
          margin: 22px 0 9px;
          font-size: clamp(30px, 8vw, 38px);
          letter-spacing: -1.5px;
        }

        .auth-description {
          margin: 0 0 25px;
          color: #a8b1c5;
          font-size: 14px;
          line-height: 1.7;
        }

        .auth-tabs {
          display: grid;
          grid-template-columns: 1fr 1fr;
          padding: 5px;
          gap: 5px;
          border-radius: 12px;
          background: #0b1020;
          margin-bottom: 24px;
        }

        .auth-tabs button {
          padding: 12px 5px;
          border: 0;
          border-radius: 9px;
          background: transparent;
          color: #a8b1c5;
          font-size: 13px;
          font-weight: 700;
        }

        .auth-tabs button.active {
          background: #252c42;
          color: white;
          box-shadow: 0 2px 8px #00000025;
        }

        form {
          display: flex;
          flex-direction: column;
          gap: 17px;
        }

        .input-label {
          display: flex;
          flex-direction: column;
          gap: 9px;
          color: #e2e8f0;
          font-size: 12px;
          font-weight: 700;
        }

        .input-label input {
          width: 100%;
          min-width: 0;
          padding: 14px;
          border: 1px solid #30384d;
          border-radius: 11px;
          background: #0b1020;
          color: white;
          font-size: 14px;
          outline: none;
        }

        .input-label input:focus {
          border-color: #a78bfa;
          box-shadow: 0 0 0 3px #a78bfa1c;
        }

        .input-label input::placeholder {
          color: #68738b;
        }

        .primary-button,
        .secondary-button {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          min-height: 48px;
          padding: 13px;
          border-radius: 11px;
          font-size: 14px;
          font-weight: 800;
          text-align: center;
          cursor: pointer;
        }

        .primary-button {
          margin-top: 3px;
          border: 0;
          background: linear-gradient(100deg, #8b5cf6, #6366f1);
          color: white;
          box-shadow: 0 8px 22px #7c3aed30;
        }

        .primary-button:hover {
          filter: brightness(1.1);
        }

        .primary-button:disabled,
        .secondary-button:disabled {
          opacity: 0.6;
          cursor: wait;
        }

        .secondary-button {
          margin-top: 12px;
          border: 1px solid #394158;
          background: transparent;
          color: white;
        }

        .auth-switch {
          margin: 22px 0 0;
          color: #a8b1c5;
          font-size: 13px;
          text-align: center;
        }

        .auth-switch button {
          border: 0;
          background: transparent;
          color: #c4b5fd;
          font-weight: 800;
        }

        .error-message,
        .success-message {
          padding: 11px 12px;
          border-radius: 9px;
          font-size: 12px;
          line-height: 1.6;
          overflow-wrap: anywhere;
        }

        .error-message {
          background: #ef44441a;
          color: #fca5a5;
        }

        .success-message {
          background: #22c55e18;
          color: #86efac;
        }

        .account-box {
          display: flex;
          flex-direction: column;
          gap: 8px;
          padding: 16px;
          margin: 22px 0;
          border: 1px solid #30384d;
          border-radius: 12px;
          background: #0b1020;
          overflow-wrap: anywhere;
        }

        .account-label {
          color: #94a3b8;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 1px;
        }

        .account-box strong {
          font-size: 14px;
        }

        .auth-symbol {
          display: grid;
          place-items: center;
          width: 54px;
          height: 54px;
          margin-top: 24px;
          border-radius: 17px;
          background: #22c55e20;
          color: #86efac;
          font-size: 27px;
        }

        .auth-security {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 7px;
          margin-top: 25px;
          color: #7f8ba4;
          font-size: 10px;
        }

        .auth-security span {
          color: #34d399;
          font-size: 9px;
        }

        .auth-footer {
          margin-top: 25px;
          color: #778198;
          font-size: 11px;
          text-align: center;
          z-index: 1;
        }

        @media (max-width: 480px) {
          .auth-card {
            padding: 25px 20px;
          }
        }
      `}</style>
    </main>
  );
}
