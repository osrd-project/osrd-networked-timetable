import { FC, useEffect } from "react";
import { useRegisterEvents } from "@react-sigma/core";
import { pull, uniq, debounce } from "lodash";

import { DEBOUNCE_TIME } from "../../consts";
import { useSelector } from "../../hooks/useSelector";
import { useAppState } from "../../hooks/useAppState";

export const EventsController: FC = () => {
  const registerEvents = useRegisterEvents();
  const graph = useSelector((state) => state.graph);
  const { setState } = useAppState();

  useEffect(() => {
    registerEvents({
      enterNode: debounce(({ node }) => {
        setState((state) => ({ ...state, hoveredNode: node }));
      }, DEBOUNCE_TIME),
      leaveNode: debounce(() => {
        setState((state) => ({ ...state, hoveredNode: undefined }));
      }, DEBOUNCE_TIME),
      enterEdge: debounce(({ edge }) => {
        setState((state) => ({ ...state, hoveredEdge: edge }));
      }, DEBOUNCE_TIME),
      leaveEdge: debounce(() => {
        setState((state) => ({ ...state, hoveredEdge: undefined }));
      }, DEBOUNCE_TIME),
      clickNode({ node }) {
        setState((state) => {
          const selection = state.selection;
          const routeIds = Array.from(graph.getNodeAttribute(node, "routeIds"));
          if (!selection) {
            return { ...state, selection: { routeIds } };
          } else {
            return { ...state, selection: { routeIds: uniq([...selection.routeIds, ...routeIds]) } };
          }
        });
      },
      clickEdge({ edge }) {
        setState((state) => {
          const routeIds = Array.from(graph.getEdgeAttribute(edge, "routeIds"));
          const selection = state.selection;

          if (!selection) {
            return { ...state, selection: { routeIds } };
          } else {
            const selectionIdsSet = new Set(selection.routeIds);
            if (routeIds.every((id) => selectionIdsSet.has(id))) {
              return { ...state, selection: { routeIds: pull(selection.routeIds, ...routeIds).slice(0) } };
            } else {
              return { ...state, selection: { routeIds: uniq(selection.routeIds.concat(routeIds)) } };
            }
          }
        });
      },
      clickStage() {
        setState((state) => ({ ...state, selection: { routeIds: [] } }));
      },
    });
  }, [graph, registerEvents, setState]);

  return null;
};
