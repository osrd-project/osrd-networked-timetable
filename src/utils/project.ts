import SphericalMercator from "@mapbox/sphericalmercator";
import { Coordinates } from "sigma/types";

const merc = new SphericalMercator({
  size: 256,
});

export default function project({ lat, lon }: { lat: number; lon: number }): Coordinates {
  const [x, y] = merc.px([lon, lat], 10);
  return { x, y: -y };
}
