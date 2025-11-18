const fs = require("fs");
const path = require("path");

// Memory caches
let vesselsById = new Map();
let locationsById = new Map();
let fleets = [];

// Load and prepare all data in memory and call once at server
function loadData() {
  const vesselsPath = path.join(__dirname, "..", "data", "vessels.json");
  const fleetsPath = path.join(__dirname, "..", "data", "fleets.json");
  const locationsPath = path.join(
    __dirname,
    "..",
    "data",
    "vesselLocations.json"
  );

  const vessels = JSON.parse(fs.readFileSync(vesselsPath, "utf8"));
  const fleetsData = JSON.parse(fs.readFileSync(fleetsPath, "utf8"));
  const locations = JSON.parse(fs.readFileSync(locationsPath, "utf8"));

  // Map vessels by _id
  vesselsById = new Map();
  vessels.forEach((v) => {
    vesselsById.set(v._id, v);
  });

  // Map locations by _id (same _id as vessel when location exists)
  locationsById = new Map();
  locations.forEach((loc) => {
    locationsById.set(loc._id, loc.lastpos);
  });

  fleets = fleetsData;
}

// Basic fleets info: name + vessels count
function getFleetsBasicInfo() {
  return fleets.map((fleet) => ({
    _id: fleet._id,
    name: fleet.name,
    vesselsCount: Array.isArray(fleet.vessels) ? fleet.vessels.length : 0,
  }));
}

// Full vessels of a fleet, enriched with vessel details & location.
function getFleetVessels(fleetId) {
  const fleet = fleets.find((f) => f._id === fleetId);
  if (!fleet) return null;

  const result = (fleet.vessels || []).map((fv) => {
    const vessel = vesselsById.get(fv._id) || {};
    const location = locationsById.get(fv._id) || null;

    return {
      fleetVesselId: fv._id,
      fleetValue: fv.value,
      ...vessel,
      location,
    };
  });

  return result;
}

// Search vessels within a fleet by name, flag, and/or mmsi
function searchFleetVessels(fleetId, { name, flag, mmsi }) {
  const vessels = getFleetVessels(fleetId);
  if (!vessels) return null;

  const nameFilter = name?.trim().toLowerCase();
  const flagFilter = flag?.trim().toLowerCase();
  const mmsiFilter = mmsi?.trim();

  return vessels.filter((v) => {
    if (nameFilter && !(v.name || "").toLowerCase().includes(nameFilter)) {
      return false;
    }
    if (flagFilter && !(v.flag || "").toLowerCase().includes(flagFilter)) {
      return false;
    }
    if (mmsiFilter && String(v.mmsi || "") !== mmsiFilter) {
      return false;
    }
    return true;
  });
}

module.exports = {
  loadData,
  getFleetsBasicInfo,
  getFleetVessels,
  searchFleetVessels,
};
