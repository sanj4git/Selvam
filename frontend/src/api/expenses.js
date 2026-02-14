import api from "./client.js";

export async function listExpenses() {
  const { data } = await api.get("/api/expenses");
  return data;
}

export async function addExpense(payload) {
  const { data } = await api.post("/api/expenses", payload);
  return data;
}

export async function updateExpense(id, payload) {
  const { data } = await api.put(`/api/expenses/${id}`, payload);
  return data;
}

export async function deleteExpense(id) {
  const { data } = await api.delete(`/api/expenses/${id}`);
  return data;
}