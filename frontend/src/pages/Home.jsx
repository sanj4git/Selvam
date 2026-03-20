/*
  Home.jsx
  --------
  Massively redesigned premium landing page.

  Sections:
  1. Sticky glassmorphism nav
  2. Full-viewport animated hero with gradient headline + animated counter stats
  3. "Live Preview" mock dashboard card
  4. Feature highlights (6 glassmorphism cards)
  5. How it works (3-step timeline)
  6. Stats highlight bar
  7. Final CTA with gradient card
  8. Footer
*/

import { Navigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import logo from "../assets/logo.jpeg";

/* ── Animation hook for counting up numbers ─────────────────────── */
function useCountUp(target, duration = 1800) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return count;
}

/* ── Inline SVG icons ──────────────────────────────────────────── */
const IconExpense = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="5" width="20" height="14" rx="2" />
    <line x1="2" y1="10" x2="22" y2="10" />
  </svg>
);
const IconAsset = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
  </svg>
);
const IconLiability = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
);
const IconDashboard = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" />
  </svg>
);
const IconFamily = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);
const IconAI = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2a4 4 0 0 1 4 4v1h1a3 3 0 0 1 0 6h-1v1a4 4 0 0 1-8 0v-1H7a3 3 0 0 1 0-6h1V6a4 4 0 0 1 4-4z" />
    <line x1="9" y1="10" x2="9" y2="10.01" /><line x1="15" y1="10" x2="15" y2="10.01" />
    <path d="M9.5 15a3.5 3.5 0 0 0 5 0" />
  </svg>
);
const IconArrow = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
  </svg>
);

/* ── Static feature data ─────────────────────────────────────────── */
const FEATURES = [
  { icon: <IconExpense />, title: "Smart Expense Tracking", desc: "Log spending across 8 categories. Beautiful charts show where every rupee goes — by day, week, and month." },
  { icon: <IconAsset />, title: "Asset Portfolio", desc: "Gold, FDs, Stocks, Real Estate, Crypto. Live gold prices, compound interest auto-calculation." },
  { icon: <IconLiability />, title: "Liability Manager", desc: "Home loans, credit cards, EMIs with interest rates and due-date tracking. Never miss a payment." },
  { icon: <IconDashboard />, title: "Net Worth Dashboard", desc: "Real-time snapshot of total assets minus liabilities. Recharts-powered pie and bar charts." },
  { icon: <IconFamily />, title: "Family Finance", desc: "Create a household, share a join code. All members' data rolls up into one family dashboard." },
  { icon: <IconAI />, title: "AI Financial Assistant", desc: "Ask Gemini AI anything about your spending. Get personalised insights on your actual data.", badge: "AI" },
];

const STEPS = [
  { num: "01", icon: "🔐", title: "Create Your Account", desc: "Sign up in seconds. Choose your role — Head of Family or Member. Secure JWT-based auth keeps you safe." },
  { num: "02", icon: "📊", title: "Add Your Finances", desc: "Log expenses, assets, and liabilities. The platform tracks it all in real time." },
  { num: "03", icon: "💡", title: "Get Insights", desc: "View your net worth, spending by category, monthly trends, and ask the AI chatbot for analysis." },
];

/* ── Mock dashboard preview data ─────────────────────────────────── */
const MOCK_EXPENSES = [
  { emoji: "🍽️", cat: "Food",     amt: "₹1,800", color: "#f59f00" },
  { emoji: "🏠", cat: "Rent",     amt: "₹25,000", color: "#cc5de8" },
  { emoji: "🚗", cat: "Transport", amt: "₹1,200", color: "#339af0" },
  { emoji: "💊", cat: "Health",   amt: "₹2,200", color: "#51cf66" },
];

/* ── Animated stat ─────────────────────────────────────────────── */
function AnimStat({ value, label, prefix = "", suffix = "" }) {
  const num = useCountUp(typeof value === "number" ? value : 0);
  const display = typeof value === "number" ? `${prefix}${num.toLocaleString("en-IN")}${suffix}` : value;
  return (
    <div className="landing-stat">
      <span className="landing-stat__value">{display}</span>
      <span className="landing-stat__label">{label}</span>
    </div>
  );
}

/* ── Component ─────────────────────────────────────────────────── */
export default function Home() {
  const { token } = useAuth();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  if (token) return <Navigate to="/dashboard" replace />;

  return (
    <div className="landing">
      {/* ── Animated background orbs ── */}
      <div className="landing-orb landing-orb--1" aria-hidden="true" />
      <div className="landing-orb landing-orb--2" aria-hidden="true" />
      <div className="landing-orb landing-orb--3" aria-hidden="true" />
      <div className="landing-orb landing-orb--4" aria-hidden="true" />

      {/* ── Nav ── */}
      <nav className="landing-nav">
        <div className="landing-nav__brand">
          <img className="landing-nav__logo" src={logo} alt="Selvam" />
          <span className="landing-nav__name">Selvam</span>
        </div>
        <div className="landing-nav__links">
          <a href="#features" className="landing-nav__link">Features</a>
          <a href="#how" className="landing-nav__link">How it works</a>
          <Link to="/login" className="landing-nav__link">Sign In</Link>
          <Link to="/register" className="landing-nav__cta">Get Started →</Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="landing-hero">
        <div className={`landing-hero__content ${visible ? "visible" : ""}`}>
          <span className="landing-badge">🇮🇳 Built for Indian Families</span>
          <h1 className="landing-hero__title">
            One dashboard for your<br />
            <span className="landing-hero__gradient">entire financial life.</span>
          </h1>
          <p className="landing-hero__sub">
            Track expenses, manage assets, monitor liabilities, and get AI-powered insights —
            all in a premium, beautifully crafted platform designed for Indian households.
          </p>
          <div className="landing-hero__actions">
            <Link to="/register" className="landing-btn landing-btn--primary">
              Start for Free <IconArrow />
            </Link>
            <Link to="/login" className="landing-btn landing-btn--ghost">
              Sign In
            </Link>
          </div>

          {/* ── Hero credential chips ── */}
          <div className="landing-hero__badges">
            <span className="landing-trust-chip">🔐 JWT Secured</span>
            <span className="landing-trust-chip">🤖 Gemini AI Powered</span>
            <span className="landing-trust-chip">📊 Recharts Analytics</span>
            <span className="landing-trust-chip">☁️ MongoDB Atlas</span>
          </div>
        </div>
      </section>

      {/* ── Mock Dashboard Preview ── */}
      <section className="landing-preview-section">
        <div className="landing-preview-label">Live Preview</div>
        <div className="landing-preview-card">
          {/* Mini summary cards */}
          <div className="lp-summary-row">
            <div className="lp-summary-box lp-assets">
              <span className="lp-box-label">Total Assets</span>
              <span className="lp-box-val">₹22,45,000</span>
            </div>
            <div className="lp-summary-box lp-liab">
              <span className="lp-box-label">Liabilities</span>
              <span className="lp-box-val">₹40,18,500</span>
            </div>
            <div className="lp-summary-box lp-nw">
              <span className="lp-box-label">Net Worth</span>
              <span className="lp-box-val lp-positive">₹12,67,000</span>
            </div>
          </div>
          {/* Mini expense rows */}
          <div className="lp-section-title">Recent Expenses</div>
          <div className="lp-expense-list">
            {MOCK_EXPENSES.map(e => (
              <div key={e.cat} className="lp-exp-row">
                <div className="lp-exp-icon" style={{ color: e.color }}>{e.emoji}</div>
                <span className="lp-exp-cat">{e.cat}</span>
                <span className="lp-exp-amt">{e.amt}</span>
              </div>
            ))}
          </div>
          {/* AI chatbot preview */}
          <div className="lp-chat-preview">
            <div className="lp-chat-bubble lp-user">What's my biggest spending category?</div>
            <div className="lp-chat-bubble lp-ai">
              🤖 Your highest spend is <strong>Rent</strong> at ₹25,000/mo (42% of your total expenses). 
              Food follows at ₹4,050 (7%). Consider optimising your transport budget which grew 23% this month.
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="landing-section" id="features">
        <h2 className="landing-section__title">Everything your family needs</h2>
        <p className="landing-section__sub">One platform to replace a dozen financial spreadsheets.</p>
        <div className="landing-features">
          {FEATURES.map((f, i) => (
            <div key={f.title} className="landing-feature-card" style={{ animationDelay: `${i * 0.08}s` }}>
              <div className="landing-feature-card__icon">{f.icon}</div>
              {f.badge && <span className="landing-chip landing-chip--ai">{f.badge}</span>}
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="landing-section" id="how">
        <h2 className="landing-section__title">Get started in 3 steps</h2>
        <p className="landing-section__sub">From sign-up to financial clarity in under 5 minutes.</p>
        <div className="landing-steps">
          {STEPS.map((s, i) => (
            <div key={s.num} className="landing-step" style={{ animationDelay: `${i * 0.12}s` }}>
              <div className="landing-step__icon-wrap">{s.icon}</div>
              <span className="landing-step__num">{s.num}</span>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="landing-stats">
        <AnimStat value={8} label="Asset Classes" suffix="+" />
        <AnimStat value={30} label="Expense Categories" suffix="+" />
        <AnimStat value="∞" label="Family Members" />
        <AnimStat value="24/7" label="AI Insights" />
        <AnimStat value={100} label="India-Focused" suffix="%" />
      </section>

      {/* ── Final CTA ── */}
      <section className="landing-cta">
        <div className="landing-cta__card">
          <span className="landing-badge" style={{ marginBottom: "1rem" }}>Free Forever</span>
          <h2>Ready to take control of your finances?</h2>
          <p>Join Selvam — the only platform built specifically for Indian household finance management.</p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap", marginTop: "28px" }}>
            <Link to="/register" className="landing-btn landing-btn--primary">
              Create Free Account <IconArrow />
            </Link>
            <Link to="/login" className="landing-btn landing-btn--ghost">
              Already have an account?
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="landing-footer">
        <div className="landing-footer__brand">
          <img className="landing-nav__logo" src={logo} alt="Selvam" style={{ width: 32, height: 32 }} />
          <span>Selvam</span>
        </div>
        <p className="landing-footer__copy">
          © {new Date().getFullYear()} Selvam · Built with ❤️ for Indian families ·{" "}
          Amrita School of Computing, Coimbatore
        </p>
        <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.78rem", marginTop: "6px" }}>
          Team: Amarthya Sujay · Sanjay A R · Sundar T
        </p>
      </footer>
    </div>
  );
}