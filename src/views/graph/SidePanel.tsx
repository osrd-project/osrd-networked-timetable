import React, { FC } from "react";
import Selection from "./Selection";
import Actions from "./Actions";

const SidePanel: FC = () => {
  return (
    <div className="side-panel d-flex flex-column">
      <h1 className="fs-3 flex-shrink-0">Reticular</h1>

      <div className="flex-grow-1 flex-shrink-1 overflow-auto my-3">
        <Selection />
      </div>
      <div className="flex-shrink-0">
        <Actions />
      </div>
    </div>
  );
};

export default SidePanel;
