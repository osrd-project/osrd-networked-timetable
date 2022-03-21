import { createContext, ReducerWithoutAction } from "react";
import Graph from "graphology";
import { noop } from "lodash";

import { Dataset, GraphEdge, GraphNode } from "./data";
import { GraphState } from "./graph";

export const AppContext = createContext<{ portalTarget: HTMLDivElement }>({
  portalTarget: document.createElement("div"),
});

export const DataContext = createContext<Dataset>({
  paths: {},
  stops: {},
  graph: new Graph<GraphNode, GraphEdge>(),
});

export const GraphContext = createContext<{
  state: GraphState;
  setState: (stateOrReducer: GraphState | ReducerWithoutAction<GraphState>) => void;
}>({
  state: {},
  setState: noop,
});
