import { config } from "./config";
import { Sqlite } from "./sqlite";
import { importGtfs } from "./import/gtfs";
import { exportStopsNetwork } from "./export/stopsNetwork";

async function run(): Promise<void> {
  // reset the db
  const sqlite = await Sqlite.getInstance();

  // import all gtfs files
  if (!config.exportOnly) {
    await sqlite.reset();
    await importGtfs();
  }

  // exports
  await exportStopsNetwork();
}

run();
