import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchFleets } from "../api";
import FleetsTable from "../components/FleetsTable";

// shows all fleets in a table
function FleetsListPage() {
  const [fleets, setFleets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // On first startup, load the fleets from the server
  useEffect(() => {
    (async () => {
      try {
        const data = await fetchFleets();
        setFleets(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load fleets");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleRowClick = (fleetId) => {
    navigate(`/fleet/${fleetId}`);
  };

  if (loading) return <div>Loading fleets...</div>;
  if (error) return <div style={{ color: "tomato" }}>{error}</div>;

  return (
    <div>
      <div className="page-header">
        <div>
          <h2 className="page-title">Fleets overview</h2>
          <p className="page-subtitle">
            Click a fleet to view its vessels and locations.
          </p>
        </div>
        <span className="badge">
          <span className="badge-dot" />
          {fleets.length} fleets loaded
        </span>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="card-title">Fleets</div>
          <div className="card-kicker">Sortable by name &amp; vessel count</div>
        </div>
        <FleetsTable fleets={fleets} onRowClick={handleRowClick} />
      </div>
    </div>
  );
}

export default FleetsListPage;
