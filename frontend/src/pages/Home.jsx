/*
  Home.jsx
  --------
  Landing page for unauthenticated visitors.

  Behaviour:
  - If the user is already logged in (JWT token present), they are
    redirected straight to the Dashboard.
  - Otherwise, a premium marketing landing page is rendered with:
      1. Sticky glassmorphism navigation bar
      2. Full-viewport hero section with CTAs
      3. 6-card features grid
      4. 3-step "How it works" section
      5. Stats highlight bar
      6. Final call-to-action
      7. Footer

  All content is static — no backend calls are made on this page.
*/

import { Navigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import logo from "../assets/logo.jpeg";

/* ── Inline SVG icon components (zero external dependency) ────────── */

/** Credit-card style icon for Expense Tracking */
const IconExpense = () => (
  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="5" width="20" height="14" rx="2" />
    <line x1="2" y1="10" x2="22" y2="10" />
  </svg>
);

/** Pulse / trend-line icon for Asset Management */
const IconAsset = () => (
  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
  </svg>
);

/** Dollar-sign icon for Liability Tracking */
const IconLiability = () => (
  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
);

/** Grid / dashboard icon for Net Worth Dashboard */
const IconDashboard = () => (
  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
  </svg>
);

/** People icon for Family-Centric feature */
const IconFamily = () => (
  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

/** Robot / brain icon for AI Insights (coming soon) */
const IconAI = () => (
  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2a4 4 0 0 1 4 4v1h1a3 3 0 0 1 0 6h-1v1a4 4 0 0 1-8 0v-1H7a3 3 0 0 1 0-6h1V6a4 4 0 0 1 4-4z" />
    <line x1="9" y1="10" x2="9" y2="10.01" />
    <line x1="15" y1="10" x2="15" y2="10.01" />
    <path d="M9.5 15a3.5 3.5 0 0 0 5 0" />
  </svg>
);

/** Right-arrow icon used in CTA buttons */
const IconArrowRight = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

/* ── Static data arrays ───────────────────────────────────────────── */

/**
 * FEATURES — the six product highlights shown in the features grid.
 * Each has an icon, title, description, and an optional "badge"
 * (e.g. "Soon") rendered as a chip overlay.
 */
const FEATURES = [
  { icon: <IconExpense />, title: "Expense Tracking", desc: "Categorise daily spending with Food, Transport, Rent and more. Get month-wise breakdowns at a glance." },
  { icon: <IconAsset />, title: "Asset Management", desc: "Track Cash, Gold, Stocks, FDs and Real Estate in one place. See your total wealth grow over time." },
  { icon: <IconLiability />, title: "Liability Tracking", desc: "Monitor loans, credit cards and EMIs with due-date sorting and interest rate tracking." },
  { icon: <IconDashboard />, title: "Net Worth Dashboard", desc: "Instant snapshot of total assets minus liabilities. Understand your real financial position." },
  { icon: <IconFamily />, title: "Family-Centric", desc: "Designed for Indian households with shared visibility, family roles, and multi-member support." },
  { icon: <IconAI />, title: "AI Insights", desc: "Coming soon — intelligent spending analysis, monthly summaries, and personalised financial advice.", badge: "Soon" },
];

/**
 * STEPS — the three-step onboarding flow shown in "How it works".
 */
const STEPS = [
  { num: "01", title: "Create Account", desc: "Sign up in seconds with your name and email. Secure JWT-based authentication keeps your data safe." },
  { num: "02", title: "Track Everything", desc: "Log expenses, add assets and liabilities. The platform consolidates it all into one financial picture." },
  { num: "03", title: "Gain Clarity", desc: "View your net worth, category-wise spending, and month-on-month trends on a powerful dashboard." },
];

/**
 * STATS — the four highlight metrics shown below the steps section.
 */
const STATS = [
  { value: "8+", label: "Asset Classes" },
  { value: "100%", label: "India-Focused" },
  { value: "∞", label: "Family Members" },
  { value: "24/7", label: "Access Anywhere" },
];

/* ── Component ────────────────────────────────────────────────────── */

export default function Home() {
  const { token } = useAuth();

  /*
    If the user is already authenticated, skip the landing page
    and send them straight to the financial dashboard.
  */
  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="landing">
      {/* ─── Floating background orbs (purely decorative) ─── */}
      <div className="landing-orb landing-orb--1" aria-hidden="true" />
      <div className="landing-orb landing-orb--2" aria-hidden="true" />
      <div className="landing-orb landing-orb--3" aria-hidden="true" />

      {/* ─── Sticky glassmorphism navigation ─── */}
      <nav className="landing-nav">
        <div className="landing-nav__brand">
          <img className="landing-nav__logo" src={logo} alt="Selvam logo" />
          <span className="landing-nav__name">Selvam</span>
        </div>
        <div className="landing-nav__links">
          <Link to="/login" className="landing-nav__link">Sign In</Link>
          <Link to="/register" className="landing-nav__cta">Get Started</Link>
        </div>
      </nav>

      {/* ─── Hero section ─── */}
      <section className="landing-hero">
        <div className="landing-hero__content">
          <span className="landing-badge">Unified Family Finance</span>
          <h1 className="landing-hero__title">
            Your family's complete<br />
            <span className="landing-hero__gold">financial picture.</span>
          </h1>
          <p className="landing-hero__sub">
            Track expenses, monitor investments, manage liabilities and gain actionable
            insights — all from a single, beautifully crafted dashboard designed for
            Indian households.
          </p>
          <div className="landing-hero__actions">
            <Link to="/register" className="landing-btn landing-btn--primary">
              Get Started Free <IconArrowRight />
            </Link>
            <Link to="/login" className="landing-btn landing-btn--ghost">
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Features grid (6 glassmorphism cards) ─── */}
      <section className="landing-section" id="features">
        <h2 className="landing-section__title">Everything you need</h2>
        <p className="landing-section__sub">
          One platform to replace a dozen fragmented tools.
        </p>
        <div className="landing-features">
          {FEATURES.map((f) => (
            <div key={f.title} className="landing-feature-card">
              <div className="landing-feature-card__icon">{f.icon}</div>
              <h3>{f.title}</h3>
              {f.badge && <span className="landing-chip">{f.badge}</span>}
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── How it works (3-step flow) ─── */}
      <section className="landing-section">
        <h2 className="landing-section__title">How it works</h2>
        <p className="landing-section__sub">Three simple steps to financial clarity.</p>
        <div className="landing-steps">
          {STEPS.map((s, i) => (
            <div key={s.num} className="landing-step">
              <span className="landing-step__num">{s.num}</span>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
              {i < STEPS.length - 1 && <div className="landing-step__connector" aria-hidden="true" />}
            </div>
          ))}
        </div>
      </section>

      {/* ─── Stats highlight bar ─── */}
      <section className="landing-stats">
        {STATS.map((s) => (
          <div key={s.label} className="landing-stat">
            <span className="landing-stat__value">{s.value}</span>
            <span className="landing-stat__label">{s.label}</span>
          </div>
        ))}
      </section>

      {/* ─── Final CTA ─── */}
      <section className="landing-cta">
        <div className="landing-cta__card">
          <h2>Ready to take control?</h2>
          <p>Join Selvam and get the clearest view of your household finances — for free.</p>
          <Link to="/register" className="landing-btn landing-btn--primary">
            Create Free Account <IconArrowRight />
          </Link>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="landing-footer">
        <div className="landing-footer__brand">
          <img className="landing-nav__logo" src={logo} alt="Selvam" />
          <span>Selvam</span>
        </div>
        <p className="landing-footer__copy">
          &copy; {new Date().getFullYear()} Selvam &middot; Built for Indian families
        </p>
      </footer>
    </div>
  );
}