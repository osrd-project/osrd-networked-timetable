import { Sqlite } from "../sqlite";
import { writeCsv } from "../utils";

import { Stop } from "@reticular/types";

export default async function exportStops(): Promise<void> {
  console.log("Exporting stops");
  const sqlite = await Sqlite.getInstance();
  const stops = await sqlite.db().all<Stop[]>(`
    SELECT
      stop_id as id,
      stop_name as name,
      stop_lon as lng,
      stop_lat as lat
    FROM stops
    WHERE stops.parent_station IS NULL
  `);
  await writeCsv(stops, "stops.csv");
  console.log("Exporting stops table - Done");
}
