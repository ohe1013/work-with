import { atom } from "recoil";
export interface Marker {
  content: string;
  position: {
    lat: string;
    lng: string;
  };
}
export const MapAtom = atom<unknown>({
  key: "MapAtom",
  default: Object,
});

export const MapMarkersAtom = atom<Marker[]>({
  key: "MapMarkersAtom",
  default: [],
});
