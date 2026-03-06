import { useEffect, useState } from "react";
import { listAssets, addAsset, updateAsset, deleteAsset, triggerSync } from "../api/assets.js";

const emptyForm = {
  assetType: "",
  name: "",
  value: "",
  quantity: 1,
  symbol: "",
  isMarketLinked: false
};

export default function Assets() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);

  const fetchItems = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await listAssets();
      setItems(data);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load assets");
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

    if (!form.assetType || !form.name || !form.value) {
      setError("Asset type, name, and value are required");
      return;
    }

    const payload = {
      assetType: form.assetType,
      name: form.name,
      value: Number(form.value),
      isMarketLinked: form.isMarketLinked,
      ...(form.isMarketLinked && { quantity: Number(form.quantity) }),
      ...(form.isMarketLinked && form.symbol && { symbol: form.symbol }),
    };

    try {
      if (editId) {
        const updated = await updateAsset(editId, payload);
        setItems((prev) => prev.map((it) => (it._id === editId ? updated : it)));
      } else {
        const created = await addAsset(payload);
        setItems((prev) => [created, ...prev]);
      }
      resetForm();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to save asset");
    }
  };

  const startEdit = (item) => {
    setEditId(item._id);
    setForm({
      assetType: item.assetType ?? "",
      name: item.name ?? "",
      value: item.value ?? "",
      quantity: item.quantity ?? 1,
      symbol: item.symbol ?? "",
      isMarketLinked: item.isMarketLinked ?? false,
    });
  };

  const handleDelete = async (id) => {
    try {
      await deleteAsset(id);
      setItems((prev) => prev.filter((it) => it._id !== id));
      if (editId === id) resetForm();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to delete asset");
    }
  };

  const handleSync = async () => {
    setLoading(true);
    setError("");
    try {
      await triggerSync();
      await fetchItems(); // Refresh the list with new values
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to sync market prices");
      setLoading(false);
    }
  };

  return (
    <section className="page">
      <div className="page-header">
        <h2>Assets</h2>
        <p className="muted">Track savings, investments, and property</p>
      </div>

      <div className="card">
        <h3>{editId ? "Edit Asset" : "Add Asset"}</h3>
        {error && <div className="alert">{error}</div>}
        <form onSubmit={handleSubmit} className="form grid">
          <label>
            Asset Type
            <input
              type="text"
              value={form.assetType}
              onChange={(e) => handleChange("assetType", e.target.value)}
              placeholder="Cash, Gold, FD, Stock"
            />
          </label>
          <label>
            Name
            <input
              type="text"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="Asset name"
            />
          </label>
          <label>
            Value
            <input
              type="number"
              step="0.01"
              value={form.value}
              onChange={(e) => handleChange("value", e.target.value)}
            />
          </label>
          <div className="checkbox-container" style={{ marginTop: "1rem" }}>
            <label style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={form.isMarketLinked}
                onChange={(e) => handleChange("isMarketLinked", e.target.checked)}
                style={{ margin: 0, width: "auto" }}
              />
              <span style={{ fontSize: "0.9rem" }}>Track Live Market Value (Gold / Mutual Funds)</span>
            </label>
          </div>

          {form.isMarketLinked && (
            <div className="grid" style={{ marginTop: "1rem" }}>
              <label>
                Quantity (Grams / Units)
                <input
                  type="number"
                  step="0.01"
                  value={form.quantity}
                  onChange={(e) => handleChange("quantity", e.target.value)}
                  placeholder="e.g. 10.5"
                />
              </label>
              <label>
                Symbol / Scheme Code (For MF)
                <input
                  type="text"
                  value={form.symbol}
                  onChange={(e) => handleChange("symbol", e.target.value)}
                  placeholder="e.g. 102885"
                />
              </label>
            </div>
          )}

          <div className="actions" style={{ marginTop: "1.5rem" }}>
            <button className="btn" type="submit">
              {editId ? "Save Changes" : "Add Asset"}
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
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <h3 style={{ margin: 0 }}>Assets List</h3>
          <button
            className="btn btn-secondary"
            onClick={handleSync}
            disabled={loading}
            style={{ fontSize: "0.85rem", padding: "6px 12px" }}
          >
            {loading ? "Syncing..." : "Sync Market Prices"}
          </button>
        </div>
        {loading ? (
          <div className="muted">Loading...</div>
        ) : items.length === 0 ? (
          <div className="muted">No assets yet</div>
        ) : (
          <div className="table">
            <div className="table-row table-head">
              <div>Type</div>
              <div>Name</div>
              <div>Value</div>
              <div></div>
            </div>
            {items.map((item) => (
              <div key={item._id} className="table-row">
                <div>{item.assetType}</div>
                <div>{item.name}</div>
                <div>? {Number(item.value).toFixed(2)}</div>
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