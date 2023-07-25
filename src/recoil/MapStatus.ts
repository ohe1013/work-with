import { atom } from "recoil";
import { MarkerWithId } from "../components/map/SearchBar";
export interface Marker {
  content: string;
  position: {
    lat: number;
    lng: number;
  };
}
export const MapAtom = atom<unknown>({
  key: "MapAtom",
  default: Object,
});

export const MapMarkersAtom = atom<MarkerWithId[]>({
  key: "MapMarkersAtom",
  default: [],
});
