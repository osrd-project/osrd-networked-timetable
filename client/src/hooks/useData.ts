import { useEffect, useState } from "react";
import Graph from "graphology";
import * as Papa from "papaparse";

import { Route, Agency } from "@reticular/types";
import { AppState, GraphNode, GraphEdge } from "../core/state";
import project from "../utils/project";
import {
  DATASET_AGENCIES_PATH,
  DATASET_ROUTES_PATH,
  DATASET_NODES_PATH,
  DATASET_EDGES_PATH,
  DEFAULT_EDGE_COLOR,
  DEFAULT_NODE_COLOR,
  MAX_EDGE_SIZE,
  MAX_NODE_SIZE,
} from "../consts";

function downloadDataAnParseCsv<T>(url: string): Promise<Array<T>> {
  return new Promise((resolve, reject) => {
    Papa.parse<T>(url, {
      download: true,
      delimiter: ",",
      dynamicTyping: true,
      skipEmptyLines: true,
      header: true,
      error: (e) => reject(e),
      complete: (result) => resolve(result.data),
    });
  });
}

type Dataset = Pick<AppState, "agencies" | "routes" | "graph">;

async function prepareData(): Promise<Dataset> {
  const graph = new Graph<GraphNode, GraphEdge>({ multi: true, type: "directed", allowSelfLoops: true });

  // download and parse nodes & edges csv
  const data = await Promise.all([
    downloadDataAnParseCsv<any>(DATASET_NODES_PATH),
    downloadDataAnParseCsv<any>(DATASET_EDGES_PATH),
    downloadDataAnParseCsv<Route>(DATASET_ROUTES_PATH),
    downloadDataAnParseCsv<Agency>(DATASET_AGENCIES_PATH),
  ]);

  // build agencies
  const agencies = data[3] as Array<Agency>;

  // build the index of routes
  const routes = data[2].reduce((acc, curr) => {
    acc[curr.id] = curr;
    return acc;
  }, {} as { [id: string]: Route });

  // build the graph
  data[0].forEach((node) => {
    graph.addNode(node.id, {
      id: node.id,
      label: node.name,
      color: DEFAULT_NODE_COLOR,
      size: 1,
      ...project({ lat: node.lat as number, lng: node.lng as number }),
      routeIds: new Set(),
    });
  });
  data[1].forEach((edge) => {
    graph.addEdgeWithKey(edge.id, edge.source, edge.target, {
      routeIds: new Set<string>(edge.routeIds.split(",")),
      size: Math.log(edge.frequency),
      color: DEFAULT_EDGE_COLOR,
    });
  });

  graph.forEachNode((node) => {
    // Compute nodes size
    const size = graph.reduceEdges(node, (acc, _edge, attr) => acc + attr.size, 0);
    graph.setNodeAttribute(node, "size", size);

    // Compute available routes
    graph.setNodeAttribute(
      node,
      "routeIds",
      graph.reduceEdges(
        node,
        (acc, _edge, attr) => {
          attr.routeIds.forEach((routeId) => acc.add(routeId));
          return acc;
        },
        new Set<string>(),
      ),
    );
  });

  //
  // Compute max values:
  let maxNodeSize = -Infinity;
  let maxEdgeSize = -Infinity;
  graph.forEachNode((_, attr) => {
    if (attr.size > maxNodeSize) maxNodeSize = attr.size;
  });
  graph.forEachEdge((_, attr) => {
    if (attr.size > maxEdgeSize) maxEdgeSize = attr.size;
  });

  // Adjust sizes accordingly:
  graph.forEachNode((node, attr) => {
    graph.setNodeAttribute(node, "size", (attr.size * MAX_NODE_SIZE) / maxNodeSize);
  });
  graph.forEachEdge((edge, attr) => {
    graph.setEdgeAttribute(edge, "size", (attr.size * MAX_EDGE_SIZE) / maxEdgeSize);
  });

  return { agencies, routes, graph };
}

export type IdleState = { type: "idle" };
export type LoadingState = { type: "loading" };
export type ErrorState = { type: "error"; error?: Error };
export type ReadyState = { type: "ready"; dataset: Dataset };
export type DataState = IdleState | LoadingState | ErrorState | ReadyState;

export function useData(): DataState {
  const [state, setState] = useState<DataState>({ type: "idle" });

  useEffect(() => {
    if (state.type !== "idle") return;

    setState({ type: "loading" });
    prepareData()
      .then((dataset) => setState({ type: "ready", dataset: dataset }))
      .catch((error) => setState({ type: "error", error }));
  }, [state.type]);

  return state;
}
