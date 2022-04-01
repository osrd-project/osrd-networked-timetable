import React, { FC } from "react";
import { Link } from "react-router-dom";

import { useSelector } from "../hooks/useSelector";
import { useAppState } from "../hooks/useAppState";

export const Selection: FC = () => {
  const { setState } = useAppState();
  const transitPlans = useSelector((state) => state.transitPlans);
  const transitPlanIds = useSelector((state) => state.selection.transitPlanIds);

  return (
    <div className="box">
      <div className="box-header">
        <h2>Selection</h2>
      </div>

      <div className="box-body">
        <ul className="list-unstyled">
          {transitPlanIds.map((id) => (
            <li key={id}>
              <div className="d-flex justify-content-between">
                <Link
                  to={`/transitplan/${id}`}
                  title={`Détail de ${transitPlans[id]?.name}`}
                  className="text-light float-right ml-2"
                >
                  {transitPlans[id]?.name}
                </Link>
                <div className="ml-3">
                  <button
                    className="btn btn-link text-danger"
                    title="Supprimer de la sélection"
                    onClick={() => {
                      setState((state) => ({
                        ...state,
                        selection: {
                          ...state.selection,
                          transitPlanIds: state.selection.transitPlanIds.filter((e) => e !== id),
                        },
                      }));
                    }}
                  >
                    <i className="icons-close icons-size-15px"></i>
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="box-footer d-flex flex-column justify-content-between">
        <button
          disabled={transitPlanIds.length === 0}
          className="btn btn-danger"
          onClick={() =>
            setState((state) => ({
              ...state,
              selection: {
                ...state.selection,
                transitPlanIds: [],
              },
            }))
          }
        >
          Tout supprimer
        </button>
      </div>
    </div>
  );
};
