import sqlite3 from "sqlite3";
import { open } from "sqlite";
import * as Papa from "papaparse";
import * as fs from "fs";
import { config } from "./config";

export async function reset(): Promise<void> {
  const db = await open({
    filename: config.sqlitePath,
    driver: sqlite3.Database,
  });
  db.exec(config.dbSchema);
}

export async function loadCsvInTable(csv: string, table: string): Promise<void> {
  const db = await open({
    filename: config.sqlitePath,
    driver: sqlite3.Database,
  });
  if (fs.existsSync(csv)) {
    const file = fs.readFileSync(csv, "utf-8");
    const result = await Papa.parse<Array<any>>(file, { delimiter: "," });
    // console.log(result);

    const query = `
      INSERT OR IGNORE INTO ${table}(${result.data[0].map((e) => `\`${e}\``).join(",")})
      VALUES ${result.data.slice(1, -1).map((row) => `(${row.map((e) => `"${e.replaceAll('"', '""')}"`).join(",")})`)}
    `;
    // console.log(query);
    try {
      const stats = await db.run(query);
      console.log(`Importing ${stats.changes}`);
    } catch (e) {
      console.log(query);
      console.log(e);
      throw e;
    }
  }
}
