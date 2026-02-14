import { useEffect, useState } from "react";
import { listAssets, addAsset, updateAsset, deleteAsset } from "../api/assets.js";

const emptyForm = {
  assetType: "",
  name: "",
  value: ""
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
      value: Number(form.value)
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
      value: item.value ?? ""
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
          <div className="actions">
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
        <h3>Assets List</h3>
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