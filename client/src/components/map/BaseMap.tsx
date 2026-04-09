import { CustomOverlayMap, Map, MapMarker } from "react-kakao-maps-sdk";
import { useRecoilValue } from "recoil";
import { useMapStatus } from "../../hooks/map/useMapStatus";
import { useMarkerSelection } from "../../hooks/map/useMarkerSelection";
import { MapDiscoveryAtom } from "../../recoil/map";

export default function BaseMap() {
  const { markers, mapInfo } = useMapStatus();
  const discoveryState = useRecoilValue(MapDiscoveryAtom);
  const { selectedMarker, focusMarker, clearSelectedMarker } =
    useMarkerSelection();
  const discoveryOverlay = selectedMarker
    ? null
    : discoveryState.phase === "loading"
      ? {
          eyebrow: "탐색 중",
          title: `${discoveryState.keyword || "주변 장소"} 주변을 찾고 있어요`,
          description:
            "결과가 준비되면 지도 마커와 비교 패널이 함께 갱신됩니다.",
        }
      : discoveryState.phase === "empty"
        ? {
            eyebrow: "결과 없음",
            title: "다른 장소로 다시 찾아보세요",
            description: `${
              discoveryState.keyword || "이번 검색"
            } 주변에는 아직 비교할 장소가 없었어요.`,
          }
        : discoveryState.phase === "error"
          ? {
              eyebrow: "재시도 필요",
              title: "검색을 다시 시도해 주세요",
              description:
                discoveryState.errorMessage ??
                "잠시 후 같은 장소 이름으로 다시 검색해 주세요.",
            }
          : markers.length === 0
            ? {
                eyebrow: "탐색 시작",
                title: "공원이나 체육관 이름으로 시작하세요",
                description:
                  "장소를 검색하면 마커와 결과 카드가 함께 열리고 바로 비교를 이어갈 수 있어요.",
              }
            : null;

  return (
    <Map
      center={mapInfo.center}
      style={{
        width: "100%",
        height: "100%",
      }}
      level={mapInfo.zoom}
      onClick={clearSelectedMarker}
    >
      {discoveryOverlay ? (
        <CustomOverlayMap position={mapInfo.center} yAnchor={1.18} xAnchor={0.5}>
          <div className="pointer-events-none w-[240px] rounded-[24px] border border-white/80 bg-white/92 px-4 py-3 text-left shadow-[0_24px_54px_rgba(15,23,42,0.18)] backdrop-blur-sm md:w-[280px]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              {discoveryOverlay.eyebrow}
            </p>
            <p className="mt-1 text-sm font-semibold tracking-[-0.02em] text-slate-900">
              {discoveryOverlay.title}
            </p>
            <p className="mt-1 text-xs leading-5 text-slate-500">
              {discoveryOverlay.description}
            </p>
          </div>
        </CustomOverlayMap>
      ) : null}

      {selectedMarker ? (
        <CustomOverlayMap
          position={selectedMarker.position}
          yAnchor={1.35}
          xAnchor={0.5}
        >
          <div className="pointer-events-none inline-flex items-center gap-2 rounded-full bg-slate-950/84 px-3 py-2 text-xs font-semibold text-white shadow-[0_14px_34px_rgba(15,23,42,0.24)] backdrop-blur-sm">
            <span
              className="h-2 w-2 rounded-full bg-[rgb(var(--color-accent))]"
              aria-hidden="true"
            />
            <span className="max-w-[180px] truncate">
              {selectedMarker.content}
            </span>
          </div>
        </CustomOverlayMap>
      ) : null}

      {markers.map((marker) => (
        <MapMarker
          key={`marker-${marker.content}-${marker.position.lat},${marker.position.lng}`}
          position={marker.position}
          onClick={() => focusMarker(marker)}
        />
      ))}
    </Map>
  );
}
