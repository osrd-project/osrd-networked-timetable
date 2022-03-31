import React, { FC } from "react";

import { TransitPlan } from "@reticular/types";
import { useSelector } from "../../hooks/useSelector";

export const TransitPlanSchema: FC<{ tp: TransitPlan }> = ({ tp }) => {
  const stops = useSelector((state) => state.stops);
  return <p>{tp.stopIds.map((id) => stops[id].name).join(" -> ")}</p>;
};
