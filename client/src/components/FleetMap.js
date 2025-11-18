import React, { useMemo, useState } from "react";
import Map, { Marker, Popup } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const MAP_STYLE = "mapbox://styles/mapbox/dark-v11";
const MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_TOKEN;

// Map showing all vessels in a fleet that have positions
function FleetMap({ vessels }) {
  const [selectedVessel, setSelectedVessel] = useState(null);

  // Only vessels that actually have location data
  const vesselsWithLocation = useMemo(
    () =>
      vessels.filter((v) => {
        const coords = v.location?.geometry?.coordinates;
        return Array.isArray(coords) && coords.length === 2;
      }),
    [vessels]
  );

  const initialViewState = useMemo(() => {
    if (vesselsWithLocation.length === 0) {
      return { longitude: 0, latitude: 0, zoom: 1 };
    }

    let sumLon = 0;
    let sumLat = 0;
    vesselsWithLocation.forEach((v) => {
      const [lon, lat] = v.location.geometry.coordinates;
      sumLon += lon;
      sumLat += lat;
    });
    const count = vesselsWithLocation.length;

    return {
      longitude: sumLon / count,
      latitude: sumLat / count,
      zoom: 3,
    };
  }, [vesselsWithLocation]);

  if (!MAPBOX_TOKEN) {
    return (
      <div style={{ padding: "0.5rem", color: "#fbbf24", fontSize: "0.8rem" }}>
        Mapbox token missing. Set <code>REACT_APP_MAPBOX_TOKEN</code> in{" "}
        <code>client/.env</code>.
      </div>
    );
  }

  return (
    <div style={{ height: "360px", borderRadius: "12px" }}>
      <Map
        mapboxAccessToken={MAPBOX_TOKEN}
        initialViewState={initialViewState}
        style={{ width: "100%", height: "100%" }}
        mapStyle={MAP_STYLE}
        onClick={() => setSelectedVessel(null)}
      >
        {vesselsWithLocation.map((v) => {
          const [lon, lat] = v.location.geometry.coordinates;
          return (
            <Marker
              key={v.fleetVesselId}
              longitude={lon}
              latitude={lat}
              anchor="bottom"
              onClick={(e) => {
                e.originalEvent.stopPropagation();
                setSelectedVessel(v);
              }}
            >
              <div
                style={{
                  width: 13,
                  height: 13,
                  borderRadius: "50%",
                  background:
                    "radial-gradient(circle at center, #f97316, #ef4444)",
                  border: "2px solid #0f172a",
                  boxShadow: "0 0 10px rgba(248, 113, 113, 0.9)",
                  cursor: "pointer",
                }}
              />
            </Marker>
          );
        })}

        {selectedVessel && (
          <Popup
            anchor="bottom"
            offset={20}
            longitude={selectedVessel.location.geometry.coordinates[0]}
            latitude={selectedVessel.location.geometry.coordinates[1]}
            onClose={() => setSelectedVessel(null)}
            closeOnClick={false}
          >
            <div style={{ maxWidth: "220px", fontSize: "0.8rem" }}>
              <strong>{selectedVessel.name || "Unknown vessel"}</strong>
              <div>Flag: {selectedVessel.flag || "-"}</div>
              <div>MMSI: {selectedVessel.mmsi || "-"}</div>
              <div>
                Position:{" "}
                {selectedVessel.location.geometry.coordinates[1].toFixed(4)}°,{" "}
                {selectedVessel.location.geometry.coordinates[0].toFixed(4)}°
              </div>
              <div>SOG: {selectedVessel.location.sog ?? "-"} kn</div>
              <div>Course: {selectedVessel.location.course ?? "-"}°</div>
              <div>Last update: {selectedVessel.location.ts}</div>
            </div>
          </Popup>
        )}
      </Map>
    </div>
  );
}

export default FleetMap;
