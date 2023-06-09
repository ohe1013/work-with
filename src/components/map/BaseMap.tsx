import { useEffect, useState } from "react";
import { Map, MapMarker, useInjectKakaoMapApi } from "react-kakao-maps-sdk";
import { useRecoilState } from "recoil";
import { MapAtom, MapMarkersAtom } from "../../recoil/MapStatus";

export default function BaseMap() {
  const [markers, setMarkers] = useRecoilState(MapMarkersAtom);
  const [map, setMap] = useRecoilState(MapAtom);

  const [info, setInfo] = useState();
  const [state, setState] = useState({
    // 지도의 초기 위치
    center: { lat: 33.452613, lng: 126.570888 },
    // 지도 위치 변경시 panto를 이용할지에 대해서 정의
    isPanto: false,
  });
  const mapOption = {
    center: new kakao.maps.LatLng(33.450701, 126.570667), // 지도의 중심좌표
    level: 3, // 지도의 확대 레벨
  };
  useEffect(() => {
    console.log(map);
    if (!map.a) return;
    // const ps = new kakao.maps.services.Places();
    // console.log(ps);
    // ps.keywordSearch("인덕원", (data, status, _pagination) => {
    //   if (status === kakao.maps.services.Status.OK) {
    //     // 검색된 장소 위치를 기준으로 지도 범위를 재설정하기위해
    //     // LatLngBounds 객체에 좌표를 추가합니다
    //     const bounds = new kakao.maps.LatLngBounds();
    //     let markers: Marker[] = [];

    //     for (let i = 0; i < data.length; i++) {
    //       markers.push({
    //         position: {
    //           lat: data[i].y,
    //           lng: data[i].x,
    //         },
    //         content: data[i].place_name,
    //       });
    //       bounds.extend(new kakao.maps.LatLng(data[i].y, data[i].x));
    //     }
    //     setMarkers(markers);

    //     // 검색된 장소 위치를 기준으로 지도 범위를 재설정합니다
    //   }
    // });
  }, [map]);
  return (
    <Map // 로드뷰를 표시할 Container
      center={{
        lat: 37.566826,
        lng: 126.9786567,
      }}
      style={{
        width: "100%",
        height: "350px",
      }}
      level={3}
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
