/*
  Register.jsx
  -------------
  Premium glassmorphism registration page with a split-panel layout.

  Left panel:  Same branding area as Login (Selvam logo, tagline, highlights).
  Right panel: Glassmorphism card with name/email/password form.

  On successful registration the user is redirected to /dashboard.
*/

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import logo from "../assets/logo.jpeg";

export default function Register() {
  const navigate = useNavigate();
  const { register, loading, error } = useAuth();

  /* ── local form state ── */
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Head");
  const [joinCode, setJoinCode] = useState("");
  const [formError, setFormError] = useState("");

  /**
   * Handle form submission — validate inputs, call the register
   * function from AuthContext, and redirect on success.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!name || !email || !password) {
      setFormError("Basic fields are required");
      return;
    }

    if (role === "Member" && !joinCode.trim()) {
      setFormError("Join code is required to become a member");
      return;
    }

    const result = await register(name.trim(), email.trim(), password, role, joinCode.trim());
    if (result.ok) {
      navigate("/dashboard");
    }
  };

  return (
    <div className="auth-page">
      {/* ── Decorative background orbs ── */}
      <div className="auth-orb auth-orb--1" aria-hidden="true" />
      <div className="auth-orb auth-orb--2" aria-hidden="true" />

      <div className="auth-container">
        {/* ── Left: Branding panel ── */}
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

        {/* ── Right: Form card ── */}
        <div className="auth-card">
          <h2>Create an account</h2>
          <p className="auth-card__sub">Start tracking your finances today</p>

          {/* Error alert */}
          {(formError || error) && (
            <div className="alert">{formError || error}</div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            {/* Name field */}
            <div className="auth-field">
              <label htmlFor="reg-name">Full Name</label>
              <div className="auth-input-wrap">
                <svg className="auth-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                <input
                  id="reg-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                />
              </div>
            </div>

            {/* Email field */}
            <div className="auth-field">
              <label htmlFor="reg-email">Email</label>
              <div className="auth-input-wrap">
                <svg className="auth-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
                <input
                  id="reg-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                />
              </div>
            </div>

            {/* Password field */}
            <div className="auth-field">
              <label htmlFor="reg-password">Password</label>
              <div className="auth-input-wrap">
                <svg className="auth-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <input
                  id="reg-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a strong password"
                />
              </div>
            </div>

            {/* Role selection */}
            <div className="auth-field">
              <label htmlFor="reg-role">Role</label>
              <div className="auth-input-wrap">
                <select
                  id="reg-role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  style={{ appearance: "none" }}
                >
                  <option value="Head">Head (Create a new family)</option>
                  <option value="Member">Member (Join existing family)</option>
                </select>
                <svg className="auth-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
            </div>

            {/* Conditional Join Code */}
            {role === "Member" && (
              <div className="auth-field">
                <label htmlFor="reg-joincode">Family Join Code</label>
                <div className="auth-input-wrap">
                  <svg className="auth-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                  <input
                    id="reg-joincode"
                    type="text"
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value)}
                    placeholder="Enter 8-digit code"
                  />
                </div>
              </div>
            )}

            {/* Submit */}
            <button className="auth-submit" type="submit" disabled={loading}>
              {loading ? "Creating account…" : "Create Account"}
            </button>
          </form>

          {/* Footer link */}
          <p className="auth-card__footer">
            Already have an account?{" "}
            <Link to="/login" className="auth-link">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}