import hash from "string-hash";

import { TransitPlan, Stop } from "@reticular/types";
import { Sqlite } from "../sqlite";
import { writeCsv } from "../utils";

export default async function exportTransitPlans(): Promise<void> {
  const sqlite = await Sqlite.getInstance();
  console.log("Exporting transit plans");

  const stops = await sqlite.db().all<Stop[]>(`
    SELECT
      stop_id as id,
      stop_name as name,
      stop_lon as lng,
      stop_lat as lat
    FROM stops
    WHERE stops.parent_station IS NULL
  `);
  const stopsById = stops.reduce((acc, curr) => {
    acc[curr.id] = curr;
    return acc;
  }, {} as { [id: string]: Stop });

  const transitPlans = await sqlite.db().all<{ transit_plan: string; trips: string }[]>(`
    WITH transit_plans AS (
    	SELECT
    		trip_id,
        GROUP_CONCAT(COALESCE(s.parent_station, s.stop_id), "|") as transit_plan
    	FROM
    		stop_times  st
          LEFT JOIN stops s ON s.stop_id = st.stop_id
    	GROUP BY trip_id
    	ORDER BY trip_id, stop_sequence
    )

    SELECT
    	transit_plan,
    	GROUP_CONCAT(trip_id, "|") as trips
    FROM
    	transit_plans
    GROUP BY transit_plan
  `);

  const tps: Array<TransitPlan> = transitPlans.map((t) => {
    const stopIds = t.transit_plan.split("|");
    const name = `${stopsById[stopIds[0]].name} -${stopIds.length > 2 ? ` (${stopIds.length - 2}) ` : ""}-> ${
      stopsById[stopIds[stopIds.length - 1]].name
    }`;
    return {
      id: "" + hash(t.transit_plan),
      name,
      tripIds: t.trips.split("|"),
      stopIds,
    };
  });
  await writeCsv(tps, "transit_plans.csv");
  console.log("Exporting transit plans - Done");
}
