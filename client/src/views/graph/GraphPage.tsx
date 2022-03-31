import React, { FC } from "react";

import { Layout } from "../layout/Layout";
import { TitleBar } from "../../components/TitleBar";
import { GraphContainer } from "./GraphContainer";
import { GraphSelection } from "./GraphSelection";

export const GraphPage: FC = () => {
  return (
    <Layout className="graph-page">
      <TitleBar title="Réseaux des lignes" />
      <GraphContainer />
      <GraphSelection />
    </Layout>
  );
};
