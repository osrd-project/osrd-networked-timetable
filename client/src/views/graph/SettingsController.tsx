import { FC, useEffect, useMemo, useCallback } from "react";
import { useSigma } from "@react-sigma/core";
import { Attributes } from "graphology-types";
import { Settings } from "sigma/settings";
import intersection from "lodash/intersection";

import { useSelector } from "../../hooks/useSelector";
import { AppState } from "../../core/state/types";
import { config } from "../../config";

export interface GraphState {
  tpIds: string[];
  graphSelection: AppState["graphSelection"];
  graphSelectionTpIds: string[];
}

function getReducers(graphState: GraphState): {
  node: NonNullable<Settings["nodeReducer"]>;
  edge: NonNullable<Settings["edgeReducer"]>;
} {
  return {
    node(node: string, data: Attributes) {
      const res = { ...data };
      if (
        (graphState.graphSelection || []).length === 0 &&
        graphState.graphSelectionTpIds.length === 0 &&
        graphState.tpIds.length === 0
      ) {
        return res;
      }

      // If Graph item is selected
      if ((graphState.graphSelection || []).findIndex((e) => e.id === node) > -1) {
        res.color = config.graph.selectedNodeColor;
        res.highlighted = true;
        res.zIndex = 10;
        return res;
      }

      // If appears in the app selection
      if (graphState.tpIds.some((id) => data.transitPlanIds.has(id))) {
        res.color = config.graph.defaultNodeColor;
        res.zIndex = 1;
        return res;
      }

      // If appears in the graph selection
      if (graphState.graphSelectionTpIds.some((id) => data.transitPlanIds.has(id))) {
        res.color = config.graph.selectedNodeColor;
        res.zIndex = 2;
        return res;
      }

      // default
      res.color = config.graph.greyedNodeColor;
      res.label = null;
      res.zIndex = -1;
      return res;
    },
    edge(edge: string, data: Attributes) {
      const res = { ...data };
      if (
        (graphState.graphSelection || []).length === 0 &&
        graphState.graphSelectionTpIds.length === 0 &&
        graphState.tpIds.length === 0
      ) {
        return res;
      }

      // If Graph item is selected
      if ((graphState.graphSelection || []).findIndex((e) => e.id === edge) > -1) {
        res.color = config.graph.selectedEdgeColor;
        res.highlighted = true;
        res.zIndex = 10;
        return res;
      }

      // If appears in the app selection
      if (graphState.tpIds.some((id) => data.transitPlanIds.has(id))) {
        res.color = config.graph.defaultEdgeColor;
        res.zIndex = 1;
        return res;
      }

      // If appears in the graph selection
      if (graphState.graphSelectionTpIds.some((id) => data.transitPlanIds.has(id))) {
        res.color = config.graph.selectedEdgeColor;
        res.zIndex = 2;
        return res;
      }

      // default
      res.color = config.graph.greyedEdgeColor;
      res.label = null;
      res.zIndex = -1;
      return res;
    },
  };
}

export const SettingsController: FC = () => {
  const sigma = useSigma();
  const selection = useSelector((state) => state.selection);
  const hoveredNode = useSelector((state) => state.hoveredNode);
  const hoveredEdge = useSelector((state) => state.hoveredEdge);
  const graphSelection = useSelector((state) => state.graphSelection);

  const getGraphItemTpIds = useCallback(
    (item: { type: "node" | "edge"; id: string }): Array<string> => {
      if (item.type === "node") return Array.from(sigma.getGraph().getNodeAttribute(item.id, "transitPlanIds"));
      else return Array.from(sigma.getGraph().getEdgeAttribute(item.id, "transitPlanIds"));
    },
    [sigma],
  );

  const graphState = useMemo(() => {
    let graphSelectionTpIds: Array<string> = [];

    if (hoveredNode) graphSelectionTpIds = getGraphItemTpIds({ type: "node", id: hoveredNode });
    if (hoveredEdge) graphSelectionTpIds = getGraphItemTpIds({ type: "edge", id: hoveredEdge });

    if (graphSelection && graphSelection.length > 0) {
      graphSelectionTpIds = [
        ...graphSelectionTpIds,
        ...intersection(...graphSelection.map((e) => getGraphItemTpIds(e))),
      ];
    }

    const res: GraphState = {
      tpIds: selection ? selection.transitPlanIds : [],
      graphSelection,
      graphSelectionTpIds,
    };
    return res;
  }, [selection, hoveredNode, hoveredEdge, graphSelection, sigma, getGraphItemTpIds]);

  useEffect(() => {
    const { node, edge } = getReducers(graphState);

    sigma.setSetting("nodeReducer", node);
    sigma.setSetting("edgeReducer", edge);
    sigma.refresh();
  }, [graphState, sigma]);

  return null;
};
