import { config } from "./config";
import { importGtfsFiles } from "./importGtfs";
import { reset } from "./sqlite";

async function run(): Promise<void> {
  await reset();
  await importGtfsFiles(config.gtfsFiles);
}

run();
