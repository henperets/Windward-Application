import React, { useState } from "react";

// Table for vessels on the fleet page.
function VesselsTable({ vessels }) {
  const [sortBy, setSortBy] = useState("name");
  const [direction, setDirection] = useState("asc");

  const handleSort = (col) => {
    if (sortBy === col) {
      setDirection(direction === "asc" ? "desc" : "asc");
    } else {
      setSortBy(col);
      setDirection("asc");
    }
  };

  const sorted = [...vessels].sort((a, b) => {
    const valA = a[sortBy];
    const valB = b[sortBy];

    if (valA == null) return 1;
    if (valB == null) return -1;

    if (typeof valA === "string") {
      const comp = valA.localeCompare(valB);
      return direction === "asc" ? comp : -comp;
    } else {
      const comp = (valA || 0) - (valB || 0);
      return direction === "asc" ? comp : -comp;
    }
  });

  const sortIndicator = (col) =>
    sortBy === col ? (direction === "asc" ? " ▲" : " ▼") : "";

  return (
    <table className="data-table">
      <thead>
        <tr>
          <th onClick={() => handleSort("name")}>
            Name{sortIndicator("name")}
          </th>
          <th onClick={() => handleSort("flag")}>
            Flag{sortIndicator("flag")}
          </th>
          <th onClick={() => handleSort("mmsi")}>
            MMSI{sortIndicator("mmsi")}
          </th>
          <th onClick={() => handleSort("fleetValue")}>
            Fleet value{sortIndicator("fleetValue")}
          </th>
        </tr>
      </thead>
      <tbody>
        {sorted.map((v) => (
          <tr key={v.fleetVesselId}>
            <td>{v.name || "-"}</td>
            <td>{v.flag || "-"}</td>
            <td>{v.mmsi || "-"}</td>
            <td>{v.fleetValue?.toFixed?.(2) || "-"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default VesselsTable;
