import React, { FC } from "react";
import { Route } from "react-router";
import { BrowserRouter, Navigate, Routes } from "react-router-dom";

import { GraphPage } from "./../views/graph/GraphPage";
import { RoutePage } from "./../views/route/RoutePage";

export const Routing: FC = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<GraphPage />} />
          <Route path="/routes/:id" element={<RoutePage />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};
