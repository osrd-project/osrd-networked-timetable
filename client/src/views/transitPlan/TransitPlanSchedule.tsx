import React, { FC } from "react";
import orderBy from "lodash/orderBy";

import { Trip, TransitPlan } from "@reticular/types";
import { useSelector } from "../../hooks/useSelector";

export const TransitPlanSchedule: FC<{ tp: TransitPlan; trips: Array<Trip> }> = ({ tp, trips }) => {
  const stops = useSelector((state) => state.stops);

  return (
    <div className="table-wrapper">
      <div className="table-scroller dragscroll">
        <table className="table">
          <caption className="sr-only">Liste des horaires</caption>
          <thead className="thead thead-fixed thead-light">
            <tr>
              <th scope="col">Headsign</th>
              {tp.stopIds.map((id) => (
                <th key={id} scope="col">
                  {stops[id].name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {orderBy(trips, (t) => t.stops[0].departure).map((trip) => (
              <tr key={trip.id}>
                <td>{trip.headsign}</td>
                {trip.stops.map((st, index) => (
                  <td key={st.id}>
                    {index === 0 && st.departure}
                    {index === trip.stops.length - 1 && st.arrival}
                    {index !== 0 && index < trip.stops.length - 1 && `${st.arrival} - ${st.departure}`}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
