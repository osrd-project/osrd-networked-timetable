import { config } from "../config";
import { Sqlite } from "../sqlite";

export async function exportStopsNetwork(): Promise<void> {
  const sqlite = await Sqlite.getInstance();

  const stops = await sqlite.db().all("SELECT * FROM stops WHERE stops.parent_station IS NULL");
  console.log(stops, config);
}
