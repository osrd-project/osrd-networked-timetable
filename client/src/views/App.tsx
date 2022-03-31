import React, { FC, useEffect, useState } from "react";
import { BrowserRouter } from "react-router-dom";

import { Routing } from "../core/routing";
import { initialize } from "../core/state/init";

import { useAppState } from "../hooks/useAppState";
import { LoaderFillState } from "../components/Loader";
import { NavBar } from "../components/NavBar";

const App: FC = () => {
  const { dispatch, setState } = useAppState();
  const [isInit, setIsInit] = useState<boolean>(false);

  useEffect(() => {
    setIsInit(false);
    dispatch({ type: "LOADING", value: true });
    initialize()
      .then((dataState) => {
        setState((state) => ({ ...state, ...dataState }));
        setIsInit(true);
      })
      .finally(() => dispatch({ type: "LOADING", value: false }));
  }, []);

  return (
    <>
      <BrowserRouter>
        {isInit && <Routing />}
        <LoaderFillState />
        <NavBar />
      </BrowserRouter>
    </>
  );
};

export default App;
