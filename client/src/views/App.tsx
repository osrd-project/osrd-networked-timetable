import React, { FC } from "react";

import { useData } from "../lib/data";
import { LoaderFill } from "../components/Loader";
import { DataContext } from "../lib/context";
import Routing from "./Routing";

const App: FC = () => {
  const dataState = useData();

  if (dataState.type === "idle" || dataState.type === "loading") return <LoaderFill />;
  if (dataState.type === "error")
    return (
      <div className="fill">
        <p className="text-danger"> An error occurred: {dataState.error?.message || <i>no message</i>}</p>
      </div>
    );

  const { dataset } = dataState;

  return (
    <DataContext.Provider value={dataset}>
      <Routing />
    </DataContext.Provider>
  );
};

export default App;
