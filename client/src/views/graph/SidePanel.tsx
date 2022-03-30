import React, { FC } from "react";

import { Selection } from "./Selection";
import { Actions } from "./Actions";

export const SidePanel: FC = () => {
  return (
    <div className="mastnav">
      <Selection />
      <Actions />
    </div>
  );
};
