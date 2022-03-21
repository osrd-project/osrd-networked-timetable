import React, { FC } from "react";
import { Route } from "react-router";
import { HashRouter, Navigate, Routes } from "react-router-dom";

import GraphPage from "./graph/GraphPage";

const Routing: FC = () => {
  return (
    <>
      <HashRouter>
        <Routes>
          <Route path="/" element={<GraphPage />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </HashRouter>
    </>
  );
};

export default Routing;
