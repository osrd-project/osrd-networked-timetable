import Graph from "graphology";

import { Sqlite } from "../sqlite";
import { writeCsv } from "../utils";
import { Stop } from "@reticular/types";

export async function exportStopsNetwork(): Promise<void> {
  const sqlite = await Sqlite.getInstance();

  const graph = new Graph();

  // Nodes
  const stops = await sqlite.db().all<Stop[]>(`
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

  const routes = await sqlite.db().all(`
    WITH stops_by_trip_with_index as (
      SELECT
          t.route_id as route_id,
      		COALESCE(s.parent_station, s.stop_id) as stop_id,
      		st.stop_sequence as stop_sequence,
      		t.trip_id as trip_id,
      		ROW_NUMBER() OVER(PARTITION BY t.route_id, s.stop_id , st.stop_sequence ORDER BY t.route_id , s.stop_id, st.stop_sequence ) AS row_number
          FROM
          	stop_times st
      			LEFT JOIN stops s ON st.stop_id = s.stop_id
      			LEFT JOIN trips t ON st.trip_id = t.trip_id
          ORDER BY
          	t.route_id ASC,
      		s.stop_name ,
          	st.stop_sequence ASC
    )
    SELECT
      route_id as id,
      group_concat(stop_id, "|") AS stops,
      nb
    FROM(
      SELECT
      	 route_id,
      	 stop_id,
      	 MAX(row_number) as nb
      FROM
      	stops_by_trip_with_index
      GROUP BY route_id, stop_id, stop_sequence
      ORDER BY route_id, trip_id, stop_sequence
    )
    GROUP BY route_id
  `);
  routes.forEach((route) => {
    const stops: Array<string> = route.stops.split("|");
    if (stops.length > 1) {
      let prev = stops[0];
      stops.slice(1).forEach((stop: string) => {
        const edgeKey = `${prev}->${stop}`;
        if (!graph.hasEdge(edgeKey)) {
          graph.addEdgeWithKey(edgeKey, prev, stop, {
            routeIds: [route.id],
            frequency: route.nb,
          });
        } else {
          graph.updateEdgeAttributes(edgeKey, (attr) => {
            return {
              routeIds: [...attr.routeIds, route.id],
              frequency: attr.frequency + route.nb,
            };
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
      ...attributes,
    })),
    "stopsNetwork-edges.csv",
  );
}
