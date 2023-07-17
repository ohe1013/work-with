import { useEffect } from "react";

const searchKakao = async (params: any) => {
    useEffect(() => {
        if (!map) return;
        const ps = new kakao.maps.services.Places();

        ps.keywordSearch("이태원 맛집", (data, status, _pagination) => {
            if (status === kakao.maps.services.Status.OK) {
                // 검색된 장소 위치를 기준으로 지도 범위를 재설정하기위해
                // LatLngBounds 객체에 좌표를 추가합니다
                const bounds = new kakao.maps.LatLngBounds();
                const markers = [];

                for (let i = 0; i < data.length; i++) {
                    markers.push({
                        position: {
                            lat: data[i].y,
                            lng: data[i].x,
                        },
                        content: data[i].place_name,
                    });
                    bounds.extend(new kakao.maps.LatLng(data[i].y, data[i].x));
                }
                setMarkers(markers);

                // 검색된 장소 위치를 기준으로 지도 범위를 재설정합니다
                map.setBounds(bounds);
            }
        });
    }, [map]);
};

export { searchKakao };
