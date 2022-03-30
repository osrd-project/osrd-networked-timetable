import React, { FC } from "react";

import { Layout } from "../layout/Layout";
import { TitleBar } from "../../components/TitleBar";
import { GraphContainer } from "./GraphContainer";
import { SidePanel } from "./SidePanel";

export const GraphPage: FC = () => {
  return (
    <Layout className="graph-page">
      <SidePanel />
      <div className="main">
        <TitleBar title="Réseaux des lignes" />
        <GraphContainer />
      </div>
    </Layout>
  );
};
