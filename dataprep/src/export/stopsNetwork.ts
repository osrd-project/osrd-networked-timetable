import Graph from "graphology";

import { Sqlite } from "../sqlite";
import { writeFile, writeCsv } from "./utils";

export async function exportStopsNetwork(): Promise<void> {
  const sqlite = await Sqlite.getInstance();

  const graph = new Graph();

  // Nodes
  const stops = await sqlite.db().all(`
    SELECT
      stop_id as id,
      stop_name as name,
      stop_lon as lng,
      stop_lat as lat
    FROM stops
    WHERE stops.parent_station IS NULL
  `);
  stops.forEach((stop) => {
    graph.addNode(stop.id, stop);
  });

  const trips = await sqlite.db().all(`
    SELECT
    	trip_id as id,
    	group_concat( COALESCE(s.parent_station, s.stop_id), "|" )  as stops
    FROM
    	stop_times st LEFT JOIN stops s ON st.stop_id = s.stop_id
    GROUP BY trip_id
    ORDER BY
    	st.trip_id ASC,
    	st.stop_sequence ASC
  `);
  trips.forEach((trip) => {
    const stops: Array<string> = trip.stops.split("|");
    if (stops.length > 1) {
      let prev = stops[0];
      stops.slice(1).forEach((stop: string) => {
        const edgeKey = `${prev}->${stop}`;
        if (!graph.hasEdge(edgeKey)) {
          graph.addEdgeWithKey(edgeKey, prev, stop, {
            trips: [trip.id],
          });
        } else {
          graph.updateEdgeAttribute(edgeKey, "trips", (ids) => {
            return [...ids, trip.id];
          });
        }
        prev = stop;
      });
    }
  });

  await writeCsv(
    graph.mapNodes((_node, attributes) => attributes),
    "stopsNetwork-nodes.csv",
  );
  await writeCsv(
    graph.mapEdges((edge, attributes, source, target) => ({
      id: edge,
      source,
      target,
      trips: attributes.trips,
    })),
    "stopsNetwork-edges.csv",
  );
  await writeFile(JSON.stringify(graph.export()), "stopsNetwork.json");
}
