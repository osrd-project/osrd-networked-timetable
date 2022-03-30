import { FC, useEffect, useMemo } from "react";
import { useSigma } from "@react-sigma/core";
import { Attributes } from "graphology-types";
import { Settings } from "sigma/settings";
import uniq from "lodash/uniq";

import { GREYED_NODE_COLOR, GREYED_EDGE_COLOR } from "../../consts";
import { useAppState } from "./../../hooks/useAppState";
import { AppState } from "./../../core/state";

export interface Highlights {
  routeIds: string[];
}

function getReducers(
  _state: AppState,
  highlight: Highlights,
): { node: NonNullable<Settings["nodeReducer"]>; edge: NonNullable<Settings["edgeReducer"]> } {
  return {
    node(_node: string, data: Attributes) {
      const res = { ...data };

      // if there no highlight => leave has default
      if (highlight.routeIds.length === 0) return res;

      // if highlighted
      const shouldBeHilighted = highlight.routeIds.some((id) => data.routeIds.has(id));
      if (shouldBeHilighted === true) {
        res.highlighted = true;
      } else {
        res.highlighted = false;
        res.color = GREYED_NODE_COLOR;
        res.label = null;
        res.zIndex = -1;
      }

      return res;
    },
    edge(_edge: string, data: Attributes) {
      const res = { ...data };

      // if there no highlight => leave has default
      if (highlight.routeIds.length === 0) return res;

      // if highlighted
      const shouldBeHilighted = highlight.routeIds.some((id) => data.routeIds.has(id));
      if (shouldBeHilighted === true) {
        res.highlighted = true;
      } else {
        // Default
        res.color = GREYED_EDGE_COLOR;
        res.label = null;
        res.zIndex = -1;
      }

      return res;
    },
  };
}

export const SettingsController: FC = () => {
  const sigma = useSigma();
  const { state } = useAppState();

  const highlights = useMemo(() => {
    const res: Highlights = { routeIds: [] };
    // Adding routeIds from the hovered element in the highlighted routes
    res.routeIds = uniq([
      ...(state.selection ? state.selection.routeIds : []),
      ...(state.hoveredNode ? Array.from(state.graph.getNodeAttribute(state.hoveredNode, "routeIds")) : []),
      ...(state.hoveredEdge ? Array.from(state.graph.getEdgeAttribute(state.hoveredEdge, "routeIds")) : []),
    ]);
    return res;
  }, [state]);

  useEffect(() => {
    console.log("Update reducers", state);
    const { node, edge } = getReducers(state, highlights);

    sigma.setSetting("nodeReducer", node);
    sigma.setSetting("edgeReducer", edge);
    sigma.refresh();
  }, [state, highlights, sigma]);

  return null;
};
