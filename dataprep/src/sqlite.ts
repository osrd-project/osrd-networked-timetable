import sqlite3 from "sqlite3";
import { open, Database } from "sqlite";
import * as Papa from "papaparse";
import * as fs from "fs";

import { config, dbSchema } from "./config";

export class Sqlite {
  private static _instance: Sqlite;
  private _db: Database | null = null;

  static async getInstance(): Promise<Sqlite> {
    if (this._instance) {
      return this._instance;
    }
    this._instance = new Sqlite();
    await this._instance.init();
    return this._instance;
  }

  async init() {
    this._db = await open({
      filename: config.sqlitePath,
      driver: sqlite3.Database,
    });
  }

  /**
   * Reset the database
   */
  async reset(): Promise<void> {
    this.db().exec(dbSchema);
  }

  /**
   * Load a CSV files into a table.
   */
  async loadCsvInTable(csv: string, table: string): Promise<void> {
    if (fs.existsSync(csv)) {
      const file = fs.readFileSync(csv, "utf-8");
      const result = await Papa.parse<Array<any>>(file, { delimiter: "," });

      const query = `
        INSERT OR IGNORE INTO ${table}(${result.data[0].map((e) => `\`${e}\``).join(",")})
        VALUES ${result.data.slice(1, -1).map((row) => `(${row.map((e) => `"${e.replaceAll('"', '""')}"`).join(",")})`)}
      `;

      try {
        const stats = await this.db().run(query);
        console.log(`Importing ${stats.changes} into table ${table}`);
      } catch (e) {
        console.log(query);
        console.log(e);
        throw e;
      }
    }
  }

  db(): Database {
    if (this._db === null) throw new Error("DB is not intialized");
    return this._db;
  }
}
