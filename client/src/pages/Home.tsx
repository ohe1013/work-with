import { useRecoilValue } from "recoil";
import Panel from "../components/common/Panel";
import BaseMap from "../components/map/BaseMap";
import { MapDiscoveryAtom, MapInfoAtom, MapMarkersAtom } from "../recoil/map";

export default function Home(): JSX.Element {
  const discoveryState = useRecoilValue(MapDiscoveryAtom);
  const markers = useRecoilValue(MapMarkersAtom);
  const selectedMarker = useRecoilValue(MapInfoAtom);
  const markerSummary =
    discoveryState.phase === "loading"
      ? `${discoveryState.keyword || "주변 장소"} 검색 중`
      : discoveryState.phase === "empty"
        ? "조건을 다시 조정해보세요"
        : discoveryState.phase === "error"
          ? "검색 재시도 필요"
          : markers.length > 0
            ? `${markers.length}곳 비교 가능`
            : "검색 대기";
  const homeDescription =
    discoveryState.phase === "loading"
      ? `${discoveryState.keyword || "주변 장소"} 주변 결과를 정리하고 있어요. 지도와 패널이 같은 흐름으로 동시에 갱신됩니다.`
      : discoveryState.phase === "empty"
        ? `${discoveryState.keyword || "이번 검색"} 주변에는 비교할 장소가 아직 없어요. 다른 공원이나 체육관 이름으로 다시 찾아보세요.`
        : discoveryState.phase === "error"
          ? "검색 결과를 불러오지 못했어요. 같은 검색어로 다시 시도하거나 다른 장소 이름을 입력해 주세요."
          : "장소를 검색하고 마커나 결과 카드를 눌러 주변 모집 흐름을 바로 확인할 수 있도록 지도 중심 구조를 정리했습니다.";
  const selectedSummary =
    selectedMarker?.content ??
    (discoveryState.phase === "loading"
      ? `${discoveryState.keyword || "검색 결과"} 준비 중`
      : discoveryState.phase === "empty"
        ? "다른 장소를 찾아보세요"
        : discoveryState.phase === "error"
          ? "검색을 다시 시도해 주세요"
          : "미리보기 대기 중");
  const selectedDetail =
    selectedMarker?.address_name ??
    (discoveryState.phase === "loading"
      ? "결과가 준비되면 지도와 카드가 같은 선택 흐름으로 이어집니다."
      : discoveryState.phase === "empty"
        ? "검색 범위를 조금 넓히면 바로 비교를 이어갈 수 있어요."
        : discoveryState.phase === "error"
          ? "다시 시도하면 지도 탐색 흐름은 그대로 복구됩니다."
          : "장소를 하나 고르면 선택한 장소의 모집 브리프가 열립니다.");

  return (
    <section className="relative h-full min-h-[calc(100vh-132px)] w-full overflow-hidden rounded-[32px] md:min-h-[calc(100vh-112px)]">
      <article className="relative h-full min-h-[inherit] overflow-hidden rounded-[32px]">
        <div className="absolute inset-0">
          <BaseMap />
        </div>

        <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white/28 to-transparent md:h-32" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-slate-950/12 to-transparent md:h-32" />

        <div className="pointer-events-none absolute inset-x-4 top-4 z-10 md:inset-x-auto md:left-6 md:top-6 md:w-[400px]">
          <Panel className="space-y-4 px-4 py-4 md:px-5 md:py-5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                지도 기반 탐색
              </span>
              <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                {markerSummary}
              </span>
            </div>

            <div className="space-y-2">
              <h2 className="text-lg font-semibold tracking-[-0.03em] text-slate-900 md:text-[1.65rem] md:leading-[1.2]">
                운동 메이트를 지도 위에서 빠르게 비교해보세요
              </h2>
              <p className="text-sm leading-6 text-slate-600 md:text-[15px]">
                {homeDescription}
              </p>
            </div>

            <div className="grid gap-3 border-t border-slate-200/80 pt-3 sm:grid-cols-2">
              <div className="space-y-1">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                  탐색 상태
                </p>
                <p className="mt-2 text-sm font-semibold tracking-[-0.02em] text-slate-900">
                  {markerSummary}
                </p>
                <p className="text-xs leading-5 text-slate-500">
                  검색과 비교 흐름은 같은 패널에서 이어집니다.
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                  현재 선택
                </p>
                <p className="truncate text-sm font-semibold tracking-[-0.02em] text-slate-900">
                  {selectedSummary}
                </p>
                <p className="text-xs leading-5 text-slate-500">
                  {selectedDetail}
                </p>
              </div>
            </div>
          </Panel>
        </div>
      </article>
    </section>
  );
}
