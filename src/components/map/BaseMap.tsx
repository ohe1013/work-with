import { useState } from "react";
import { Map, useInjectKakaoMapApi } from "react-kakao-maps-sdk";

export default function BaseMap() {
    const { loading, error } = useInjectKakaoMapApi({
        appkey: import.meta.env.VITE_KAKAO_API_KEY,
    });
    const [state, setState] = useState({
        // 지도의 초기 위치
        center: { lat: 33.452613, lng: 126.570888 },
        // 지도 위치 변경시 panto를 이용할지에 대해서 정의
        isPanto: false,
    });

    return loading ? (
        "Loading"
    ) : (
        <Map // 지도를 표시할 Container
            center={state.center}
            isPanto={state.isPanto}
            style={{
                // 지도의 크기
                width: "100%",
                height: "450px",
            }}
            level={3} // 지도의 확대 레벨
        >
            <div
                style={{
                    display: "flex",
                    gap: "10px",
                }}
            >
                <button
                    onClick={() =>
                        setState({
                            center: { lat: 33.452613, lng: 126.570888 },
                            isPanto: false,
                        })
                    }
                >
                    지도 중심좌표 이동시키기
                </button>
                <button
                    onClick={() =>
                        setState({
                            center: { lat: 33.45058, lng: 126.574942 },
                            isPanto: true,
                        })
                    }
                >
                    지도 중심좌표 부드럽게 이동시키기
                </button>
            </div>
        </Map>
    );
}
