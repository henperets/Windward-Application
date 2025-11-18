import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import FleetsListPage from "./pages/FleetsListPage";
import FleetPage from "./pages/FleetPage";

function App() {
  return (
    <div className="app-shell">
      <header className="app-header">
        <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
          <h1 className="app-title">
            Windward <span>Fleets</span>
          </h1>
        </Link>
        <p className="app-subtitle">
          Explore fleets, vessels &amp; live positions
        </p>
      </header>

      <main className="app-main">
        <Routes>
          <Route path="/" element={<FleetsListPage />} />
          <Route path="/fleet/:fleetId" element={<FleetPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
