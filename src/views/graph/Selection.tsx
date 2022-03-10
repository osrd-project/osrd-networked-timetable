import { pull } from "lodash";
import React, { FC, useContext } from "react";
import { DataContext, GraphContext } from "../../lib/context";
import { TrainPath, TrainStop } from "../../lib/data";

const SelectedStop: FC<{ stop: TrainStop }> = ({ stop }) => {
  return (
    <>
      <div className="fw-bold">{stop.localite || stop.id}</div>
      <div>
        Crossed by {stop.pathIds.length} path{stop.pathIds.length > 1 ? "s" : ""}
      </div>
    </>
  );
};

const SelectedPath: FC<{ path: TrainPath }> = ({ path }) => {
  return (
    <>
      <div className="fw-bold">{path.id}</div>
      <div>Stops {path.stopIds.length > 1 ? `${path.stopIds.length} times` : "once"}</div>
    </>
  );
};

const Selection: FC = () => {
  const { stops, paths } = useContext(DataContext);
  const { state, setState } = useContext(GraphContext);
  const selection = state.selection;

  console.log()

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
              {type === "path" ? <SelectedPath path={paths[id]} /> : <SelectedStop stop={stops[id]} />}
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Selection;
