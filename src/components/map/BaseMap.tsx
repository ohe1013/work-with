import { useEffect, useState } from "react";
import { Map, MapMarker } from "react-kakao-maps-sdk";
import { useRecoilState } from "recoil";
import { MapAtom, MapMarkersAtom } from "../../recoil/MapStatus";

export default function BaseMap() {
    // const [markers, setMarkers] = useRecoilState(MapMarkersAtom);
    const [info, setInfo] = useState();
    const [markers, setMarkers] = useRecoilState(MapMarkersAtom);
    const [map, setMap] = useState();
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
        console.log(lat, lng);
        lat = lat / (markers.length + 1);
        lng = lng / (markers.length + 1);
        setMapInfo({ center: { lat, lng } });
        setZoomLevel(10);
    }, [mapInfo.center.lat, mapInfo.center.lng, markers]);

    return (
        <Map // 로드뷰를 표시할 Container
            center={mapInfo.center}
            style={{
                width: "100%",
                height: "350px",
            }}
            level={zoomLevel}
            onCreate={setMap}
        >
            {markers.map((marker) => (
                <MapMarker
                    key={`marker-${marker.content}-${marker.position.lat},${marker.position.lng}`}
                    position={marker.position}
                    onClick={() => setInfo(marker)}
                >
                    {info && info.content === marker.content && (
                        <div style={{ color: "#000" }}>{marker.content}</div>
                    )}
                </MapMarker>
            ))}
        </Map>
    );
}
