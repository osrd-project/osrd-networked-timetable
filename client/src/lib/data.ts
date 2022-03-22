import { useEffect, useState } from "react";
import { NodeDisplayData } from "sigma/types";
import Graph from "graphology";

import project from "../utils/project";
import { DEFAULT_EDGE_COLOR, DEFAULT_NODE_COLOR, MAX_EDGE_SIZE, MAX_NODE_SIZE } from "../consts";
const TRAIN_STOP_NULLABLE_KEYS = ["pk", "code", "localite", "ligne", "debut", "fin", "etape"] as const;
export type TrainStop = {
  [KEY in typeof TRAIN_STOP_NULLABLE_KEYS[number]]?: string | null;
} & {
  id: string;
  lat: number;
  lon: number;
  pathIds: string[];
};
export interface TrainPath {
  id: string;
  stopIds: string[];
  stopIdsSet: Set<string>;
}

export interface GraphNode extends Pick<NodeDisplayData, "label" | "x" | "y" | "size" | "color"> {
  stopId: string;
}
export interface GraphEdge {
  pathIdsSet: Set<string>;
  size: number;
  color: string;
}

export interface Dataset {
  paths: Record<string, TrainPath>;
  stops: Record<string, TrainStop>;
  graph: Graph<GraphNode, GraphEdge>;
}

function prepareData(object: any): Dataset {
  const dataset: Dataset = {
    paths: {},
    stops: {},
    graph: new Graph<GraphNode, GraphEdge>({ multi: true, type: "directed", allowSelfLoops: true }),
  };

  const graph = new Graph({ multi: true, type: "directed", allowSelfLoops: true });
  graph.import(object);

  graph.forEachNode((node, attr) => {
    dataset.stops[node] = {
      id: attr.id,
      lat: attr.lat,
      lon: attr.lng,
      pathIds: Array.from(
        graph.reduceEdges(
          node,
          (acc, _edge, attr) => {
            attr.trips.forEach((stripId: string) => {
              acc.add(stripId);
            });
            return acc;
          },
          new Set<string>([]),
        ),
      ),
    };

    // compute node's attributes
    graph.replaceNodeAttributes(node, {
      stopId: attr.id,
      label: attr.name,
      color: DEFAULT_NODE_COLOR,
      size: dataset.stops[node].pathIds.length,
      ...project({ lat: attr.lat as number, lon: attr.lng as number }),
    });
  });
  graph.forEachEdge((edge, attr, source, target) => {
    // compute edge's attributes
    graph.replaceEdgeAttributes(edge, {
      pathIdsSet: new Set(attr.trips),
      size: Math.log(attr.trips.length),
      color: DEFAULT_EDGE_COLOR,
    });

    // compute paths indexe
    attr.trips.forEach((tripId: string) => {
      if (!dataset.paths[tripId]) {
        dataset.paths[tripId] = {
          id: tripId,
          stopIds: [],
          stopIdsSet: new Set<string>([]),
        };
      }
      dataset.paths[tripId].stopIdsSet.add(source);
      dataset.paths[tripId].stopIdsSet.add(target);
      dataset.paths[tripId].stopIds = Array.from(dataset.paths[tripId].stopIdsSet);
    });
  });

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

  dataset.graph = graph as Graph<GraphNode, GraphEdge>;
  return dataset;
}

export type IdleState = { type: "idle" };
export type LoadingState = { type: "loading" };
export type ErrorState = { type: "error"; error?: Error };
export type ReadyState = { type: "ready"; dataset: Dataset };
export type DataState = IdleState | LoadingState | ErrorState | ReadyState;

export function useData(datasetPath: string): DataState {
  const [state, setState] = useState<DataState>({ type: "idle" });

  useEffect(() => {
    if (state.type !== "idle") return;

    setState({ type: "loading" });
    fetch(datasetPath)
      .then((res) => res.json())
      .then((rawData) => prepareData(rawData))
      .then((dataset) => setState({ type: "ready", dataset: dataset }))
      .catch((error) => setState({ type: "error", error }));
  }, [datasetPath, state.type]);

  return state;
}
