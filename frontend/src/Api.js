const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });

  if (res.status === 204) return null;

  const text = await res.text();
  const data = text ? (() => { try { return JSON.parse(text); } catch { return text; } })() : null;

  if (!res.ok) {
    const err = new Error((data && data.message) || `Request failed: ${res.status}`);
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data;
}

export const api = {
  // Locations
  getLocations: () => request("/locations"),
  getLocation: (id) => request(`/locations/${id}`),
  createLocation: (payload) => request("/locations", { method: "POST", body: JSON.stringify(payload) }),
  updateLocation: (id, payload) => request(`/locations/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
  deleteLocation: (id) => request(`/locations/${id}`, { method: "DELETE" }),
  getLocationActivities: (id) => request(`/locations/${id}/activities`),

  // Activities  ✅ TADY musí být query
  getActivities: (query = "") => request(`/activities${query}`),
  getActivity: (id) => request(`/activities/${id}`),
  createActivity: (payload) => request("/activities", { method: "POST", body: JSON.stringify(payload) }),
  updateActivity: (id, payload) => request(`/activities/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
  deleteActivity: (id) => request(`/activities/${id}`, { method: "DELETE" }),
};
