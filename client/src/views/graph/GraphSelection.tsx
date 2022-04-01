import React, { FC, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { useSelector } from "../../hooks/useSelector";
import { useAppState } from "../../hooks/useAppState";
import { SidePanel } from "../../components/SidePanel";
import uniq from "lodash/uniq";
import intersection from "lodash/intersection";

export const GraphSelection: FC = () => {
  const { setState } = useAppState();
  const transitPlansById = useSelector((state) => state.transitPlans);
  const graphSelection = useSelector((state) => state.graphSelection);
  const [transitPlans, setTransitPlans] = useState<Array<string>>([]);
  const [selectedTransitPlan, setSelectedTransitPlan] = useState<Array<string>>([]);
  const graph = useSelector((state) => state.graph);

  useEffect(() => {
    const list = intersection(
      ...(graphSelection || []).map((selection) => {
        if (selection.type === "node") return Array.from(graph.getNodeAttribute(selection.id, "transitPlanIds"));
        else return Array.from(graph.getEdgeAttribute(selection.id, "transitPlanIds"));
      }),
    );
    setTransitPlans(list);
    setSelectedTransitPlan(list);
  }, [graphSelection, graph]);

  return (
    <>
      {(graphSelection || []).length > 0 && (
        <SidePanel>
          <div className="box">
            <div className="box-header">
              <h2>Graph Selection</h2>
            </div>
            <div className="box-body">
              <p className="text-center">
                Liste des schémas de desserte{" "}
                {(graphSelection || []).length > 1 && (
                  <>commun aux {(graphSelection || []).length} éléments sélectionnés</>
                )}
                {(graphSelection || []).length === 1 && <>passant par l'élément sélectionné</>}
              </p>
              <ul className="list-unstyled">
                {transitPlans.map((id) => (
                  <li key={id}>
                    <input
                      id={`selection-${id}`}
                      className="mr-1"
                      type="checkbox"
                      checked={selectedTransitPlan.includes(id)}
                      onChange={(e) => {
                        if (e.target.checked) setSelectedTransitPlan([...selectedTransitPlan, id]);
                        else setSelectedTransitPlan((a) => a.filter((i) => i !== id));
                      }}
                    />
                    <label htmlFor={`selection-${id}`}>{transitPlansById[id]?.name}</label>
                    <Link
                      to={`/transitplan/${id}`}
                      title={`Détail de ${transitPlansById[id]?.name}`}
                      className="text-light float-right ml-1"
                    >
                      <i className="icons-circle-arrow icons-size-15px"></i>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="box-footer d-flex flex-column justify-content-between">
              <button
                className="btn btn-success mb-1"
                disabled={selectedTransitPlan.length === 0}
                onClick={() =>
                  setState((state) => ({
                    ...state,
                    selection: {
                      ...state.selection,
                      transitPlanIds: uniq([...state.selection.transitPlanIds, ...selectedTransitPlan]),
                    },
                    graphSelection: [],
                  }))
                }
              >
                Ajouter {selectedTransitPlan.length} élément(s) à la sélection
              </button>
              {selectedTransitPlan.length < transitPlans.length && (
                <button className="btn btn-outline-light mb-1" onClick={() => setSelectedTransitPlan(transitPlans)}>
                  Tout sélectionner
                </button>
              )}
              {selectedTransitPlan.length > 0 && (
                <button className="btn btn-outline-danger mb-1" onClick={() => setSelectedTransitPlan([])}>
                  Tout désélectionner
                </button>
              )}
            </div>
          </div>
        </SidePanel>
      )}
    </>
  );
};
