import { pull } from "lodash";
import React, { FC } from "react";
import { Link } from "react-router-dom";

import { useSelector } from "../../hooks/useSelector";
import { useAppState } from "../../hooks/useAppState";

export const Selection: FC = () => {
  const { setState } = useAppState();
  const routes = useSelector((state) => state.routes);
  const routeIds = useSelector((state) => state.selection.routeIds);
  const count = routeIds.length;

  return (
    <div className="selection">
      <h2>{count ? `${count > 1 ? count : "One"} selected route${count > 1 ? "s" : ""}` : `No route selected`}</h2>
      <ul className="list-unstyled">
        {routeIds.map((id) => (
          <li key={id}>
            <input
              checked
              type="checkbox"
              id={`selection-${id}`}
              onChange={() => setState((state) => ({ ...state, selection: { routeIds: pull(routeIds, id) } }))}
            />
            <label htmlFor={`selection-${id}`}>{routes[id]?.name}</label>

            <Link to={`/routes/${id}`} title={`Détail de ${routes[id]?.name}`} className="text-light float-right ml-1">
              <i className="icons-circle-arrow icons-size-15px"></i>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};
