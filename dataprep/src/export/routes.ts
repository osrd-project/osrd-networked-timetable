import { pick } from "lodash";
import Graph from "graphology";

import { Sqlite } from "../sqlite";
import { writeFile } from "../utils";
import { Route, RouteFull, Trip, Stop, StopTime } from "@reticular/types";

/**
 * Create one file per route.
 * Contains :
 * - the detail of the route (id, code & name)
 * - the network of the route where on each edges we've got the list of trip_id
 * - a map of trips defined by : a list of ordered stop with their times
 */
export async function exportRoutes(): Promise<void> {
  const sqlite = await Sqlite.getInstance();
  const routes = await sqlite.db().all<Route[]>(`
    SELECT
      route_id as id,
      route_short_name as code,
      route_long_name as name,
      route_desc as description,
      agency_id as agencyId
    FROM routes
  `);

  for (let route of routes) {
    console.log(`Exporting route ${route.id}`);
    const graph = new Graph({ multi: true });
    const result: RouteFull = {
      ...route,
      network: {},
      trips: [],
    };

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
        WHERE
        	route_id="${route.id}"
        GROUP BY id
        ORDER BY headsign, id
      `);

    // For each trip, we retrieve the list of stops with their times
    await Promise.all(
      trips.map(async (trip: Trip) => {
        console.log(`Exporting route ${route.id} > ${trip.id}`);
        const stops = await sqlite.db().all<Array<Stop & StopTime>>(`
            WITH stops_main AS (
              SELECT
                s1.stop_id as stop_id,
                s2.stop_id as id,
                s2.stop_name as name,
                s2.stop_lon as lng,
                s2.stop_lat as lat
              FROM
                stops s1
                  LEFT JOIN stops s2 on COALESCE(s1.parent_station, s1.stop_id) = s2.stop_id
              )

              SELECT
                id,
                name,
                lng,
                lat,
                stop_times.arrival_time AS arrival,
                stop_times.departure_time AS departure,
                stop_times.stop_sequence AS sequence
              FROM
                stop_times
                  LEFT JOIN stops_main ON stop_times.stop_id = stops_main.stop_id
              WHERE
                stop_times.trip_id = "${trip.id}"
              ORDER BY
                stop_times.stop_sequence ASC
          `);
        // add trip to route network
        graph.mergeNode(stops[0].id, pick(stops[0], ["id", "name", "lat", "lng"]));
        let prev = stops[0].id;
        stops.slice(1).forEach((stop) => {
          graph.mergeNode(stop.id, pick(stop, ["id", "name", "lat", "lng"]));
          graph.addEdge(prev, stop.id, { tripId: trip.id });
          prev = stop.id;
        });

        result.trips.push({
          ...trip,
          stops: stops.map((s) => pick(s, ["id", "arrival", "departure", "sequence"])),
        });

        console.log(`Exporting route ${route.id} > ${trip.id} - done`);
      }),
    );

    result.network = graph.toJSON();
    await writeFile(JSON.stringify(result), `routes/${route.id}.json`);
    console.log(`Exporting route ${route.id} - done`);
  }
}
