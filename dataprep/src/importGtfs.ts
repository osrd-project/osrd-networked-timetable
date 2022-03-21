import extract from "extract-zip";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";

import { loadCsvInTable } from "./sqlite";

export async function importGtfsFiles(gtfsFiles: Array<string>): Promise<void> {
  await Promise.all(
    gtfsFiles.map(async (gtfsFile) => {
      console.log(`Importing ${gtfsFile}`);
      // Create the directory where we unzip files
      const filename = path.basename(gtfsFile).replace(".zip", "");
      const dirPath = path.join(os.tmpdir(), filename);
      await fs.promises.mkdir(dirPath, { recursive: true });

      // unzip file
      await unzip(gtfsFile, dirPath);

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
          console.log(`Importing file ${file}`);
          await loadCsvInTable(`${dirPath}/${file}`, file.replace(".txt", ""));
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
