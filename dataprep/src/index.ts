import { config } from "./config";
import { Sqlite } from "./sqlite";
import { createExportFolder, cleanExportFolder } from "./utils";
import { importGtfs } from "./import/gtfs";

import exportTransitPlans from "./export/transitPlans";
import exportStops from "./export/stops";
import exportTrips from "./export/trips";

async function run(): Promise<void> {
  // reset the db
  const sqlite = await Sqlite.getInstance();

  // import all gtfs files
  if (!config.exportOnly) {
    await sqlite.reset();
    await importGtfs();
  }

  // reset export folder
  if (!config.exportClean) await cleanExportFolder();
  await createExportFolder();

  // exports
  await exportTransitPlans();
  await exportStops();
  await exportTrips();
}

run();
