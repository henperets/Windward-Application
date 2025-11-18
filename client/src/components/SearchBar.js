import React from "react";

// Top search section on the fleet page.
// Lets the user type name/flag/MMSI and hit Search.
function SearchBar({ filters, setFilters, onSearch, flagOptions = [] }) {
  const handleChange = (field) => (e) => {
    setFilters((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch();
  };

  return (
    <form className="search-form" onSubmit={handleSubmit}>
      <div className="search-field">
        <label className="search-label">Name</label>
        <input
          className="search-input"
          value={filters.name}
          onChange={handleChange("name")}
          placeholder="e.g. GRECALE"
        />
      </div>

      <div className="search-field">
        <label className="search-label">Flag</label>
        <input
          className="search-input"
          value={filters.flag}
          onChange={handleChange("flag")}
          placeholder="e.g. Italy"
          list="flag-options" // link to datalist
        />
        {/* datalist provides the dropdown of unique flags for this fleet */}
        <datalist id="flag-options">
          {flagOptions.map((flag) => (
            <option key={flag} value={flag} />
          ))}
        </datalist>
      </div>

      <div className="search-field">
        <label className="search-label">MMSI</label>
        <input
          className="search-input"
          value={filters.mmsi}
          onChange={handleChange("mmsi")}
          placeholder="e.g. 247179700"
        />
      </div>

      <button type="submit" className="btn-primary">
        Search
      </button>
    </form>
  );
}

export default SearchBar;
