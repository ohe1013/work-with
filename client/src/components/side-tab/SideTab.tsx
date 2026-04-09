import { useEffect, useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import Panel from "../common/Panel";
import { CachedLayoutAtom } from "../../recoil/layout";
import {
  MapDiscoveryAtom,
  MapInfoAtom,
  MapMarkersAtom,
} from "../../recoil/map";
import SearchTab from "./search/SearchTab";

const SideTab = ({ path }: { path: string }) => {
  const setCachedLayout = useSetRecoilState(CachedLayoutAtom);
  const discoveryState = useRecoilValue(MapDiscoveryAtom);
  const markers = useRecoilValue(MapMarkersAtom);
  const selectedMarker = useRecoilValue(MapInfoAtom);
  const [on, setOn] = useState(true);
  const resultSummary =
    discoveryState.phase === "loading"
      ? `${discoveryState.keyword || "주변 장소"}를 지도에 정리하고 있어요`
      : discoveryState.phase === "empty"
        ? `${discoveryState.keyword || "선택한 조건"} 주변에는 비교할 장소가 아직 없어요`
        : discoveryState.phase === "error"
          ? "검색 결과를 다시 불러와 주세요"
          : markers.length > 0
            ? `${markers.length}곳이 지도 위에 준비됐어요`
            : "장소를 입력하면 지도와 결과 목록이 함께 열립니다.";
  const helperCopy =
    selectedMarker?.content ??
    (discoveryState.phase === "loading"
      ? "결과가 준비되면 선택 흐름도 같은 패널에서 이어집니다."
      : discoveryState.phase === "empty"
        ? "다른 공원이나 체육관 이름으로 범위를 조금 넓혀보세요."
        : discoveryState.phase === "error"
          ? "같은 검색어로 다시 시도하면 흐름은 그대로 이어집니다."
          : "검색 후 지도나 카드 중 어느 쪽을 눌러도 같은 장소가 선택됩니다.");
  const resultBadgeLabel =
    discoveryState.phase === "loading"
      ? "탐색 중"
      : discoveryState.phase === "empty"
        ? "결과 없음"
        : discoveryState.phase === "error"
          ? "재시도"
          : markers.length > 0
            ? `${markers.length}곳`
            : "검색 대기";

  useEffect(() => {
    const cachedData = localStorage.getItem(`cachedData:${path}`);
    if (cachedData) {
      setCachedLayout((prev) => ({ ...prev, [path]: JSON.parse(cachedData) }));
    }
  }, [path, setCachedLayout]);

  useEffect(() => {
    if (selectedMarker) {
      setOn(true);
    }
  }, [selectedMarker]);

  if (path !== "/") {
    return null;
  }

  return (
    <section
      className={[
        "fixed bottom-[92px] left-3 right-3 z-20 transition-transform duration-300 md:sticky md:top-[106px] md:bottom-auto md:left-auto md:right-auto md:z-10 md:w-[368px] xl:w-[400px]",
        on ? "translate-y-0" : "translate-y-[calc(100%-114px)] md:translate-y-0",
      ].join(" ")}
    >
      <Panel className="overflow-hidden rounded-[30px]">
        <div className="border-b border-[rgba(148,163,184,0.12)] px-4 pb-4 pt-3 md:px-5 md:py-5">
          <div className="mb-3 flex justify-center md:hidden">
            <span className="h-1.5 w-12 rounded-full bg-slate-200" aria-hidden="true" />
          </div>

          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1 space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                  지도 탐색
                </span>
                <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                  {resultBadgeLabel}
                </span>
              </div>

              <div className="space-y-1">
                <h2 className="text-base font-semibold tracking-[-0.02em] text-slate-900">
                  지금 보고 있는 운동 장소
                </h2>
                <p className="text-sm leading-6 text-slate-500">
                  {selectedMarker
                    ? "선택한 장소가 상단에 고정되고, 다른 후보와 바로 바꿔볼 수 있어요."
                    : on
                      ? resultSummary
                      : helperCopy}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setOn((current) => !current)}
              aria-expanded={on}
              aria-label={on ? "검색 패널 접기" : "검색 패널 펼치기"}
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-600 transition hover:bg-slate-200 hover:text-slate-900"
            >
              {on ? "-" : "+"}
            </button>
          </div>
        </div>

        {on ? (
          <SearchTab key={"sideTab" + path} />
        ) : (
          <div className="space-y-2 px-4 py-4 md:px-5">
            <div className="space-y-1">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                현재 선택
              </p>
              <p className="truncate text-sm font-semibold tracking-[-0.02em] text-slate-900">
                {selectedMarker?.content ??
                  (discoveryState.phase === "loading"
                    ? "검색 결과 준비 중"
                    : discoveryState.phase === "empty"
                      ? "다른 장소를 찾아보세요"
                      : discoveryState.phase === "error"
                        ? "검색 재시도 필요"
                        : "아직 선택한 장소가 없어요")}
              </p>
              <p className="text-xs leading-5 text-slate-500">
                {discoveryState.phase === "loading"
                  ? "패널을 다시 열면 검색 진행 상태와 결과를 바로 이어서 볼 수 있습니다."
                  : "패널을 다시 열면 장소 검색과 모집 비교 흐름을 바로 이어서 볼 수 있습니다."}
              </p>
            </div>
          </div>
        )}
      </Panel>
    </section>
  );
};

export default SideTab;
