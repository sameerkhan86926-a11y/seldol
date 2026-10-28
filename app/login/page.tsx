"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { ShoppingBag, Mail, Phone } from "lucide-react";
import { supabase } from "@/lib/supabase";

type AuthMode = "login" | "signup";
type LoginMethod = "email" | "phone";

export default function LoginPage() {
  const [mode, setMode] = useState<AuthMode>("login");
  const [loginMethod, setLoginMethod] = useState<LoginMethod>("email");

  // Form Fields
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  // Status
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [userIdentifier, setUserIdentifier] = useState("");

  useEffect(() => {
    let active = true;

    const checkSession = async () => {
      try {
        const { data, error: sessionErr } = await supabase.auth.getSession();
        if (sessionErr) throw sessionErr;

        if (active && data?.session?.user) {
          const u = data.session.user;
          setLoggedIn(true);
          setUserIdentifier(
            u.user_metadata?.full_name ||
            u.email ||
            u.phone ||
            "User"
          );
        }
      } catch (err: unknown) {
        console.error("Session check failed:", err);
      }
    };

    void checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!active) return;
      if (session?.user) {
        const u = session.user;
        setLoggedIn(true);
        setUserIdentifier(
          u.user_metadata?.full_name ||
          u.email ||
          u.phone ||
          "User"
        );
      } else {
        setLoggedIn(false);
        setUserIdentifier("");
      }
    });

    return () => {
      active = false;
      subscription?.unsubscribe();
    };
  }, []);

  const formatPhoneNumber = (raw: string) => {
    const digits = raw.replace(/\D/g, "");
    if (digits.length === 10) return `+91${digits}`;
    if (digits.length === 12 && digits.startsWith("91")) return `+${digits}`;
    return digits.startsWith("+") ? digits : `+${digits}`;
  };

  // Google OAuth Handler
  async function handleGoogleLogin() {
    setError("");
    setMessage("");
    setGoogleLoading(true);

    try {
      const redirectUrl =
        typeof window !== "undefined"
          ? `${window.location.origin}/seldol/login/`
          : undefined;

      const { error: googleError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      });

      if (googleError) throw googleError;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Google sign-in failed.");
      setGoogleLoading(false);
    }
  }

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

        const cleanPhone = phone.replace(/\D/g, "");
        if (cleanPhone.length < 10) {
          setError("Please enter a valid 10-digit mobile number.");
          return;
        }

        if (password.length < 8) {
          setError("Password must contain at least 8 characters.");
          return;
        }

        const redirectUrl =
          typeof window !== "undefined"
            ? `${window.location.origin}/seldol/login/`
            : undefined;

        const { data, error: signupError } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: {
              full_name: fullName.trim(),
              phone: cleanPhone,
            },
            emailRedirectTo: redirectUrl,
          },
        });

        if (signupError) throw signupError;

        if (data.session) {
          setMessage("Your SELDOL account has been created successfully!");
          setLoggedIn(true);
          setUserIdentifier(data.session.user.email ?? email);
        } else {
          setMessage("Account created! Please check your email inbox to verify your account.");
        }
      } else {
        if (loginMethod === "email") {
          const { data, error: loginError } = await supabase.auth.signInWithPassword({
            email: email.trim(),
            password,
          });

          if (loginError) throw loginError;

          setLoggedIn(true);
          setUserIdentifier(data.user?.email ?? email);
          setMessage("Login successful! Welcome to SELDOL.");
        } else {
          const formattedPhone = formatPhoneNumber(phone);

          if (!otpSent) {
            const { error: otpError } = await supabase.auth.signInWithOtp({
              phone: formattedPhone,
            });

            if (otpError) throw otpError;

            setOtpSent(true);
            setMessage(`OTP sent to ${formattedPhone}. Please check your messages.`);
          } else {
            if (otp.trim().length < 6) {
              setError("Please enter the 6-digit OTP code.");
              return;
            }

            const { data, error: verifyError } = await supabase.auth.verifyOtp({
              phone: formattedPhone,
              token: otp.trim(),
              type: "sms",
            });

            if (verifyError) throw verifyError;

            setLoggedIn(true);
            setUserIdentifier(data.user?.phone ?? formattedPhone);
            setMessage("Login successful with mobile number!");
          }
        }
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Authentication failed.");
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
      setUserIdentifier("");
      setPassword("");
      setOtp("");
      setOtpSent(false);
      setMessage("You have been logged out.");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unable to log out.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <div className="auth-glow auth-glow-one" />
      <div className="auth-glow auth-glow-two" />

      <Link className="auth-brand" href="/">
        <div className="brand-icon-box">
          <ShoppingBag size={22} strokeWidth={2.4} />
        </div>
        <div className="brand-text-box">
          <span className="brand-name">
            SEL<span className="brand-highlight">DOL</span>
          </span>
          <span className="brand-pro-badge">PRO</span>
        </div>
      </Link>

      <section className="auth-card">
        <div className="auth-badge">INDIA&apos;S SECOND-HAND MARKETPLACE</div>

        {loggedIn ? (
          <>
            <div className="auth-symbol">✓</div>
            <h1>You&apos;re signed in!</h1>
            <p className="auth-description">Welcome to your SELDOL account.</p>

            <div className="account-box">
              <span className="account-label">SIGNED IN AS</span>
              <strong>{userIdentifier}</strong>
            </div>

            {message && <p className="success-message">{message}</p>}
            {error && <p className="error-message">{error}</p>}

            <Link className="primary-button" href="/">
              Explore SELDOL
            </Link>

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
                <>
                  Welcome <span>back.</span>
                </>
              ) : (
                <>
                  Join <span>SELDOL.</span>
                </>
              )}
            </h1>

            <p className="auth-description">
              {mode === "login"
                ? "Sign in with Google, Email or Mobile Number."
                : "Create an account with Google, Email or Mobile."}
            </p>

            {/* Google Quick Sign-In Button */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={googleLoading || loading}
              className="google-button"
            >
              <svg className="google-icon" viewBox="0 0 24 24" width="18" height="18">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>{googleLoading ? "Connecting Google..." : "Continue with Google"}</span>
            </button>

            {/* Divider */}
            <div className="auth-divider">
              <span>OR</span>
            </div>

            {/* Login vs Signup Tabs */}
            <div className="auth-tabs">
              <button
                type="button"
                className={mode === "login" ? "active" : ""}
                onClick={() => {
                  setMode("login");
                  setOtpSent(false);
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
                  setOtpSent(false);
                  setError("");
                  setMessage("");
                }}
              >
                Create account
              </button>
            </div>

            {/* Email vs Phone Toggle (Only for Login) */}
            {mode === "login" && !otpSent && (
              <div className="login-choice-bar">
                <button
                  type="button"
                  className={loginMethod === "email" ? "active" : ""}
                  onClick={() => {
                    setLoginMethod("email");
                    setError("");
                  }}
                >
                  <Mail size={14} /> With Email
                </button>
                <button
                  type="button"
                  className={loginMethod === "phone" ? "active" : ""}
                  onClick={() => {
                    setLoginMethod("phone");
                    setError("");
                  }}
                >
                  <Phone size={14} /> With Phone
                </button>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* --- SIGNUP FIELDS --- */}
              {mode === "signup" && (
                <>
                  <label className="input-label">
                    Full name
                    <input
                      type="text"
                      placeholder="Enter your full name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      autoComplete="name"
                      minLength={2}
                      required
                    />
                  </label>

                  <label className="input-label">
                    Email address
                    <input
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoComplete="email"
                      required
                    />
                  </label>

                  <label className="input-label">
                    Phone number
                    <div className="phone-field">
                      <span className="prefix">+91</span>
                      <input
                        type="tel"
                        maxLength={10}
                        placeholder="10 digit number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                        required
                      />
                    </div>
                  </label>

                  <label className="input-label">
                    Password
                    <input
                      type="password"
                      placeholder="At least 8 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="new-password"
                      minLength={8}
                      required
                    />
                  </label>
                </>
              )}

              {/* --- LOGIN VIA EMAIL --- */}
              {mode === "login" && loginMethod === "email" && (
                <>
                  <label className="input-label">
                    Email address
                    <input
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoComplete="email"
                      required
                    />
                  </label>

                  <label className="input-label">
                    Password
                    <input
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="current-password"
                      required
                    />
                  </label>
                </>
              )}

              {/* --- LOGIN VIA PHONE --- */}
              {mode === "login" && loginMethod === "phone" && (
                <>
                  <label className="input-label">
                    Phone number
                    <div className="phone-field">
                      <span className="prefix">+91</span>
                      <input
                        type="tel"
                        disabled={otpSent}
                        maxLength={10}
                        placeholder="Enter 10-digit number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                        required
                      />
                    </div>
                  </label>

                  {otpSent && (
                    <label className="input-label">
                      Enter 6-Digit OTP
                      <input
                        type="text"
                        maxLength={6}
                        placeholder="••••••"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                        required
                        autoFocus
                      />
                    </label>
                  )}
                </>
              )}

              {error && <p className="error-message">{error}</p>}
              {message && <p className="success-message">{message}</p>}

              <button className="primary-button" type="submit" disabled={loading || googleLoading}>
                {loading
                  ? "Please wait..."
                  : mode === "signup"
                  ? "Create Account"
                  : loginMethod === "phone"
                  ? otpSent
                    ? "Verify OTP & Log In"
                    : "Send Login OTP"
                  : "Log In with Email"}
              </button>

              {mode === "login" && loginMethod === "phone" && otpSent && (
                <button
                  type="button"
                  className="resend-btn"
                  onClick={() => {
                    setOtpSent(false);
                    setOtp("");
                    setError("");
                  }}
                >
                  Change number / Resend OTP
                </button>
              )}
            </form>

            <p className="auth-switch">
              {mode === "login" ? "New to SELDOL?" : "Already have an account?"}{" "}
              <button
                type="button"
                onClick={() => {
                  setMode(mode === "login" ? "signup" : "login");
                  setOtpSent(false);
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

        :global(.auth-brand) {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 28px;
          z-index: 1;
          text-decoration: none;
          color: inherit;
        }

        .brand-icon-box {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 44px;
          height: 44px;
          border-radius: 14px;
          background: linear-gradient(135deg, #7c3aed, #4f46e5);
          color: white;
          box-shadow: 0 8px 24px rgba(124, 58, 237, 0.35);
        }

        .brand-text-box {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .brand-name {
          font-size: 26px;
          font-weight: 900;
          letter-spacing: -1.2px;
          color: #ffffff;
        }

        .brand-highlight,
        h1 span {
          color: #8b5cf6;
        }

        .brand-pro-badge {
          background: rgba(139, 92, 246, 0.2);
          color: #c4b5fd;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.5px;
          padding: 2px 6px;
          border-radius: 5px;
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
          margin: 0 0 20px;
          color: #a8b1c5;
          font-size: 14px;
          line-height: 1.6;
        }

        .google-button {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          width: 100%;
          min-height: 48px;
          padding: 12px;
          border-radius: 12px;
          border: 1px solid #30384d;
          background: #ffffff;
          color: #0f172a;
          font-size: 13px;
          font-weight: 800;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .google-button:hover {
          background: #f1f5f9;
          transform: translateY(-1px);
        }

        .google-button:disabled {
          opacity: 0.6;
          cursor: wait;
        }

        .auth-divider {
          display: flex;
          align-items: center;
          text-align: center;
          margin: 20px 0;
          color: #64748b;
          font-size: 11px;
          font-weight: 800;
        }

        .auth-divider::before,
        .auth-divider::after {
          content: "";
          flex: 1;
          border-bottom: 1px solid #232a3d;
        }

        .auth-divider span {
          padding: 0 10px;
        }

        .auth-tabs {
          display: grid;
          grid-template-columns: 1fr 1fr;
          padding: 4px;
          gap: 4px;
          border-radius: 12px;
          background: #0b1020;
          margin-bottom: 16px;
        }

        .auth-tabs button {
          padding: 10px 5px;
          border: 0;
          border-radius: 9px;
          background: transparent;
          color: #a8b1c5;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
        }

        .auth-tabs button.active {
          background: #252c42;
          color: white;
          box-shadow: 0 2px 8px #00000025;
        }

        .login-choice-bar {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 6px;
          margin-bottom: 18px;
        }

        .login-choice-bar button {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 9px 10px;
          border-radius: 10px;
          border: 1px solid #293249;
          background: transparent;
          color: #94a3b8;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
        }

        .login-choice-bar button.active {
          border-color: #8b5cf6;
          background: rgba(139, 92, 246, 0.15);
          color: #c4b5fd;
        }

        form {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .input-label {
          display: flex;
          flex-direction: column;
          gap: 8px;
          color: #e2e8f0;
          font-size: 12px;
          font-weight: 700;
        }

        .input-label input {
          width: 100%;
          min-width: 0;
          padding: 13px;
          border: 1px solid #30384d;
          border-radius: 11px;
          background: #0b1020;
          color: white;
          font-size: 14px;
          outline: none;
          box-sizing: border-box;
        }

        .input-label input:focus {
          border-color: #a78bfa;
          box-shadow: 0 0 0 3px #a78bfa1c;
        }

        .phone-field {
          display: flex;
          align-items: center;
          border: 1px solid #30384d;
          border-radius: 11px;
          background: #0b1020;
          overflow: hidden;
        }

        .phone-field:focus-within {
          border-color: #a78bfa;
          box-shadow: 0 0 0 3px #a78bfa1c;
        }

        .prefix {
          padding: 0 12px;
          color: #94a3b8;
          font-weight: 800;
          font-size: 13px;
          border-right: 1px solid #30384d;
        }

        .phone-field input {
          border: none !important;
          box-shadow: none !important;
          background: transparent !important;
        }

        .resend-btn {
          margin-top: 4px;
          background: transparent;
          border: 0;
          color: #a78bfa;
          font-size: 11px;
          font-weight: 700;
          cursor: pointer;
        }

        :global(.primary-button),
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
          text-decoration: none;
          box-sizing: border-box;
        }

        :global(.primary-button) {
          margin-top: 5px;
          border: 0;
          background: linear-gradient(100deg, #8b5cf6, #6366f1);
          color: white;
          box-shadow: 0 8px 22px #7c3aed30;
        }

        :global(.primary-button:hover) {
          filter: brightness(1.1);
        }

        :global(.primary-button:disabled),
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
          margin: 20px 0 0;
          color: #a8b1c5;
          font-size: 13px;
          text-align: center;
        }

        .auth-switch button {
          border: 0;
          background: transparent;
          color: #c4b5fd;
          font-weight: 800;
          cursor: pointer;
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
