import React, { FC, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { TransitPlan, Trip } from "@reticular/types";
import { useSelector } from "../../hooks/useSelector";
import { useAppState } from "../../hooks/useAppState";
import { Layout } from "../layout/Layout";
import { TitleBar } from "../../components/TitleBar";
import { TransitPlanSchema } from "./TransitPlanSchema";
import { TransitPlanSchedule } from "./TransitPlanSchedule";

export const TransitPlanPage: FC = () => {
  const { dispatch } = useAppState();
  const { id } = useParams<"id">();
  const transitPlans = useSelector((state) => state.transitPlans);
  const [tp, setTP] = useState<TransitPlan | null>(null);
  const [trips, setTrips] = useState<Array<Trip>>([]);

  /**
   * Loading the data
   */
  useEffect(() => {
    if (id) {
      setTP(transitPlans[id]);
      dispatch({ type: "LOADING", value: true });
      Promise.all(
        transitPlans[id].tripIds.map((id) =>
          fetch(process.env.PUBLIC_URL + `/data/trips/${id}.json`).then((response) => response.json()),
        ),
      )
        .then((data) => setTrips(data))
        .finally(() => dispatch({ type: "LOADING", value: false }));
    } else setTP(null);
  }, [id, dispatch, transitPlans]);

  return (
    <Layout className="transitplan-page">
      {tp && (
        <>
          <TitleBar title={tp.name} />
          <div className="row">
            <div className="col col-12">
              <TransitPlanSchema tp={tp} />
            </div>
          </div>
          <div className="row">
            <div className="col col-12">
              <TransitPlanSchedule tp={tp} trips={trips} />
            </div>
          </div>
        </>
      )}
    </Layout>
  );
};
