import { Sqlite } from "../sqlite";
import { writeFile } from "../utils";

import { Trip, StopTime } from "@reticular/types";

export default async function exportTrips(): Promise<void> {
  console.log("Exporting trips");
  const sqlite = await Sqlite.getInstance();
  // Retrieve the list of trips
  const trips = await sqlite.db().all<Trip[]>(`
      SELECT
      	trip_id as id,
        trip_headsign as headsign,
        direction_id as direction,
        monday,
        tuesday,
        wednesday,
        thursday,
        friday,
        saturday,
        sunday,
        start_date,
        end_date,
        GROUP_CONCAT( CASE WHEN exception_type = 1 THEN date ELSE NULL END,',') AS dates,
        GROUP_CONCAT( CASE WHEN exception_type = 2 THEN date ELSE NULL END , ',') AS exceptions
      FROM
      	trips
          LEFT JOIN calendar on trips.service_id = calendar.service_id
          LEFT JOIN calendar_dates on trips.service_id = calendar_dates.service_id
      GROUP BY id
      ORDER BY headsign, id`);

  // For each trip, we retrieve the list of stops with their times
  let i = 0; //just and index to know where we are in the total export
  for (let trip of trips) {
    i++;
    trip.stops = await sqlite.db().all<Array<StopTime>>(`
          SELECT
            COALESCE(stops.parent_station, stops.stop_id) as id,
            stop_times.arrival_time AS arrival,
            stop_times.departure_time AS departure,
            stop_times.stop_sequence AS sequence
          FROM
            stop_times
              LEFT JOIN stops ON stop_times.stop_id = stops.stop_id
          WHERE
            stop_times.trip_id = "${trip.id}"
          ORDER BY
            stop_times.stop_sequence ASC
      `);
    await writeFile(JSON.stringify(trip), `trips/${trip.id}.json`);
    console.log(`Exporting trip ${id} / ${trips.length}`);
  }
  console.log("Exporting trips - Done");
}
