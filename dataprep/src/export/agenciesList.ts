import { Sqlite } from "../sqlite";
import { writeCsv } from "../utils";
import { Agency } from "@reticular/types";

export async function exportAgenciesList(): Promise<void> {
  const sqlite = await Sqlite.getInstance();
  const agencies = await sqlite.db().all<Agency[]>(`
    SELECT
      agency_id as id,
      agency_name as name
    FROM agency
  `);
  await writeCsv(agencies, "agencies.csv");
}
