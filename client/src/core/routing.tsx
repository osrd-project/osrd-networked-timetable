import React, { FC } from "react";
import { Route } from "react-router";
import { Navigate, Routes } from "react-router-dom";

import { GraphPage } from "./../views/graph/GraphPage";
import { TransitPlanPage } from "./../views/transitPlan/TransitPlanPage";

export const Routing: FC = () => {
  return (
    <Routes>
      <Route path="/" element={<GraphPage />} />
      <Route path="/transitplan/:id" element={<TransitPlanPage />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};
