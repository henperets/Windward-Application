// Small helper module to keep all API calls in one place.
// If the backend URL changes, it's changeable here!

// Fetch all fleets for the main page
export async function fetchFleets() {
  const res = await fetch("/api/fleets");
  if (!res.ok) throw new Error("Failed to fetch fleets");
  return res.json();
}

// Fetch all vessels for a specific fleet
export async function fetchFleetVessels(fleetId) {
  const res = await fetch(`/api/fleets/${fleetId}/vessels`);
  if (!res.ok) throw new Error("Failed to fetch fleet vessels");
  return res.json();
}

// Search vessels of a specific fleet by name/flag/mmsi
export async function searchFleetVessels(fleetId, filters) {
  const params = new URLSearchParams();
  if (filters.name) params.set("name", filters.name);
  if (filters.flag) params.set("flag", filters.flag);
  if (filters.mmsi) params.set("mmsi", filters.mmsi);

  const query = params.toString();
  const url = query
    ? `/api/fleets/${fleetId}/vessels/search?${query}`
    : `/api/fleets/${fleetId}/vessels`;

  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to search fleet vessels");
  return res.json();
}
