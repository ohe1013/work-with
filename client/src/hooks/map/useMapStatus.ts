import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { MapMarkersAtom, MapUserAtom } from "../../recoil/MapStatus";

export function useMapStatus() {
  const [markers] = useRecoilState(MapMarkersAtom);
  const [mapInfo, setMapInfo] = useRecoilState(MapUserAtom);

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
  }, [markers]);

  return {
    markers,
    mapInfo,
    setMapInfo,
  };
}
