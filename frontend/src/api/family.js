import api from "./client.js";

export async function generateJoinCode() {
    const { data } = await api.post("/api/family/join-code");
    return data;
}

export async function joinFamily(joinCode) {
    const { data } = await api.post("/api/family/join", { joinCode });
    return data;
}

export async function getFamily() {
    const { data } = await api.get("/api/family");
    return data;
}

export async function createFamily() {
    const { data } = await api.post("/api/family/create");
    return data;
}
