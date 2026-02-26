/*
  Login.jsx
  ---------
  Premium glassmorphism login page with a split-panel layout.

  Left panel:  Branding area with Selvam logo, tagline, and feature highlights.
  Right panel: Glassmorphism card with email/password form.

  On successful login the user is redirected to /dashboard.
*/

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import logo from "../assets/logo.jpeg";

export default function Login() {
  const navigate = useNavigate();
  const { login, loading, error } = useAuth();

  /* -- local form state -- */
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState("");

  /**
   * Handle form submission - validate inputs, call the login
   * function from AuthContext, and redirect on success.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!email || !password) {
      setFormError("Email and password are required");
      return;
    }

    const result = await login(email.trim(), password);
    if (result.ok) {
      navigate("/dashboard");
    }
  };

  return (
    <div className="auth-page">
      {/* -- Decorative background orbs -- */}
      <div className="auth-orb auth-orb--1" aria-hidden="true" />
      <div className="auth-orb auth-orb--2" aria-hidden="true" />

      <div className="auth-container">
        {/* -- Left: Branding panel -- */}
        <div className="auth-brand">
          <Link to="/" className="auth-brand__logo-link">
            <img className="auth-brand__logo" src={logo} alt="Selvam logo" />
          </Link>
          <h1 className="auth-brand__title">Selvam</h1>
          <p className="auth-brand__tagline">
            Your family's unified financial command centre.
          </p>
          <ul className="auth-brand__features">
            <li>
              <span className="auth-brand__dot" />
              Track expenses across 8+ categories
            </li>
            <li>
              <span className="auth-brand__dot" />
              Monitor assets, liabilities & net worth
            </li>
            <li>
              <span className="auth-brand__dot" />
              Beautiful visual analytics & charts
            </li>
          </ul>
        </div>

        {/* -- Right: Form card -- */}
        <div className="auth-card">
          <h2>Welcome back</h2>
          <p className="auth-card__sub">Sign in to your account</p>

          {/* Error alert */}
          {(formError || error) && (
            <div className="alert">{formError || error}</div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            {/* Email field */}
            <div className="auth-field">
              <label htmlFor="login-email">Email</label>
              <div className="auth-input-wrap">
                <svg className="auth-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                />
              </div>
            </div>

            {/* Password field */}
            <div className="auth-field">
              <label htmlFor="login-password">Password</label>
              <div className="auth-input-wrap">
                <svg className="auth-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <input
                  id="login-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                />
              </div>
            </div>

            {/* Submit */}
            <button className="auth-submit" type="submit" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {/* Footer link */}
          <p className="auth-card__footer">
            Don't have an account?{" "}
            <Link to="/register" className="auth-link">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
