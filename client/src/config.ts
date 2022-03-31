export const config = {
  files: {
    stops: process.env.PUBLIC_URL + "/data/stops.csv",
    transitPlans: process.env.PUBLIC_URL + "/data/transit_plans.csv",
  },
  graph: {
    maxNodeSize: 20,
    maxEdgeSize: 20,
    defaultNodeColor: "#0088ce",
    defaultEdgeColor: "#ccc",
    greyedNodeColor: "#eee",
    greyedEdgeColor: "#f6f6f6",
    selectedNodeColor: "#8D2471",
    selectedEdgeColor: "#D36AB7",
  },
};
