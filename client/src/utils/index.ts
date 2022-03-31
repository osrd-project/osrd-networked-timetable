import * as Papa from "papaparse";
export * from "./project";

export function downloadDataAnParseCsv<T>(url: string, dynamicTyping = true): Promise<Array<T>> {
  return new Promise((resolve, reject) => {
    Papa.parse<T>(url, {
      download: true,
      delimiter: ",",
      dynamicTyping,
      skipEmptyLines: true,
      header: true,
      error: (e) => reject(e),
      complete: (result) => resolve(result.data),
    });
  });
}
