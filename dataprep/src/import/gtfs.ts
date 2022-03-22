import extract from "extract-zip";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";

import { config } from "../config";
import { Sqlite } from "../sqlite";

/**
 * Import GTFS files into Sqlite instance.
 */
export async function importGtfs(): Promise<void> {
  const sqlite = await Sqlite.getInstance();

  const files = fs.readdirSync(config.importPath);

  await Promise.all(
    files
      .filter((f) => f.endsWith(".zip"))
      .map(async (filename) => {
        console.log(`Importing ${filename}`);

        // Create the directory where we unzip files
        const dirPath = path.join(os.tmpdir(), filename.replace(".zip", ""));
        await fs.promises.mkdir(dirPath, { recursive: true });

        // unzip file
        await unzip(`${config.importPath}/${filename}`, dirPath);

        // for each files, we load them in sqlite
        await Promise.all(
          [
            "agency.txt",
            "calendar_dates.txt",
            "calendar.txt",
            "feed_info.txt",
            "routes.txt",
            "stop_extensions.txt",
            "stops.txt",
            "stop_times.txt",
            "transfers.txt",
            "trips.txt",
          ].map(async (file) => {
            console.log(`Importing ${filename} - ${file}`);
            await sqlite.loadCsvInTable(`${dirPath}/${file}`, file.replace(".txt", ""));
          }),
        );
      }),
  );
}

/**
 * Unzip <code>file</code> into the specified <code>path</code>
 */
async function unzip(file: string, path: string): Promise<void> {
  await extract(file, { dir: path });
}
