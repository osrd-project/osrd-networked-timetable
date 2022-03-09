import React, { FC, useContext } from "react";
import { SigmaContainer } from "@react-sigma/core";

import { DataContext } from "../../lib/context";
import EventsController from "./EventsController";
import SettingsController from "./SettingsController";

const GraphContainer: FC = () => {
  const dataset = useContext(DataContext);

  return (
    <SigmaContainer graph={dataset.graph}>
      <EventsController />
      <SettingsController />
    </SigmaContainer>
  );
};

export default GraphContainer;
