import { Settings } from "sigma/settings";
import { Attributes } from "graphology-types";
import { uniq } from "lodash";

import { Dataset } from "./data";
import { GREYED_NODE_COLOR, GREYED_EDGE_COLOR } from "../consts";

export interface Selection {
  type: "route" | "stop";
  ids: string[];
}

export interface GraphState {
  hoveredNode?: string | null;
  hoveredEdge?: string | null;
  selection?: Selection | null;
}

export interface Highlights {
  stopIds?: string[];
  routeIds?: string[];
}

export function getReducers(
  dataset: Dataset,
  highlight?: Highlights | null,
): { node: NonNullable<Settings["nodeReducer"]>; edge: NonNullable<Settings["edgeReducer"]> } {
  let routeIds: string[] | null = highlight ?.routeIds || null;
  let selectedNodes: Set<string> | null = null;
  let highlightedNodes: Set<string> | null = null;
  let highlightedEdges: Set<string> | null = null;

  console.log(dataset)

  if (highlight ?.stopIds) {
    highlightedNodes = new Set(highlight.stopIds);

    routeIds = routeIds || [];
    // forEach(dataset.paths, ({ id, stopIdsSet }) => {
    //   if (highlight.stopIds!.every((id) => stopIdsSet.has(id))) pathIds!.push(id);
    // });
    routeIds = uniq(routeIds);

    selectedNodes = new Set(highlightedNodes);
  }

  if (routeIds) {
    highlightedNodes = highlightedNodes || new Set();
    highlightedEdges = new Set();

    // dataset.graph.forEachEdge((edge, { pathIdsSet }) => {
    //   if (pathIds!.some((id) => pathIdsSet.has(id))) highlightedEdges!.add(edge);
    // });
    // pathIds.forEach((path) => {
    //   const stops = dataset.paths[path].stopIds;
    //   stops!.forEach((id) => highlightedNodes!.add(id));
    // });
  }

  return {
    node(node: string, data: Attributes) {
      const res = { ...data };

      if (highlightedNodes && !highlightedNodes.has(node)) {
        res.color = GREYED_NODE_COLOR;
        res.label = null;
        res.zIndex = -1;
      }

      if (selectedNodes && selectedNodes.has(node)) {
        res.highlighted = true;
      }

      return res;
    },
    edge(edge: string, data: Attributes) {
      const res = { ...data };

      if (highlightedEdges && !highlightedEdges.has(edge)) {
        res.color = GREYED_EDGE_COLOR;
        res.label = null;
        res.zIndex = -1;
      }

      return res;
    },
  };
}

export function pathsToStopsSelection(selection: Selection, dataset: Dataset): Selection {
  if (!selection.ids.length || selection.type !== "route") return selection;
  console.log(dataset)
  return {
    type: "stop",
    ids: [] //uniq(selection.ids.flatMap((id) => dataset.paths[id].stopIds)),
  };
}

export function stopsToPathsSelection(selection: Selection, dataset: Dataset): Selection {
  if (!selection.ids.length || selection.type !== "stop") return selection;
  console.log(dataset)
  return {
    type: "route",
    ids: [] //uniq(selection.ids.flatMap((id) => dataset.stops[id].pathIds)),
  };
}
