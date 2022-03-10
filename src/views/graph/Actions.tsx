import React, { FC, useContext } from "react";
import { DataContext, GraphContext } from "../../lib/context";
import { pathsToStopsSelection, Selection, stopsToPathsSelection } from "../../lib/graph";

const Actions: FC = () => {
  const { state, setState } = useContext(GraphContext);
  const dataset = useContext(DataContext);

  const { ids, type } = state.selection || { ids: [] };

  return (
    <div className="d-flex flex-column align-items-stretch">
      {!!ids.length && (
        <button className="btn btn-outline-primary mb-2" onClick={() => setState({ ...state, selection: null })}>
          Unselect all {type}s
        </button>
      )}
      {type === "stop" && !!ids.length && (
        <button
          className="btn btn-outline-primary mb-2"
          onClick={() =>
            setState({ ...state, selection: stopsToPathsSelection(state.selection as Selection, dataset) })
          }
        >
          Select all paths crossing {ids.length === 1 ? "this stop" : `these ${ids.length} stops`} instead
        </button>
      )}
      {type === "path" && !!ids.length && (
        <button
          className="btn btn-outline-primary mb-2"
          onClick={() =>
            setState({ ...state, selection: pathsToStopsSelection(state.selection as Selection, dataset) })
          }
        >
          Select all stops crossed by {ids.length === 1 ? "this path" : `these ${ids.length} paths`} instead
        </button>
      )}
      {type === "path" && !!ids.length && (
        <button className="btn btn-outline-primary mb-2" onClick={() => console.log("TODO")} disabled>
          Show the reticular view
        </button>
      )}
    </div>
  );
};

export default Actions;
