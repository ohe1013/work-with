import { useEffect } from "react";
import { CustomOverlayMap, Map, MapMarker } from "react-kakao-maps-sdk";
import { useRecoilState } from "recoil";
import { MapInfoAtom, MapMarkersAtom, MapUserAtom } from "../../recoil/MapStatus";
import Card from "../common/Card";
import { MarkerWithId } from "../../types/map";

export default function BaseMap() {
    const [info, setInfo] = useRecoilState<MarkerWithId>(MapInfoAtom);
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

    useEffect(() => {}, [setMapInfo, mapInfo.center.lat, mapInfo.center.lng]);

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
