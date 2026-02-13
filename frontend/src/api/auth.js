import api from "./client.js";

export async function registerUser(payload) {
  const { data } = await api.post("/api/auth/register", payload);
  return data;
}

export async function loginUser(payload) {
  const { data } = await api.post("/api/auth/login", payload);
  return data;
}