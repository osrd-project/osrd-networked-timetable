# Reticular

An application to display GTFS files

TransitPlan

## Dataprep

Generate some JSON files for the client from GTFS files : `npm run data:generate`
It imports all GTFS files from the "import" folder.

For example, to have the complete SNCF network, you can

1. download those files :

- https://eu.ftp.opendatasoft.com/sncf/gtfs/transilien-gtfs.zip
- https://eu.ftp.opendatasoft.com/sncf/gtfs/export_gtfs_voyages.zip
- https://eu.ftp.opendatasoft.com/sncf/gtfs/export-intercites-gtfs-last.zip
- https://eu.ftp.opendatasoft.com/sncf/gtfs/export-ter-gtfs-last.zip

2. Put them into the import folder

3. Execute the following command : `npm run data:generate`

At this step, all needed files for the client are generated, so you can start to use it

## Client

React application to visualize GTFS files
