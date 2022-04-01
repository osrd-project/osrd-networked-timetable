export const config = {
  debounce: 200,
  files: {
    stops: process.env.PUBLIC_URL + "/data/stops.csv",
    transitPlans: process.env.PUBLIC_URL + "/data/transit_plans.csv",
  },
  graph: {
    maxNodeSize: 20,
    maxEdgeSize: 20,
    // for app selection
    defaultNodeColor: "#0088ce",
    defaultEdgeColor: "#ccc",
    // for background
    greyedNodeColor: "#eee",
    greyedEdgeColor: "#f6f6f6",
    // for graph selection
    selectedNodeColor: "#8D2471",
    selectedEdgeColor: "#ccc",
  },
};
