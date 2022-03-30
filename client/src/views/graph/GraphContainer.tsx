import React, { FC } from "react";
import { SigmaContainer } from "@react-sigma/core";

import { useSelector } from "../../hooks/useSelector";
import { EventsController } from "./EventsController";
import { SettingsController } from "./SettingsController";

export const GraphContainer: FC = () => {
  const graph = useSelector((state) => state.graph);
  return (
    <SigmaContainer
      graph={graph}
      initialSettings={{
        zIndex: true,
      }}
    >
      <EventsController />
      <SettingsController />
    </SigmaContainer>
  );
};
