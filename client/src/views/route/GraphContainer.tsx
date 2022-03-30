import React, { FC } from "react";
import { SigmaContainer } from "@react-sigma/core";
import Graph from "graphology";

export const GraphContainer: FC<{ graph: Graph }> = ({ graph }) => {
  return <SigmaContainer style={{ height: "200px" }} graph={graph}></SigmaContainer>;
};
