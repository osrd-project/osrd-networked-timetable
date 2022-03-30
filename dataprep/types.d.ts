declare module "@reticular/types" {
  import { SerializedGraph } from "graphology";
  export interface Agency {
    id: string;
    name: string;
  }

  export interface Route {
    id: string;
    code: string;
    name: string;
    description?: string;
    agencyId: string;
  }

  export interface Stop {
    id: string;
    name: string;
    lng: number;
    lat: number;
  }

  export interface StopTime {
    id: string;
    arrival: Date;
    departure: Date;
    sequence: number;
  }

  export interface Trip {
    id: string;
    headsign: string;
    direction: string;
    monday: boolean;
    tuesday: boolean;
    wednesday: boolean;
    thursday: boolean;
    friday: boolean;
    saturday: boolean;
    sunday: boolean;
    start_date: Date;
    end_date: Date;
    dates: Array<Date>;
    exceptions: Array<Date>;
    stops: Array<StopTime>;
  }

  export type RouteFull = Route & { network: SerializedGraph; trips: Array<Trip> };
}
