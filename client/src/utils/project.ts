import SphericalMercator from "@mapbox/sphericalmercator";
import { Coordinates } from "sigma/types";

const merc = new SphericalMercator({
  size: 256,
});

export default function project({ lat, lng }: { lat: number; lng: number }): Coordinates {
  const [x, y] = merc.px([lng, lat], 10);
  return { x, y: -y };
}
