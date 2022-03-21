import { useEffect, useState } from "react";
import { isArray, isNil, isPlainObject, pick } from "lodash";
import { NodeDisplayData } from "sigma/types";
import Graph from "graphology";

import project from "../utils/project";
import { DEFAULT_EDGE_COLOR, DEFAULT_NODE_COLOR, MAX_EDGE_SIZE, MAX_NODE_SIZE } from "../consts";

const TRAIN_STOP_KEYS = ["uic", "lat", "lon"] as const;
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

export function prepareData(object: unknown): Dataset {
  if (!isPlainObject(object)) throw TypeError("prepareData: The input should be a collection of paths.");

  const dataset: Dataset = {
    paths: {},
    stops: {},
    graph: new Graph<GraphNode, GraphEdge>({ multi: true, type: "directed", allowSelfLoops: true }),
  };

  const collection = object as Record<string, unknown>;
  for (const pathId in collection) {
    if (!collection.hasOwnProperty(pathId)) continue;
    if (!isArray(collection[pathId])) throw TypeError(`prepareData: The path ${pathId} is not an array of stops.`);

    const path = collection[pathId] as unknown[];

    if (
      path.some((rawStop: unknown, i) => {
        if (!isPlainObject(rawStop))
          throw TypeError(`prepareData: The ${i}-th element path ${pathId} is not a plain object.`);

        const stop = rawStop as Record<string, unknown>;
        const badKey = TRAIN_STOP_KEYS.find((key) => typeof stop[key] !== "string");
        if (badKey) {
          console.warn(
            `The ${i}-th stop of path "${pathId}" has a ${typeof stop[
              badKey
            ]} instead of a string for "${badKey}". This path is skipped.`,
          );
          return true;
        }

        const badNullableKey = TRAIN_STOP_KEYS.find((key) => !isNil(stop[key]) && typeof stop[key] !== "string");
        if (badNullableKey) {
          console.warn(
            `The ${i}-th stop of path "${pathId}" has a ${typeof stop[
              badNullableKey
            ]} instead of a string or null for "${badNullableKey}". This path is skipped.`,
          );
          return true;
        }

        if (stop.lat === "0" || stop.lon === "0") {
          console.warn(`The ${i}-th stop of path "${pathId}" has bad coordinates. This path is skipped.`);
          return true;
        }

        return false;
      })
    ) {
      continue;
    }

    const stopIds = path.map((rawStop: unknown, i, a) => {
      const stop = rawStop as Record<string, unknown>;
      const stopId = stop.uic as string;
      const previousStopId = !!i ? (a[i - 1] as Record<string, unknown>).uic : null;

      // 1. Create or update node and stop:
      if (!dataset.graph.hasNode(stopId)) {
        const cleanedStop = {
          ...pick(stop, TRAIN_STOP_NULLABLE_KEYS),
          id: stop.uic,
          lat: +(stop.lat as string),
          lon: +(stop.lon as string),
          pathIds: [pathId],
        } as TrainStop as TrainStop;
        dataset.graph.addNode(cleanedStop.id, {
          label: cleanedStop.localite || cleanedStop.id,
          color: DEFAULT_NODE_COLOR,
          size: 1,
          stopId: cleanedStop.id,
          ...project(cleanedStop),
        });
        dataset.stops[cleanedStop.id] = cleanedStop;
      } else {
        dataset.stops[stopId].pathIds.push(pathId);
      }

      // Create or update edge:
      if (typeof previousStopId === "string") {
        const edgeId = [previousStopId, stopId].join("->");
        if (!dataset.graph.hasEdge(edgeId)) {
          dataset.graph.addEdgeWithKey(edgeId, previousStopId, stopId, {
            pathIdsSet: new Set([pathId]),
            color: DEFAULT_EDGE_COLOR,
            size: 1,
          });
        } else {
          dataset.graph.updateEdgeAttribute(edgeId, "pathIdsSet", (ids) => {
            ids = ids || new Set<string>();
            ids.add(pathId);
            return ids;
          });
        }
      }

      return stopId;
    });

    dataset.paths[pathId] = {
      id: pathId,
      stopIds: stopIds,
      stopIdsSet: new Set(stopIds),
    };
  }

  // Set crossing paths count as node sizes:
  dataset.graph.forEachNode((node) => {
    dataset.graph.setNodeAttribute(node, "size", dataset.stops[node].pathIds.length);
  });

  // Set paths count as edge sizes:
  dataset.graph.forEachEdge((edge, attr) => {
    dataset.graph.setEdgeAttribute(edge, "size", Math.log(attr.pathIdsSet.size));
  });

  // Compute max values:
  let maxNodeSize = -Infinity;
  let maxEdgeSize = -Infinity;
  dataset.graph.forEachNode((_, attr) => {
    if (attr.size > maxNodeSize) maxNodeSize = attr.size;
  });
  dataset.graph.forEachEdge((_, attr) => {
    if (attr.size > maxEdgeSize) maxEdgeSize = attr.size;
  });

  // Adjust sizes accordingly:
  dataset.graph.forEachNode((node, attr) => {
    dataset.graph.setNodeAttribute(node, "size", (attr.size * MAX_NODE_SIZE) / maxNodeSize);
  });
  dataset.graph.forEachEdge((edge, attr) => {
    dataset.graph.setEdgeAttribute(edge, "size", (attr.size * MAX_EDGE_SIZE) / maxEdgeSize);
  });

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
