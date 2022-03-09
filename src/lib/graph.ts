import { Settings } from "sigma/settings";
import { Attributes } from "graphology-types";

import { Dataset } from "./data";
import { GREYED_ITEMS_COLOR } from "../consts";
import { forEach, uniq } from "lodash";

export interface Selection {
  type: "paths" | "stops";
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
  let highlightedNodes: Set<string> | null = null;
  let highlightedEdges: Set<string> | null = null;

  if (highlight?.stopIds) {
    highlightedNodes = new Set(highlight.stopIds);

    pathIds = pathIds || [];
    forEach(dataset.paths, ({ id, stopIdsSet }) => {
      if (highlight.stopIds!.every((id) => stopIdsSet.has(id))) pathIds!.push(id);
    });
    pathIds = uniq(pathIds);
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
      const greyed = highlightedNodes && !highlightedNodes.has(node);

      if (greyed) {
        res.color = GREYED_ITEMS_COLOR;
        res.label = null;
      }

      return res;
    },
    edge(edge: string, data: Attributes) {
      const res = { ...data };
      const hidden = highlightedEdges && !highlightedEdges.has(edge);

      if (hidden) {
        res.hidden = true;
      }

      return res;
    },
  };
}
