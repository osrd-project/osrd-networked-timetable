import { FC, useContext, useEffect, useMemo } from "react";
import { useSigma } from "@react-sigma/core";

import { getReducers, Highlights } from "../../lib/graph";
import { DataContext, GraphContext } from "../../lib/context";

const SettingsController: FC = () => {
  const sigma = useSigma();
  const dataset = useContext(DataContext);
  const { state } = useContext(GraphContext);
  const highlights = useMemo(() => {
    if (!state.selection && !state.hoveredNode && !state.hoveredEdge) return null;
    const res: Highlights = {};

    if (state.selection?.type === "paths") res.pathIds = state.selection.ids;
    if (state.selection?.type === "stops") res.stopIds = state.selection.ids;
    if (state.hoveredNode) res.stopIds = (res.stopIds || []).concat(state.hoveredNode);
    if (state.hoveredEdge)
      res.pathIds = (res.pathIds || []).concat(
        Array.from(dataset.graph.getEdgeAttribute(state!.hoveredEdge, "pathIdsSet")),
      );

    return res;
  }, [dataset.graph, state]);

  useEffect(() => {
    const { node, edge } = getReducers(dataset, highlights);

    sigma.setSetting("nodeReducer", node);
    sigma.setSetting("edgeReducer", edge);
    sigma.refresh();
  }, [dataset, highlights, sigma]);

  return null;
};

export default SettingsController;