export * from "./dbSchema";

export const config = {
  sqlitePath: "../sqlite.db",
  importPath: process.env.DATAPREP_IMPORT_FOLDER || "./import",
  exportPath: process.env.DATAPREP_EXPORT_FOLDER || "../client/public/data",
  exportClean: process.env.DATAPREP_EXPORT_CLEAN ? JSON.parse(process.env.DATAPREP_EXPORT_CLEAN) : true,
  exportOnly: process.env.DATAPREP_EXPORT_ONLY ? JSON.parse(process.env.DATAPREP_EXPORT_ONLY) : false,
};
