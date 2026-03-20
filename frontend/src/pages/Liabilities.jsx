import { useEffect, useState } from "react";
import {
  listLiabilities,
  addLiability,
  updateLiability,
  deleteLiability
} from "../api/liabilities.js";

const LIAB_META = {
  "Home Loan":     { emoji: "🏠", color: "#cc5de8", bg: "rgba(204,93,232,0.12)" },
  "Car EMI":       { emoji: "🚗", color: "#339af0", bg: "rgba(51,154,240,0.12)" },
  "Credit Card":   { emoji: "💳", color: "#ff6b6b", bg: "rgba(255,107,107,0.12)" },
  "Personal Loan": { emoji: "💸", color: "#f59f00", bg: "rgba(245,159,0,0.12)"  },
  "Education Loan":{ emoji: "🎓", color: "#51cf66", bg: "rgba(81,207,102,0.12)" },
};

function getLiabMeta(type) {
  const key = Object.keys(LIAB_META).find(k => k.toLowerCase() === (type||'').toLowerCase());
  return LIAB_META[key] || { emoji: "📋", color: "#adb5bd", bg: "rgba(173,181,189,0.12)" };
}

function formatINR(n) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency", currency: "INR", maximumFractionDigits: 0,
  }).format(n);
}

const emptyForm = { type: "", amount: "", interestRate: "", dueDate: "" };

function formatDate(value) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
}

function formatDisplayDate(value) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

export default function Liabilities() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);

  const fetchItems = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await listLiabilities();
      setItems(data);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load liabilities");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.type || !form.amount || !form.dueDate) {
      setError("Type, amount, and due date are required");
      return;
    }

    const payload = {
      type: form.type,
      amount: Number(form.amount),
      interestRate: form.interestRate ? Number(form.interestRate) : null,
      dueDate: form.dueDate
    };

    try {
      if (editId) {
        const updated = await updateLiability(editId, payload);
        setItems((prev) => prev.map((it) => (it._id === editId ? updated : it)));
      } else {
        const created = await addLiability(payload);
        setItems((prev) => [created, ...prev]);
      }
      resetForm();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to save liability");
    }
  };

  const startEdit = (item) => {
    setEditId(item._id);
    setForm({
      type: item.type ?? "",
      amount: item.amount ?? "",
      interestRate: item.interestRate ?? "",
      dueDate: formatDate(item.dueDate)
    });
  };

  const handleDelete = async (id) => {
    try {
      await deleteLiability(id);
      setItems((prev) => prev.filter((it) => it._id !== id));
      if (editId === id) resetForm();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to delete liability");
    }
  };

  return (
    <section className="page">
      <div className="page-header">
        <h2>Liabilities</h2>
        <p className="muted">Track loans, credit cards, and other debts</p>
      </div>

      <div className="card">
        <h3>{editId ? "Edit Liability" : "Add Liability"}</h3>
        {error && <div className="alert">{error}</div>}
        <form onSubmit={handleSubmit} className="form grid">
          <label>
            Type
            <input
              type="text"
              value={form.type}
              onChange={(e) => handleChange("type", e.target.value)}
              placeholder="Loan, Credit Card, EMI"
            />
          </label>
          <label>
            Amount
            <input
              type="number"
              step="0.01"
              value={form.amount}
              onChange={(e) => handleChange("amount", e.target.value)}
            />
          </label>
          <label>
            Interest Rate (%)
            <input
              type="number"
              step="0.01"
              value={form.interestRate}
              onChange={(e) => handleChange("interestRate", e.target.value)}
            />
          </label>
          <label>
            Due Date
            <input
              type="date"
              value={form.dueDate}
              onChange={(e) => handleChange("dueDate", e.target.value)}
            />
          </label>
          <div className="actions">
            <button className="btn" type="submit">
              {editId ? "Save Changes" : "Add Liability"}
            </button>
            {editId && (
              <button className="btn btn-secondary" type="button" onClick={resetForm}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="card">
        <div style={{ marginBottom: "1.5rem" }}>
          <h3 style={{ margin: 0 }}>Liabilities Overview</h3>
          {items.length > 0 && (
            <p className="muted" style={{ marginTop: 4, fontSize: "0.85rem" }}>
              Total owed: <strong style={{ color: "#ff6b6b" }}>{formatINR(items.reduce((s, l) => s + (l.amount || 0), 0))}</strong>
            </p>
          )}
        </div>
        {loading ? (
          <div className="muted">Loading…</div>
        ) : items.length === 0 ? (
          <div className="exp-empty">
            <span style={{ fontSize: "2.5rem" }}>✅</span>
            <p>No liabilities. Debt-free!</p>
          </div>
        ) : (
          <div className="exp-list">
            {items.map(item => {
              const meta = getLiabMeta(item.type);
              const isOverdue = item.dueDate && new Date(item.dueDate) < new Date();
              return (
                <div key={item._id} className="exp-row">
                  <div className="exp-row-icon" style={{ background: meta.bg, color: meta.color }}>
                    {meta.emoji}
                  </div>
                  <div className="exp-row-info">
                    <span className="exp-row-cat">{item.type}</span>
                    <span className="exp-row-desc" style={isOverdue ? { color: "#ff6b6b" } : {}}>
                      Due: {formatDisplayDate(item.dueDate)}{isOverdue ? " ⚠ Overdue" : ""}
                    </span>
                  </div>
                  <div className="exp-row-right">
                    <span className="exp-row-amount" style={{ color: "#ff6b6b" }}>{formatINR(item.amount)}</span>
                    {item.interestRate && (
                      <span className="exp-row-date">{item.interestRate}% p.a.</span>
                    )}
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