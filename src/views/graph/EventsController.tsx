import { FC, useContext, useEffect } from "react";
import { useRegisterEvents } from "@react-sigma/core";

import { GraphContext } from "../../lib/context";

const EventsController: FC = () => {
  const { setState } = useContext(GraphContext);
  const registerEvents = useRegisterEvents();

  useEffect(() => {
    registerEvents({
      enterNode({ node }) {
        setState((state) => ({ ...state, hoveredNode: node }));
      },
      leaveNode() {
        setState((state) => ({ ...state, hoveredNode: undefined }));
      },
      enterEdge({ edge }) {
        setState((state) => ({ ...state, hoveredEdge: edge }));
      },
      leaveEdge() {
        setState((state) => ({ ...state, hoveredEdge: undefined }));
      },
    });
  }, [registerEvents, setState]);

  return null;
};

export default EventsController;
