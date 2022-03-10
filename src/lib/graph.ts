import { Settings } from "sigma/settings";
import { Attributes } from "graphology-types";

import { Dataset } from "./data";
import { GREYED_NODE_COLOR, GREYED_EDGE_COLOR } from "../consts";
import { forEach, uniq } from "lodash";

export interface Selection {
  type: "path" | "stop";
  ids: string[];
}

export interface GraphState {
  hoveredNode?: string | null;
  hoveredEdge?: string | null;
  selection?: Selection | null;
}

export interface Highlights {
  stopIds?: string[];
  pathIds?: string[];
}

export function getReducers(
  dataset: Dataset,
  highlight?: Highlights | null,
): { node: NonNullable<Settings["nodeReducer"]>; edge: NonNullable<Settings["edgeReducer"]> } {
  let pathIds: string[] | null = highlight?.pathIds || null;
  let selectedNodes: Set<string> | null = null;
  let highlightedNodes: Set<string> | null = null;
  let highlightedEdges: Set<string> | null = null;

  if (highlight?.stopIds) {
    highlightedNodes = new Set(highlight.stopIds);

    pathIds = pathIds || [];
    forEach(dataset.paths, ({ id, stopIdsSet }) => {
      if (highlight.stopIds!.every((id) => stopIdsSet.has(id))) pathIds!.push(id);
    });
    pathIds = uniq(pathIds);

    selectedNodes = new Set(highlightedNodes);
  }

  if (pathIds) {
    highlightedNodes = highlightedNodes || new Set();
    highlightedEdges = new Set();

    dataset.graph.forEachEdge((edge, { pathIdsSet }) => {
      if (pathIds!.some((id) => pathIdsSet.has(id))) highlightedEdges!.add(edge);
    });
    pathIds.forEach((path) => {
      const stops = dataset.paths[path].stopIds;
      stops!.forEach((id) => highlightedNodes!.add(id));
    });
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

export function pathsToStopsSelection(selection: Selection, { paths }: Dataset): Selection {
  if (!selection.ids.length || selection.type !== "path") return selection;

  return {
    type: "stop",
    ids: uniq(selection.ids.flatMap((id) => paths[id].stopIds)),
  };
}

export function stopsToPathsSelection(selection: Selection, { stops }: Dataset): Selection {
  if (!selection.ids.length || selection.type !== "stop") return selection;

  return {
    type: "path",
    ids: uniq(selection.ids.flatMap((id) => stops[id].pathIds)),
  };
}
