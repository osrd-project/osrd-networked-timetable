import React, { FC, useState } from "react";

import { useSelector } from "../hooks/useSelector";
import { SidePanel } from "./SidePanel";
import { Selection } from "./Selection";

export const NavBar: FC = () => {
  const [favOpened, setFavOpened] = useState<boolean>(false);

  const selection = useSelector((state) => state.selection);
  return (
    <nav role="navigation" className="mastnav">
      <ul className="mastnav-top">
        <li>
          <button className={"mastnav-item btn-notif"} onClick={() => setFavOpened((b) => !b)}>
            <i className="icons-bookmark icons-size-1x5" aria-hidden="true"></i>
            {selection.transitPlanIds.length > 0 && (
              <span className="notif bg-danger" style={{ top: "calc(30% - 1em)", padding: 0 }}>
                {selection.transitPlanIds.length}
              </span>
            )}
            <span className="font-weight-medium">Favoris</span>
          </button>
        </li>
      </ul>
      {favOpened && (
        <SidePanel>
          <Selection />
        </SidePanel>
      )}
    </nav>
  );
};
