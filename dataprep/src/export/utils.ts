import * as Papa from "papaparse";
import { promises as fs } from "fs";

import { config } from "../config";

export async function writeFile(content: string, file: string): Promise<void> {
  await fs.writeFile(`${config.exportPath}/${file}`, content, "utf-8");
}

export async function writeCsv(items: Array<unknown>, file: string): Promise<void> {
  const csv = Papa.unparse(items, { header: true });
  writeFile(csv, file);
}
