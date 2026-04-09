import { useEffect, useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import Panel from "../common/Panel";
import { CachedLayoutAtom } from "../../recoil/layout";
import { MapInfoAtom, MapMarkersAtom } from "../../recoil/map";
import SearchTab from "./search/SearchTab";

const SideTab = ({ path }: { path: string }) => {
  const setCachedLayout = useSetRecoilState(CachedLayoutAtom);
  const markers = useRecoilValue(MapMarkersAtom);
  const selectedMarker = useRecoilValue(MapInfoAtom);
  const [on, setOn] = useState(true);
  const resultSummary =
    markers.length > 0 ? `${markers.length}곳이 지도에 준비됐어요` : "장소 검색이 아직 없어요";
  const helperCopy =
    selectedMarker?.content ?? "검색 후 마커를 누르면 여기서 바로 비교할 수 있어요.";

  useEffect(() => {
    const cachedData = localStorage.getItem(`cachedData:${path}`);
    if (cachedData) {
      setCachedLayout((prev) => ({ ...prev, [path]: JSON.parse(cachedData) }));
    }
  }, [path, setCachedLayout]);

  if (path !== "/") {
    return null;
  }

  return (
    <section
      className={[
        "fixed bottom-[92px] left-3 right-3 z-20 transition-transform duration-300 md:sticky md:top-[104px] md:bottom-auto md:left-auto md:right-auto md:z-10 md:w-[360px] xl:w-[388px]",
        on ? "translate-y-0" : "translate-y-[calc(100%-108px)] md:translate-y-0",
      ].join(" ")}
    >
      <Panel className="overflow-hidden rounded-[32px]">
        <div className="border-b border-[rgba(148,163,184,0.12)] px-4 pb-4 pt-3 md:px-5 md:py-5">
          <div className="mb-3 flex justify-center md:hidden">
            <span className="h-1.5 w-12 rounded-full bg-slate-200" aria-hidden="true" />
          </div>

          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1 space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-[rgba(14,116,144,0.08)] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[rgb(var(--color-accent))]">
                  Discovery panel
                </span>
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                  {markers.length > 0 ? `${markers.length} results` : "Ready"}
                </span>
              </div>

              <div className="space-y-1">
                <h2 className="text-base font-semibold tracking-[-0.02em] text-slate-900">
                  지금 가능한 운동 메이트
                </h2>
                <p className="text-sm leading-6 text-slate-500">
                  {on ? resultSummary : helperCopy}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setOn((current) => !current)}
              aria-expanded={on}
              aria-label={on ? "홈 검색 패널 접기" : "홈 검색 패널 펼치기"}
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-600 transition hover:bg-slate-200 hover:text-slate-900"
            >
              {on ? "−" : "+"}
            </button>
          </div>
        </div>

        {on ? (
          <SearchTab key={"sideTab" + path}></SearchTab>
        ) : (
          <div className="space-y-2 px-4 py-4 md:px-5">
            <div className="rounded-[22px] bg-slate-50 px-4 py-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                Current focus
              </p>
              <p className="mt-2 truncate text-sm font-semibold tracking-[-0.02em] text-slate-900">
                {selectedMarker?.content ?? "아직 선택된 장소가 없어요"}
              </p>
              <p className="mt-1 text-xs leading-5 text-slate-500">
                패널을 다시 열면 검색과 결과 목록을 바로 이어서 볼 수 있습니다.
              </p>
            </div>
          </div>
        )}
      </Panel>
    </section>
  );
};

export default SideTab;
