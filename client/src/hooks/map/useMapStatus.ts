import { MapMarkersAtom, MapUserAtom } from "@/recoil/map";
import { useEffect } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";

export function useMapStatus() {
  const markers = useRecoilValue(MapMarkersAtom);
  const mapInfo = useRecoilValue(MapUserAtom);
  const setMapInfo = useSetRecoilState(MapUserAtom);

  useEffect(() => {
    let lat = mapInfo.center.lat;
    let lng = mapInfo.center.lng;
    if (markers.length === 0) return;
    markers.map((marker) => {
      lat += +marker.position.lat;
      lng += +marker.position.lng;
    });
    lat = lat / (markers.length + 1);
    lng = lng / (markers.length + 1);
    setMapInfo({ zoom: 3, center: { lat, lng } });
  }, [markers, mapInfo.center.lat, mapInfo.center.lng, setMapInfo]);

  return {
    markers,
    mapInfo,
    setMapInfo,
  };
}
