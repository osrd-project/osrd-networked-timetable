import Graph from "graphology";
import values from "lodash/values";

import { Stop, TransitPlan } from "@reticular/types";
import { config } from "../../config";
import { downloadDataAnParseCsv, project } from "../../utils";
import { AppState, GraphNode, GraphEdge } from "./types";

/**
 * Default state.
 */
export const defaultState: AppState = {
  stops: {},
  transitPlans: {},
  loading: 0,
  selection: { isOpened: false, transitPlanIds: [] },
  graph: new Graph(),
};

/**
 * Funciton that init the state of the application.
 * ie. loading some external data.
 */
export async function initialize(): Promise<Partial<AppState>> {
  // download and parse needed CSV
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  const data = await Promise.all([
    downloadDataAnParseCsv<Stop>(config.files.stops),
    downloadDataAnParseCsv<any>(config.files.transitPlans, false),
  ]);

  const state = {
    stops: data[0].reduce((acc, curr) => {
      acc[curr.id] = curr;
      return acc;
    }, {} as { [key: string]: Stop }),
    transitPlans: data[1].reduce((acc, curr) => {
      acc[curr.id] = {
        ...curr,
        stopIds: curr.stopIds.split(","),
        tripIds: curr.tripIds.split(","),
      };
      return acc;
    }, {} as { [key: string]: TransitPlan }),
  };

  // build the graph
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  const graph = new Graph<GraphNode, GraphEdge>({ multi: true });

  // loading nodes
  values(state.stops).forEach((stop) => {
    graph.addNode(stop.id, {
      id: stop.id,
      label: stop.name,
      color: config.graph.defaultNodeColor,
      size: 1,
      ...project({ lat: stop.lat, lng: stop.lng }),
      transitPlanIds: new Set<string>(),
    });
  });

  // loading edges
  values(state.transitPlans).forEach((tp) => {
    if (tp.stopIds.length > 1) {
      let prev = tp.stopIds[0];
      tp.stopIds.slice(1).forEach((stop: string) => {
        const edgeKey = `${prev}->${stop}`;
        if (!graph.hasEdge(edgeKey))
          graph.addEdgeWithKey(edgeKey, prev, stop, {
            size: 1,
            color: config.graph.defaultEdgeColor,
            transitPlanIds: new Set<string>([tp.id]),
          });
        else
          graph.updateEdgeAttributes(edgeKey, (attr) => {
            attr.transitPlanIds.add(tp.id);
            attr.size = attr.transitPlanIds.size;
            return attr;
          });
        prev = stop;
      });
    }
  });

  // Cmpute node's transitPlanIds & size
  graph.forEachNode((node) => {
    // Compute nodes size
    const size = graph.reduceEdges(node, (acc, _edge, attr) => acc + attr.size, 0);
    graph.setNodeAttribute(node, "size", size);

    // Compute available routes
    graph.setNodeAttribute(
      node,
      "transitPlanIds",
      graph.reduceEdges(
        node,
        (acc, _edge, attr) => {
          attr.transitPlanIds.forEach((routeId) => acc.add(routeId));
          return acc;
        },
        new Set<string>(),
      ),
    );
  });

  // Compute max values:
  let maxNodeSize = -Infinity;
  let maxEdgeSize = -Infinity;
  graph.forEachNode((_, attr) => {
    if (attr.size > maxNodeSize) maxNodeSize = attr.size;
  });
  graph.forEachEdge((_, attr) => {
    if (attr.size > maxEdgeSize) maxEdgeSize = attr.size;
  });

  // Adjust sizes accordingly:
  graph.forEachNode((node, attr) => {
    graph.setNodeAttribute(node, "size", (attr.size * config.graph.maxNodeSize) / maxNodeSize);
  });
  graph.forEachEdge((edge, attr) => {
    graph.setEdgeAttribute(edge, "size", (attr.size * config.graph.maxEdgeSize) / maxEdgeSize);
  });

  return { ...state, graph };
}
