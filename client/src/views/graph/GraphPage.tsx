import React, { FC, useState } from "react";

import { GraphContext } from "../../lib/context";
import GraphContainer from "./GraphContainer";
import { GraphState } from "../../lib/graph";
import SidePanel from "./SidePanel";

const GraphPage: FC = () => {
  const [state, setState] = useState<GraphState>({});

  return (
    <GraphContext.Provider
      value={{
        state,
        setState,
      }}
    >
      <main className="graph-page">
        <SidePanel />
        <GraphContainer />
      </main>
    </GraphContext.Provider>
  );
};

export default GraphPage;
