import React, { useState } from "react";

// Table for the main fleets overview page.
function FleetsTable({ fleets, onRowClick }) {
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

  const sorted = [...fleets].sort((a, b) => {
    const valA = a[sortBy];
    const valB = b[sortBy];

    if (valA == null) return 1;
    if (valB == null) return -1;

    if (typeof valA === "string") {
      const comp = valA.localeCompare(valB);
      return direction === "asc" ? comp : -comp;
    } else {
      const comp = valA - valB;
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
            Fleet name{sortIndicator("name")}
          </th>
          <th onClick={() => handleSort("vesselsCount")}>
            Vessels{sortIndicator("vesselsCount")}
          </th>
        </tr>
      </thead>
      <tbody>
        {sorted.map((fleet) => (
          <tr
            key={fleet._id}
            className="data-table-row-clickable"
            onClick={() => onRowClick(fleet._id)}
          >
            <td>{fleet.name}</td>
            <td>{fleet.vesselsCount}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default FleetsTable;
