import React, { FC, useEffect, useState } from "react";
import { BrowserRouter } from "react-router-dom";

import { Routing } from "../core/routing";
import { initialize } from "../core/state/init";

import { useAppState } from "../hooks/useAppState";
import { LoaderFillState } from "../components/Loader";
import { NavBar } from "../components/NavBar";

const App: FC = () => {
  const { dispatch, setState } = useAppState();
  const [status, setStatus] = useState<null | boolean>(null);

  useEffect(() => {
    if (status === null) {
      setStatus(false);
      dispatch({ type: "LOADING", value: true });
      initialize()
        .then((dataState) => {
          setState((state) => ({ ...state, ...dataState }));
        })
        .finally(() => {
          dispatch({ type: "LOADING", value: false });
          setStatus(true);
        });
    }
  }, [dispatch, setState, status]);

  return (
    <>
      <BrowserRouter basename={process.env.PUBLIC_URL}>
        {status === true && <Routing />}
        <LoaderFillState />
        <NavBar />
      </BrowserRouter>
    </>
  );
};

export default App;
