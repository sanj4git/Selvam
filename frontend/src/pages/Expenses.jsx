import { useEffect, useState } from "react";
import {
  listExpenses,
  addExpense,
  updateExpense,
  deleteExpense
} from "../api/expenses.js";

const CATEGORIES = [
  "Food",
  "Transport",
  "Rent",
  "Utilities",
  "Shopping",
  "Health",
  "Entertainment",
  "Other"
];

const emptyForm = {
  amount: "",
  category: "",
  date: "",
  description: ""
};

function formatDate(value) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
}

export default function Expenses() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);

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
        setItems((prev) => prev.map((it) => (it._id === editId ? updated : it)));
      } else {
        const created = await addExpense(payload);
        setItems((prev) => [created, ...prev]);
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
      setItems((prev) => prev.filter((it) => it._id !== id));
      if (editId === id) resetForm();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to delete expense");
    }
  };

  return (
    <section className="page">
      <div className="page-header">
        <h2>Expenses</h2>
        <p className="muted">Track daily and monthly spending</p>
      </div>

      <div className="card">
        <h3>{editId ? "Edit Expense" : "Add Expense"}</h3>
        {error && <div className="alert">{error}</div>}
        <form onSubmit={handleSubmit} className="form grid">
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
            Category
            <select
              value={form.category}
              onChange={(e) => handleChange("category", e.target.value)}
            >
              <option value="">Select</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </label>
          <label>
            Date
            <input
              type="date"
              value={form.date}
              onChange={(e) => handleChange("date", e.target.value)}
            />
          </label>
          <label className="full">
            Description
            <input
              type="text"
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Optional note"
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

      <div className="card">
        <h3>Recent Expenses</h3>
        {loading ? (
          <div className="muted">Loading...</div>
        ) : items.length === 0 ? (
          <div className="muted">No expenses yet</div>
        ) : (
          <div className="table">
            <div className="table-row table-head">
              <div>Date</div>
              <div>Category</div>
              <div>Amount</div>
              <div>Description</div>
              <div></div>
            </div>
            {items.map((item) => (
              <div key={item._id} className="table-row">
                <div>{formatDate(item.date)}</div>
                <div>{item.category}</div>
                <div>? {Number(item.amount).toFixed(2)}</div>
                <div>{item.description || "-"}</div>
                <div className="row-actions">
                  <button className="btn btn-link" onClick={() => startEdit(item)}>
                    Edit
                  </button>
                  <button className="btn btn-link danger" onClick={() => handleDelete(item._id)}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}