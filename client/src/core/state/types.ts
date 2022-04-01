import { NodeDisplayData, EdgeDisplayData } from "sigma/types";
import Graph from "graphology";

import { Stop, TransitPlan } from "@reticular/types";

/**
 * Type def for graph items
 */
export type GraphNode = Pick<NodeDisplayData, "label" | "x" | "y" | "size" | "color"> & {
  id: string;
  transitPlanIds: Set<string>;
};
export type GraphEdge = Pick<EdgeDisplayData, "size" | "color"> & { transitPlanIds: Set<string> };

/**
 * Type definition of the state
 */
export interface AppState {
  stops: { [key: string]: Stop };
  transitPlans: { [key: string]: TransitPlan };
  loading: number;
  selection: {
    isOpened: boolean;
    transitPlanIds: Array<string>;
  };
  graph: Graph<GraphNode, GraphEdge>;
  graphSelection?: Array<{ type: "node" | "edge"; id: string }>;
}
