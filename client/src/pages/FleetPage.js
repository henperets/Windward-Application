import React, { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { fetchFleetVessels, searchFleetVessels } from "../api";
import VesselsTable from "../components/VesselsTable";
import FleetMap from "../components/FleetMap";
import SearchBar from "../components/SearchBar";

function FleetPage() {
  const { fleetId } = useParams();
  const [vessels, setVessels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({ name: "", flag: "", mmsi: "" });

  // Load all vessels for this fleet when the page first loads
  useEffect(() => {
    (async () => {
      try {
        const data = await fetchFleetVessels(fleetId);
        setVessels(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load fleet vessels");
      } finally {
        setLoading(false);
      }
    })();
  }, [fleetId]);

  // Called when user hits "Search" or when we change filters in the dropdown
  const handleSearch = async () => {
    try {
      setLoading(true);
      const data = await searchFleetVessels(fleetId, filters);
      setVessels(data);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to search vessels");
    } finally {
      setLoading(false);
    }
  };

  // Compute all unique flags in the current fleet.
  // Used for the small "Flags in this fleet" dropdown above the table.
  const flagOptions = useMemo(() => {
    const flags = vessels.map((v) => v.flag).filter(Boolean);
    return Array.from(new Set(flags)).sort((a, b) => a.localeCompare(b));
  }, [vessels]);

  if (loading && vessels.length === 0) return <div>Loading vessels...</div>;
  if (error) return <div style={{ color: "tomato" }}>{error}</div>;

  return (
    <div>
      <div className="page-header">
        <div>
          <h2 className="page-title">Fleet {fleetId}</h2>
          <p className="page-subtitle">
            Filter by name, flag or MMSI to focus on specific vessels.
          </p>
        </div>
        <span className="badge">
          <span className="badge-dot" />
          {vessels.length} vessels in view
        </span>
      </div>

      {/* pass flagOptions into SearchBar */}
      <SearchBar
        filters={filters}
        setFilters={setFilters}
        onSearch={handleSearch}
        flagOptions={flagOptions}
      />

      <div className="grid-2col">
        <div className="card">
          <div className="card-header">
            <div className="card-title">Vessels</div>
            <div className="card-kicker">
              Sorted by name, flag, MMSI or value
            </div>
          </div>
          <VesselsTable vessels={vessels} />
        </div>

        <div className="card card-map">
          <div className="card-header" style={{ marginBottom: "0.5rem" }}>
            <div className="card-title">Fleet map</div>
            <div className="card-kicker">Click markers for vessel details</div>
          </div>
          <FleetMap vessels={vessels} />
        </div>
      </div>
    </div>
  );
}

export default FleetPage;
