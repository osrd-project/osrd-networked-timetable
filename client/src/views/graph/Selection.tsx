import { pull } from "lodash";
import React, { FC, useContext } from "react";
import { DataContext, GraphContext } from "../../lib/context";
import { GraphEdge, GraphNode } from "../../lib/data";

const SelectedStop: FC<{ stop: GraphNode }> = ({ stop }) => {
  return (
    <>
      <div className="fw-bold">{stop.label}</div>
      <div>
        Crossed by {stop.routes.size} route{stop.routes.size > 1 ? "s" : ""}
      </div>
    </>
  );
};

const SelectedPath: FC<{ path: GraphEdge }> = ({ path }) => {
  return (
    <>
      <div>Crossed by {path.routes.size} route{path.routes.size > 1 ? "s" : ""}</div>
    </>
  );
};

const Selection: FC = () => {
  const { graph } = useContext(DataContext);
  const { state, setState } = useContext(GraphContext);
  const selection = state.selection;

  if (!selection) return null;

  const { ids, type } = selection;
  const count = ids.length;

  return (
    <div className="selection">
      <h2 className="fs-4">
        {count ? `${count > 1 ? count : "One"} selected ${type}${count > 1 ? "s" : ""}` : `No selected ${type}`}
      </h2>
      <ul className="list-unstyled">
        {ids.map((id) => (
          <li key={id} className="d-flex flex-row align-items-center">
            <input
              checked
              className="me-2"
              type="checkbox"
              id={`selection-${type}-${id}`}
              onChange={() => setState((state) => ({ ...state, selection: { type, ids: pull(ids, id) } }))}
            />
            <label htmlFor={`selection-${type}-${id}`}>
              {type === "route" ? <SelectedPath path={graph.getEdgeAttributes(id)} /> : <SelectedStop stop={graph.getNodeAttributes(id)} />}
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Selection;
