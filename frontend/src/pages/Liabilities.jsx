import { useEffect, useState } from "react";
import {
  listLiabilities,
  addLiability,
  updateLiability,
  deleteLiability
} from "../api/liabilities.js";

const emptyForm = {
  type: "",
  amount: "",
  interestRate: "",
  dueDate: ""
};

function formatDate(value) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
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
        <h3>Liabilities List</h3>
        {loading ? (
          <div className="muted">Loading...</div>
        ) : items.length === 0 ? (
          <div className="muted">No liabilities yet</div>
        ) : (
          <div className="table">
            <div className="table-row table-head">
              <div>Type</div>
              <div>Amount</div>
              <div>Interest</div>
              <div>Due Date</div>
              <div></div>
            </div>
            {items.map((item) => (
              <div key={item._id} className="table-row">
                <div>{item.type}</div>
                <div>? {Number(item.amount).toFixed(2)}</div>
                <div>{item.interestRate ?? "-"}</div>
                <div>{formatDate(item.dueDate)}</div>
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