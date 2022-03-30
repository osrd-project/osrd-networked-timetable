import { config } from "./config";
import { Sqlite } from "./sqlite";
import { createExportFolder, cleanExportFolder } from "./utils";
import { importGtfs } from "./import/gtfs";
import { exportAgenciesList } from "./export/agenciesList";
import { exportStopsNetwork } from "./export/stopsNetwork";
import { exportRoutesList } from "./export/routesList";
import { exportRoutes } from "./export/routes";

async function run(): Promise<void> {
  // reset the db
  const sqlite = await Sqlite.getInstance();

  // import all gtfs files
  if (!config.exportOnly) {
    await sqlite.reset();
    await importGtfs();
  }

  // reset export folder
  await cleanExportFolder();
  await createExportFolder();

  // exports
  await exportStopsNetwork();
  await exportRoutesList();
  await exportAgenciesList();
  await exportRoutes();
}

run();
