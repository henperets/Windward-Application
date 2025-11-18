const express = require("express");
const {
  loadData,
  getFleetsBasicInfo,
  getFleetVessels,
  searchFleetVessels,
} = require("./dataStore");

const app = express();
const PORT = 4000;

// Parse JSON bodies
app.use(express.json());

// Load data once on startup
loadData();

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// Return basic fleets info: name + vessels count
app.get("/api/fleets", (req, res) => {
  res.json(getFleetsBasicInfo());
});

// Return full vessels for a specific fleet
app.get("/api/fleets/:fleetId/vessels", (req, res) => {
  const { fleetId } = req.params;
  const vessels = getFleetVessels(fleetId);
  if (!vessels) {
    return res.status(404).json({ error: "Fleet not found" });
  }
  res.json(vessels);
});

// Search by one or more filters.
app.get("/api/fleets/:fleetId/vessels/search", (req, res) => {
  const { fleetId } = req.params;
  const { name = "", flag = "", mmsi = "" } = req.query;

  const vessels = searchFleetVessels(fleetId, { name, flag, mmsi });
  if (vessels === null) {
    return res.status(404).json({ error: "Fleet not found" });
  }
  res.json(vessels);
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
