import { CustomOverlayMap, Map, MapMarker } from "react-kakao-maps-sdk";
import { useRecoilState } from "recoil";
import { MapInfoAtom } from "../../recoil/MapStatus";
import Card from "../common/Card";
import { MarkerWithId } from "../../types/map";
import { useMapStatus } from "../../hooks/map/useMapStatus";

export default function BaseMap() {
  const [info, setInfo] = useRecoilState<MarkerWithId>(MapInfoAtom);
  const { markers, mapInfo } = useMapStatus();

  return (
    <>
      <Map // 로드뷰를 표시할 Container
        center={mapInfo.center}
        style={{
          width: "100%",
          height: "100%",
        }}
        level={mapInfo.zoom}
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
