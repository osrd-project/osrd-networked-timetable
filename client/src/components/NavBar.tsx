import React, { FC } from "react";
import { Link } from "react-router-dom";

import { useSelector } from "../hooks/useSelector";
import { useAppState } from "../hooks/useAppState";
import { SidePanel } from "./SidePanel";
import { Selection } from "./Selection";

export const NavBar: FC = () => {
  const { setState } = useAppState();
  const selection = useSelector((state) => state.selection);

  function openSelection(value: boolean) {
    setState((state) => ({
      ...state,
      selection: {
        ...state.selection,
        isOpened: value,
      },
    }));
  }
  return (
    <>
      {selection.isOpened && (
        <SidePanel close={() => openSelection(false)}>
          <Selection />
        </SidePanel>
      )}
      <nav role="navigation" className="mastnav">
        <ul className="mastnav-top">
          <li>
            <button
              className={"mastnav-item btn-notif"}
              onClick={(e) => {
                e.stopPropagation();
                openSelection(!selection.isOpened);
              }}
            >
              <i className="icons-bookmark icons-size-1x5" aria-hidden="true"></i>
              {selection.transitPlanIds.length > 0 && (
                <span className="notif bg-danger" style={{ top: "calc(30% - 1em)", padding: 0 }}>
                  {selection.transitPlanIds.length}
                </span>
              )}
              <span className="font-weight-medium">Sélection</span>
            </button>
          </li>
          <li>
            <Link to="/" className={"mastnav-item"} title="Carte des lignes">
              <i className="icons-large-france icons-size-1x5" aria-hidden="true"></i>
              <span className="font-weight-medium">Carte</span>
            </Link>
          </li>
        </ul>
      </nav>
    </>
  );
};
