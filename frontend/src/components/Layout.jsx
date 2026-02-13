import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import logo from "../assets/logo.jpeg";

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="brand">
          <img className="brand-logo" src={logo} alt="Selvam logo" />
          <span className="brand-name">Selvam</span>
        </div>
        <nav className="nav">
          <NavLink to="/expenses">Expenses</NavLink>
          <NavLink to="/assets">Assets</NavLink>
          <NavLink to="/liabilities">Liabilities</NavLink>
        </nav>
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