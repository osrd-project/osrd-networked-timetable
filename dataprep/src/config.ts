export const config = {
  sqlitePath: "../sqlite.db",
  gtfsFiles: [
    "./import/export_gtfs_voyages.zip",
    "./import/export-intercites-gtfs-last.zip",
    "./import/export-ter-gtfs-last.zip",
    "./import/transilien-gtfs.zip",
  ],
  dbSchema: `
    DROP TABLE IF EXISTS feed_info;
    CREATE TABLE feed_info (
      feed_id             text PRIMARY KEY,
      feed_publisher_name text NOT NULL,
      feed_publisher_url  text NOT NULL,
      feed_lang           text NOT NULL,
      feed_start_date     text NOT NULL,
      feed_end_date       text NOT NULL,
      feed_version        text NOT NULL,
      conv_rev            text NOT NULL,
      plan_rev            text NOT NULL
    );

    DROP TABLE IF EXISTS agency;
    CREATE TABLE agency (
      agency_id         text PRIMARY KEY,
      agency_name       text NOT NULL,
      agency_url        text NOT NULL,
      agency_timezone   text NOT NULL,
      agency_lang       text NULL,
      agency_phone      text NULL,
      agency_email      TEXT NULL
    );

    DROP TABLE IF EXISTS calendar;
    CREATE TABLE calendar (
      service_id        text PRIMARY KEY,
      monday            boolean NOT NULL,
      tuesday           boolean NOT NULL,
      wednesday         boolean NOT NULL,
      thursday          boolean NOT NULL,
      friday            boolean NOT NULL,
      saturday          boolean NOT NULL,
      sunday            boolean NOT NULL,
      start_date        numeric(8) NOT NULL,
      end_date          numeric(8) NOT NULL
    );

    DROP TABLE IF EXISTS calendar_dates;
    CREATE TABLE calendar_dates (
      service_id text NOT NULL,
      date numeric(8) NOT NULL,
      exception_type integer NOT NULL
    );

    DROP TABLE IF EXISTS routes;
    CREATE TABLE routes (
      route_id          text PRIMARY KEY,
      agency_id         text NULL,
      route_short_name  text NULL,
      route_long_name   text NULL,
      route_desc        text NULL,
      route_sort_order  text NULL,
      route_type        integer NULL,
      route_url         text NULL,
      route_color       text NULL,
      route_text_color  text NULL
    );

    DROP TABLE IF EXISTS stops;
    CREATE TABLE stops (
      stop_id text PRIMARY KEY,
      stop_code text,
      stop_name text NOT NULL,
      stop_desc text NOT NULL,
      stop_lon double precision NOT NULL,
      stop_lat double precision NOT NULL,
      zone_id text NOT NULL,
      stop_url text NOT NULL,
      location_type boolean NOT NULL,
      parent_station text NOT NULL,
      stop_timezone text,
      level_id text,
      wheelchair_boarding boolean,
      platform_code text
    );

    DROP TABLE IF EXISTS stop_times;
    CREATE TABLE stop_times (
      trip_id text NOT NULL,
      arrival_time text NOT NULL,
      departure_time text NOT NULL,
      stop_id text NOT NULL,
      stop_sequence text NOT NULL,
      pickup_type text NOT NULL,
      drop_off_type text NOT NULL,
      local_zone_id text,
      stop_headsign text NOT NULL,
      timepoint text,
      shape_dist_traveled text
    );

    DROP TABLE IF EXISTS stop_extensions;
    CREATE TABLE stop_extensions (
      object_id TEXT NOT NULL,
      object_system TEXT NOT NULL,
      object_code TEXT NOT NULL
    );

    DROP TABLE IF EXISTS transfers;
    CREATE TABLE transfers (
      from_stop_id TEXT NOT NULL,
      to_stop_id TEXT NOT NULL,
      transfer_type TEXT NOT NULL,
      min_transfer_time integer NOT NULL,
      from_route_id TEXT NOT NULL,
      to_route_id TEXT NOT NULL
    );

    DROP TABLE IF EXISTS trips;
    CREATE TABLE trips (
      route_id TEXT NOT NULL,
      service_id TEXT NOT NULL,
      trip_id TEXT PRIMARY KEY,
      trip_headsign TEXT NOT NULL,
      trip_short_name TEXT,
      direction_id TEXT NOT NULL,
      block_id TEXT NOT NULL,
      shape_id TEXT,
      wheelchair_accessible BOOLEAN,
      bikes_allowed BOOLEAN
    );
  `,
};
