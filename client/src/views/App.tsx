import React, { FC, useEffect } from "react";

import { Routing } from "../core/routing";
import { useData } from "../hooks/useData";
import { useAppState } from "../hooks/useAppState";
import { LoaderFillState } from "../components/Loader";

const App: FC = () => {
  const dataState = useData();
  const { setState } = useAppState();

  useEffect(() => {
    if (dataState.type === "ready") {
      setState((state) => {
        return { ...state, ...dataState.dataset, loading: 0 };
      });
    }
  }, [dataState, setState]);

  return (
    <>
      <Routing />
      <LoaderFillState />
    </>
  );
};

export default App;
