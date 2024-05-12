import { Marker } from "@/recoil/map";

export interface MarkerWithId extends Marker {
  id: string;
}
