import { importGtfs } from "./import/gtfs";
import { Sqlite } from "./sqlite";

async function run(): Promise<void> {
  // reset the db
  const sqlite = await Sqlite.getInstance();
  await sqlite.reset();

  // import all gtfs files
  await importGtfs();
}

run();
