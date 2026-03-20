import { useEffect, useState } from "react";
import {
  listExpenses,
  addExpense,
  updateExpense,
  deleteExpense
} from "../api/expenses.js";

const CATEGORIES = [
  "Food", "Transport", "Rent", "Utilities",
  "Shopping", "Health", "Entertainment", "Other"
];

// Colour + emoji per category
const CAT_META = {
  Food:          { color: "#f59f00", bg: "rgba(245,159,0,0.12)",   emoji: "🍽️" },
  Transport:     { color: "#339af0", bg: "rgba(51,154,240,0.12)",  emoji: "🚗" },
  Rent:          { color: "#cc5de8", bg: "rgba(204,93,232,0.12)",  emoji: "🏠" },
  Utilities:     { color: "#20c997", bg: "rgba(32,201,151,0.12)",  emoji: "⚡" },
  Shopping:      { color: "#ff6b6b", bg: "rgba(255,107,107,0.12)", emoji: "🛍️" },
  Health:        { color: "#51cf66", bg: "rgba(81,207,102,0.12)",  emoji: "💊" },
  Entertainment: { color: "#ff922b", bg: "rgba(255,146,43,0.12)",  emoji: "🎬" },
  Other:         { color: "#adb5bd", bg: "rgba(173,181,189,0.12)", emoji: "📦" },
};

const emptyForm = { amount: "", category: "", date: "", description: "" };

function formatDate(value) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
}

function formatINR(n) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency", currency: "INR", maximumFractionDigits: 0,
  }).format(n);
}

function formatDisplayDate(value) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

export default function Expenses() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [filterCat, setFilterCat] = useState("All");

  const fetchItems = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await listExpenses();
      setItems(data);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load expenses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchItems(); }, []);

  const handleChange = (field, value) => setForm(prev => ({ ...prev, [field]: value }));
  const resetForm = () => { setForm(emptyForm); setEditId(null); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.amount || !form.category || !form.date) {
      setError("Amount, category, and date are required");
      return;
    }
    const payload = {
      amount: Number(form.amount),
      category: form.category,
      date: form.date,
      description: form.description
    };
    try {
      if (editId) {
        const updated = await updateExpense(editId, payload);
        setItems(prev => prev.map(it => it._id === editId ? updated : it));
      } else {
        const created = await addExpense(payload);
        setItems(prev => [created, ...prev]);
      }
      resetForm();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to save expense");
    }
  };

  const startEdit = (item) => {
    setEditId(item._id);
    setForm({
      amount: item.amount ?? "",
      category: item.category ?? "",
      date: formatDate(item.date),
      description: item.description ?? ""
    });
  };

  const handleDelete = async (id) => {
    try {
      await deleteExpense(id);
      setItems(prev => prev.filter(it => it._id !== id));
      if (editId === id) resetForm();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to delete expense");
    }
  };

  // ── Analytics derivations ────────────────────────────────
  const totalAll = items.reduce((s, e) => s + (e.amount || 0), 0);

  const now = new Date();
  const thisMonth = items.filter(e => {
    const d = new Date(e.date);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });
  const totalThisMonth = thisMonth.reduce((s, e) => s + (e.amount || 0), 0);

  // Category totals
  const catTotals = {};
  items.forEach(e => { catTotals[e.category] = (catTotals[e.category] || 0) + e.amount; });
  const topCat = Object.entries(catTotals).sort((a, b) => b[1] - a[1])[0];

  const filtered = filterCat === "All" ? items : items.filter(e => e.category === filterCat);

  return (
    <section className="page">
      <div className="page-header">
        <h2>Expenses</h2>
        <p className="muted">Track and analyse your spending</p>
      </div>

      {/* ── Insight Cards ── */}
      <div className="exp-stats-row">
        <div className="exp-stat-card">
          <span className="exp-stat-label">Total Spent</span>
          <span className="exp-stat-value">{formatINR(totalAll)}</span>
        </div>
        <div className="exp-stat-card exp-stat-card--accent">
          <span className="exp-stat-label">This Month</span>
          <span className="exp-stat-value">{formatINR(totalThisMonth)}</span>
        </div>
        <div className="exp-stat-card">
          <span className="exp-stat-label">Transactions</span>
          <span className="exp-stat-value">{items.length}</span>
        </div>
        {topCat && (
          <div className="exp-stat-card">
            <span className="exp-stat-label">Top Category</span>
            <span className="exp-stat-value" style={{ fontSize: "1rem" }}>
              {CAT_META[topCat[0]]?.emoji} {topCat[0]}
            </span>
            <span className="exp-stat-sub">{formatINR(topCat[1])}</span>
          </div>
        )}
      </div>

      {/* ── Category Spending Bar ── */}
      {Object.keys(catTotals).length > 0 && (
        <div className="card">
          <h3 style={{ marginBottom: "1rem" }}>Spending by Category</h3>
          <div className="exp-cat-bars">
            {Object.entries(catTotals)
              .sort((a, b) => b[1] - a[1])
              .map(([cat, total]) => {
                const pct = Math.round((total / totalAll) * 100);
                const meta = CAT_META[cat] || CAT_META.Other;
                return (
                  <div key={cat} className="exp-cat-bar-row">
                    <div className="exp-cat-bar-label">
                      <span className="exp-cat-emoji">{meta.emoji}</span>
                      <span className="exp-cat-name">{cat}</span>
                      <span className="exp-cat-pct muted">{pct}%</span>
                    </div>
                    <div className="exp-cat-bar-track">
                      <div
                        className="exp-cat-bar-fill"
                        style={{ width: `${pct}%`, background: meta.color }}
                      />
                    </div>
                    <span className="exp-cat-total">{formatINR(total)}</span>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* ── Add / Edit Form ── */}
      <div className="card">
        <h3>{editId ? "✏️ Edit Expense" : "➕ Add Expense"}</h3>
        {error && <div className="alert">{error}</div>}
        <form onSubmit={handleSubmit} className="form grid">
          <label>
            Amount (₹)
            <input
              type="number" step="0.01" value={form.amount}
              onChange={e => handleChange("amount", e.target.value)}
              placeholder="e.g. 500"
            />
          </label>
          <label>
            Category
            <select value={form.category} onChange={e => handleChange("category", e.target.value)}>
              <option value="">Select category</option>
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{CAT_META[cat]?.emoji} {cat}</option>
              ))}
            </select>
          </label>
          <label>
            Date
            <input
              type="date" value={form.date}
              onChange={e => handleChange("date", e.target.value)}
            />
          </label>
          <label className="full">
            Description
            <input
              type="text" value={form.description}
              onChange={e => handleChange("description", e.target.value)}
              placeholder="Optional note (e.g. Dinner with friends)"
            />
          </label>
          <div className="actions">
            <button className="btn" type="submit">
              {editId ? "Save Changes" : "Add Expense"}
            </button>
            {editId && (
              <button className="btn btn-secondary" type="button" onClick={resetForm}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* ── Expense List ── */}
      <div className="card">
        <div className="exp-list-header">
          <h3>Recent Expenses</h3>
          <div className="exp-filter-tabs">
            {["All", ...CATEGORIES].map(cat => (
              <button
                key={cat}
                className={`exp-filter-tab ${filterCat === cat ? "active" : ""}`}
                onClick={() => setFilterCat(cat)}
              >
                {cat !== "All" && CAT_META[cat]?.emoji + " "}{cat}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="muted">Loading…</div>
        ) : filtered.length === 0 ? (
          <div className="exp-empty">
            <span style={{ fontSize: "2.5rem" }}>💸</span>
            <p>No expenses yet. Start tracking!</p>
          </div>
        ) : (
          <div className="exp-list">
            {filtered.map(item => {
              const meta = CAT_META[item.category] || CAT_META.Other;
              return (
                <div key={item._id} className="exp-row">
                  <div className="exp-row-icon" style={{ background: meta.bg, color: meta.color }}>
                    {meta.emoji}
                  </div>
                  <div className="exp-row-info">
                    <span className="exp-row-cat">{item.category}</span>
                    <span className="exp-row-desc">{item.description || "—"}</span>
                  </div>
                  <div className="exp-row-right">
                    <span className="exp-row-amount">{formatINR(item.amount)}</span>
                    <span className="exp-row-date">{formatDisplayDate(item.date)}</span>
                  </div>
                  <div className="exp-row-actions">
                    <button className="exp-action-btn" onClick={() => startEdit(item)} title="Edit">✏️</button>
                    <button className="exp-action-btn exp-action-btn--danger" onClick={() => handleDelete(item._id)} title="Delete">🗑️</button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}