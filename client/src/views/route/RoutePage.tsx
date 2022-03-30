import React, { FC, useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import Graph from "graphology";
import values from "lodash/values";
import orderBy from "lodash/orderBy";

import { RouteFull } from "@reticular/types";
import project from "../../utils/project";
import { Layout } from "../layout/Layout";
import { TitleBar } from "../../components/TitleBar";
import { NavBar } from "../../components/NavBar";
import { LoaderFill } from "../../components/Loader";
import { GraphContainer } from "./GraphContainer";

function getStopName(graph: Graph, stopId: string): string {
  return graph.getNodeAttribute(stopId, "label");
}

export const RoutePage: FC = () => {
  const { id } = useParams<"id">();
  const [route, setRoute] = useState<RouteFull | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [direction, setDirection] = useState<null | string>(null);
  const [date] = useState<Date>(new Date());

  const graph = useMemo(() => {
    const g = new Graph({ multi: true });
    if (route) g.import(route.network);
    g.forEachNode((node, attr) => {
      g.replaceNodeAttributes(node, {
        label: attr.name,
        highlighted: true,
        ...project({ lat: attr.lat, lng: attr.lng }),
      });
    });
    return g;
  }, [route]);

  /**
   * Loading the data
   */
  useEffect(() => {
    setLoading(true);
    fetch(`/data/routes/${id}.json`)
      .then((response) => response.json())
      .then((data) => {
        setRoute(data);
        const hasDirection = values(data.trips).some((trip) => trip.direction === "1");
        setDirection(hasDirection === true ? "0" : null);
      })
      .finally(() => setLoading(false));
  }, [id]);

  console.log(date);

  return (
    <Layout className="route-page">
      {loading && <LoaderFill />}
      {route !== null && (
        <>
          <TitleBar title={`${route.code} - ${route.name}`} />
          <NavBar />
          <div className="row">
            <div className="col col-12">
              <GraphContainer graph={graph} />
            </div>
          </div>
          <div className="row">
            <div className="col col-12">
              {direction !== null && (
                <nav role="navigation" className="position-relative mt-2">
                  <ul className="nav navtabs mb-0 dragscroll">
                    <li className="navtabs-item pr-4">
                      <button
                        className={`btn-link ${direction === "0" ? "active" : ""}`}
                        title="Aller"
                        onClick={() => setDirection("0")}
                      >
                        Aller
                      </button>
                    </li>
                    <li className="navtabs-item pr-4">
                      <button
                        className={`btn-link ${direction === "1" ? "active" : ""}`}
                        title="Retour"
                        onClick={() => setDirection("1")}
                      >
                        Retour
                      </button>
                    </li>
                  </ul>
                </nav>
              )}
              <div className="table-wrapper" data-component="table">
                <div className="table-scroller dragscroll">
                  <table className="table">
                    <thead className="thead thead-light">
                      <tr>
                        <th scope="col">
                          <div className="cell-inner cell-inner-350">Code</div>
                        </th>
                        <th scope="col">
                          <div className="cell-inner">Début</div>
                        </th>
                        <th scope="col">
                          <div className="cell-inner">Fin</div>
                        </th>
                        <th scope="col">
                          <div className="cell-inner">Nombre d'étape</div>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="tbody">
                      {orderBy(values(route.trips), ["headsign", "id"])
                        .filter((trip) => (direction === null ? true : trip.direction === direction))
                        .map((trip) => {
                          return (
                            <tr key={trip.id} className="trhead">
                              <td>{trip.headsign}</td>
                              <td>
                                {trip.stops[0].departure} - {getStopName(graph, trip.stops[0].id)}
                              </td>
                              <td>
                                {trip.stops[trip.stops.length - 1].arrival} -{" "}
                                {getStopName(graph, trip.stops[trip.stops.length - 1].id)}
                              </td>
                              <td>{trip.stops.length}</td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </Layout>
  );
};
