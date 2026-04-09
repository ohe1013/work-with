import { MapInfoAtom, MapUserAtom } from "@/recoil/map";
import { MarkerWithId } from "@/types/map";
import { useRecoilValue, useResetRecoilState, useSetRecoilState } from "recoil";

interface FocusMarkerOptions {
  toggle?: boolean;
  zoom?: number;
}

export function useMarkerSelection() {
  const selectedMarker = useRecoilValue(MapInfoAtom);
  const setSelectedMarker = useSetRecoilState(MapInfoAtom);
  const resetSelectedMarker = useResetRecoilState(MapInfoAtom);
  const setMapInfo = useSetRecoilState(MapUserAtom);

  const focusMarker = (
    marker: MarkerWithId,
    options: FocusMarkerOptions = {}
  ) => {
    const { toggle = false, zoom = 3 } = options;

    if (toggle && selectedMarker?.id === marker.id) {
      resetSelectedMarker();
      return;
    }

    setSelectedMarker(marker);
    setMapInfo({
      zoom,
      center: { ...marker.position },
    });
  };

  return {
    selectedMarker,
    focusMarker,
    clearSelectedMarker: resetSelectedMarker,
  };
}
