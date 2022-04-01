import { FC, useEffect } from "react";
import { useRegisterEvents } from "@react-sigma/core";

import { useSelector } from "../../hooks/useSelector";
import { useAppState } from "../../hooks/useAppState";

export const EventsController: FC = () => {
  const registerEvents = useRegisterEvents();
  const graph = useSelector((state) => state.graph);
  const { setState } = useAppState();

  useEffect(() => {
    registerEvents({
      clickNode(event) {
        setState((state) => {
          const newState = { ...state };
          if (!newState.graphSelection) newState.graphSelection = [];
          if (newState.graphSelection.findIndex((e) => e.id === event.node) > -1) {
            newState.graphSelection = [...newState.graphSelection.filter((e) => e.id !== event.node)];
          } else {
            newState.graphSelection = [...newState.graphSelection, { type: "node", id: event.node }];
          }
          return newState;
        });
      },
      clickEdge({ edge }) {
        setState((state) => {
          const newState = { ...state };
          if (!newState.graphSelection) newState.graphSelection = [];
          if (newState.graphSelection.findIndex((e) => e.id === edge) > 0)
            newState.graphSelection = [...newState.graphSelection.filter((e) => e.id !== edge)];
          else newState.graphSelection = [...newState.graphSelection, { type: "edge", id: edge }];
          return newState;
        });
      },
      clickStage() {
        setState((state) => ({
          ...state,
          hoveredNode: undefined,
          hoveredEdge: undefined,
          graphSelection: [],
        }));
      },
    });
  }, [graph, registerEvents, setState]);

  return null;
};
