import { Sqlite } from "../sqlite";
import { writeCsv } from "../utils";

import { Route } from "@reticular/types";

export async function exportRoutesList(): Promise<void> {
  const sqlite = await Sqlite.getInstance();
  const routes = await sqlite.db().all<Route[]>(`
    SELECT
      route_id as id,
      route_short_name as code,
      route_long_name as name,
      agency_id as agencyId
    FROM routes
  `);
  await writeCsv(routes, "routes.csv");
}
