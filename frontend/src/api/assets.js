import api from "./client.js";

export async function listAssets() {
  const { data } = await api.get("/api/assets");
  return data;
}

export async function addAsset(payload) {
  const { data } = await api.post("/api/assets", payload);
  return data;
}

export async function updateAsset(id, payload) {
  const { data } = await api.put(`/api/assets/${id}`, payload);
  return data;
}

export async function deleteAsset(id) {
  const { data } = await api.delete(`/api/assets/${id}`);
  return data;
}