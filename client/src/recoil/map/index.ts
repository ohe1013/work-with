import { atom } from "recoil";
import { MarkerWithId } from "../../types/map";
export interface Marker {
  content: string;
  position: {
    lat: number;
    lng: number;
  };
  place_url: string;
  category_name: string;
  phone: string;
  address_name: string;
}

export interface MapUserInfo {
  zoom: number;
  center: {
    lat: number;
    lng: number;
  };
}

export type MapDiscoveryPhase =
  | "idle"
  | "loading"
  | "results"
  | "empty"
  | "error";

export interface MapDiscoveryState {
  phase: MapDiscoveryPhase;
  keyword: string;
  resultCount: number;
  errorMessage?: string;
}

export const MapUserAtom = atom<MapUserInfo>({
  key: "MapUserAtom",
  default: {
    zoom: 3,
    center: {
      lat: 37.566826,
      lng: 126.9786567,
    },
  },
});

export const MapAtom = atom<unknown>({
  key: "MapAtom",
  default: Object,
});

export const MapMarkersAtom = atom<MarkerWithId[]>({
  key: "MapMarkersAtom",
  default: [],
});

export const MapDiscoveryAtom = atom<MapDiscoveryState>({
  key: "MapDiscoveryAtom",
  default: {
    phase: "idle",
    keyword: "",
    resultCount: 0,
  },
});

export const MapInfoAtom = atom<MarkerWithId>({
  key: "MapInfoAtom",
  default: undefined,
});
