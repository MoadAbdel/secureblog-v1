export const API_URL = "http://localhost:5000";

// credentials:"include" pour envoyer le cookie de session
export async function apiGet(path) {
  const res = await fetch(`${API_URL}${path}`, { credentials: "include" });
  if (!res.ok) {
    throw new Error(`Requête échouée (${res.status})`);
  }
  return res.json();
}
