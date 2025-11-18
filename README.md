Hello Windward and thank you for this opportunity!

I've created the requested application for exploring fleets, their vessels, and their locations on a map.

The project is split into:

`server/` - Node.js + Express API, reads the JSON files and serves data.
`client/` - React single page app, shows the tables and the map.

There is no database. All data is loaded from the JSON files into memory on server start, as requested in the assignment.

## Data

The server uses the 3 JSON files you provided:

- `vessels.json` - base vessel info (name, flag, MMSI, etc.).
- `fleets.json` - list of fleets and the vessel IDs that belong to each fleet, including the “value” for that vessel in that fleet.
- `vesselLocations.json` - last known location for some of the vessels (position, speed, course, timestamp).

## API

All logic is in memory, no DB.

- `GET /api/fleets`  
  Returns basic fleet info: `_id`, `name`, `vesselsCount`.

- `GET /api/fleets/:fleetId/vessels`  
  Returns all vessels in a fleet, enriched with:
  - vessel details (from `vessels.json`)
  - `fleetValue` (from `fleets.json`)
  - last known location if it exists (from `vesselLocations.json`)

## How to run

```bash
# install dependencies (origin + client + server)
npm install

# then run the app
npm start
