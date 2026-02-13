import api from "./client.js";

export async function listLiabilities() {
  const { data } = await api.get("/liabilities");
  return data;
}

export async function addLiability(payload) {
  const { data } = await api.post("/liabilities", payload);
  return data;
}

export async function updateLiability(id, payload) {
  const { data } = await api.put(`/liabilities/${id}`, payload);
  return data;
}

export async function deleteLiability(id) {
  const { data } = await api.delete(`/liabilities/${id}`);
  return data;
}