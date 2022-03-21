import { FC, useContext, useEffect } from "react";
import { useRegisterEvents } from "@react-sigma/core";

import { DataContext, GraphContext } from "../../lib/context";
import { pull, uniq } from "lodash";

const EventsController: FC = () => {
  const { graph } = useContext(DataContext);
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
      clickNode({ node }) {
        setState((state) => {
          const selection = state.selection;

          if (!selection || selection.type === "path") {
            return { ...state, selection: { type: "stop", ids: [node] } };
          } else if (selection.ids.includes(node)) {
            return { ...state, selection: { type: "stop", ids: selection.ids.filter((id) => id !== node) } };
          } else {
            return { ...state, selection: { type: "stop", ids: selection.ids.concat(node) } };
          }
        });
      },
      clickEdge({ edge }) {
        setState((state) => {
          const selection = state.selection;
          const ids = Array.from(graph.getEdgeAttribute(edge, "pathIdsSet"));

          if (!selection || selection.type === "stop") {
            return { ...state, selection: { type: "path", ids } };
          } else {
            const selectionIdsSet = new Set(selection.ids);

            if (ids.every((id) => selectionIdsSet.has(id))) {
              return { ...state, selection: { type: "path", ids: pull(selection.ids, ...ids).slice(0) } };
            } else {
              return { ...state, selection: { type: "path", ids: uniq(selection.ids.concat(ids)) } };
            }
          }
        });
      },
      clickStage() {
        setState((state) => ({ ...state, selection: null }));
      },
    });
  }, [graph, registerEvents, setState]);

  return null;
};

export default EventsController;
