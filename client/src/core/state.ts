import Graph from "graphology";
import { NodeDisplayData, EdgeDisplayData } from "sigma/types";
import { Route, Agency } from "@reticular/types";

/**
 * Type def for graph items
 */
export type GraphNode = Pick<NodeDisplayData, "label" | "x" | "y" | "size" | "color"> & {
  id: string;
  routeIds: Set<string>;
};
export type GraphEdge = Pick<EdgeDisplayData, "size" | "color"> & { routeIds: Set<string> };

/**
 * Type definition of the state
 */
export interface AppState {
  // list of agencies
  agencies: Array<Agency>;
  // list of routes definition
  routes: { [id: string]: Route };
  // loading
  loading: number;
  // the graph
  graph: Graph<GraphNode, GraphEdge>;
  hoveredNode?: string | null;
  hoveredEdge?: string | null;
  // selection
  selection: { routeIds: string[] };
}

/**
 * Default state.
 */
export const initialState: AppState = {
  routes: {},
  agencies: [],
  loading: 1,
  graph: new Graph({ multi: true }),
  selection: { routeIds: [] },
};

export const reducer = (state: AppState, update: any): AppState => {
  return update(state);
};
