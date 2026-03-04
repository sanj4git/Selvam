import api from "./client.js";

export async function listLiabilities() {
  const { data } = await api.get("/api/liabilities");
  return data;
}

export async function addLiability(payload) {
  const { data } = await api.post("/api/liabilities", payload);
  return data;
}

export async function updateLiability(id, payload) {
  const { data } = await api.put(`/api/liabilities/${id}`, payload);
  return data;
}

export async function deleteLiability(id) {
  const { data } = await api.delete(`/api/liabilities/${id}`);
  return data;
}