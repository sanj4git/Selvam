/*
  Layout.jsx
  ----------
  The authenticated app shell that wraps all protected pages.

  Structure:
  - Sticky header with:
      • Selvam logo + brand name
      • Nav links: Dashboard, Expenses, Assets, Liabilities
      • User name display + Logout button
  - Main content area (receives children)

  On logout, the user is redirected to /login.
*/

import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import logo from "../assets/logo.jpeg";

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  /** Clear auth state and redirect to login page. */
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="app-shell">
      <header className="app-header">
        {/* ── Brand ── */}
        <div className="brand">
          <img className="brand-logo" src={logo} alt="Selvam logo" />
          <span className="brand-name">Selvam</span>
        </div>

        {/* ── Navigation links ── */}
        <nav className="nav">
          <NavLink to="/dashboard">Dashboard</NavLink>
          <NavLink to="/expenses">Expenses</NavLink>
          <NavLink to="/assets">Assets</NavLink>
          <NavLink to="/liabilities">Liabilities</NavLink>
        </nav>

        {/* ── User info & logout ── */}
        <div className="user">
          <span className="user-name">{user?.name || "User"}</span>
          <button className="btn btn-secondary" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      <main className="app-main">{children}</main>
    </div>
  );
}