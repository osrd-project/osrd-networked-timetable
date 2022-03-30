import React, { FC } from "react";

import { useSelector } from "../../hooks/useSelector";
import { useAppState } from "../../hooks/useAppState";

export const Actions: FC = () => {
  const { setState } = useAppState();
  const routeIds = useSelector((s) => s.selection.routeIds);

  return (
    <div>
      {!!routeIds.length && (
        <button
          className="btn btn-outline-light"
          onClick={() => setState((state) => ({ ...state, selection: { routeIds: [] } }))}
        >
          Unselect all routes
        </button>
      )}
    </div>
  );
};
