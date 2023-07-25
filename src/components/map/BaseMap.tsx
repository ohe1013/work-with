import { useEffect, useState } from "react";
import { CustomOverlayMap, Map, MapMarker } from "react-kakao-maps-sdk";
import { useRecoilState } from "recoil";
import { MapMarkersAtom, Marker } from "../../recoil/MapStatus";
import Card from "../common/Card";
import { MarkerWithId } from "./SearchBar";

export default function BaseMap() {
  const [info, setInfo] = useState<MarkerWithId>();
  const [markers] = useRecoilState(MapMarkersAtom);
  const [zoomLevel, setZoomLevel] = useState(3);
  const [mapInfo, setMapInfo] = useState({
    center: {
      lat: 37.566826,
      lng: 126.9786567,
    },
  });

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
    setMapInfo({ center: { lat, lng } });
    setZoomLevel(10);
  }, [mapInfo.center.lat, mapInfo.center.lng, markers]);

  return (
    <>
      <Map // 로드뷰를 표시할 Container
        center={mapInfo.center}
        style={{
          width: "80%",
          height: "80%",
        }}
        level={zoomLevel}
      >
        <CustomOverlayMap
          position={{
            lat: mapInfo.center.lat,
            lng: mapInfo.center.lng,
          }}
        ></CustomOverlayMap>
        {markers.map((marker) => (
          <MapMarker
            key={`marker-${marker.content}-${marker.position.lat},${marker.position.lng}`}
            position={marker.position}
            onClick={() => setInfo(marker)}
          >
            {info && info.content === marker.content && (
              <Card
                id={marker.id}
                title={marker.content}
                position={marker.position}
              ></Card>
            )}
          </MapMarker>
        ))}
      </Map>
    </>
  );
}
