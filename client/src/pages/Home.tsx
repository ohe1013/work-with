import { useRecoilValue } from "recoil";
import Panel from "../components/common/Panel";
import BaseMap from "../components/map/BaseMap";
import { MapInfoAtom, MapMarkersAtom } from "../recoil/map";

export default function Home(): JSX.Element {
  const markers = useRecoilValue(MapMarkersAtom);
  const selectedMarker = useRecoilValue(MapInfoAtom);
  const markerSummary =
    markers.length > 0 ? `${markers.length}곳 비교 가능` : "검색 전";
  const selectedSummary = selectedMarker?.content ?? "미리보기 대기 중";
  const selectedDetail =
    selectedMarker?.address_name ?? "마커나 결과 카드를 누르면 즉시 비교할 수 있어요.";

  return (
    <section className="relative h-full min-h-[calc(100vh-126px)] w-full overflow-hidden rounded-[32px] md:min-h-[calc(100vh-108px)]">
      <article className="relative h-full min-h-[inherit] overflow-hidden rounded-[32px]">
        <div className="absolute inset-0">
          <BaseMap></BaseMap>
        </div>

        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.24),_transparent_42%)]" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-slate-950/18 via-slate-950/6 to-transparent md:h-36" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-slate-950/20 via-slate-950/8 to-transparent md:h-44" />

        <div className="pointer-events-none absolute inset-x-4 top-4 z-10 md:inset-x-auto md:left-6 md:top-6 md:w-[420px]">
          <Panel tone="soft" className="space-y-4 px-4 py-4 md:px-5 md:py-5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-[rgba(14,116,144,0.12)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[rgb(var(--color-accent))]">
                Map-first home
              </span>
              <span className="rounded-full bg-white/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                {markerSummary}
              </span>
            </div>

            <div className="space-y-2">
              <h2 className="text-lg font-semibold tracking-[-0.03em] text-slate-900 md:text-[1.75rem] md:leading-[1.2]">
                운동 메이트를 지도 위에서 빠르게 비교하세요
              </h2>
              <p className="text-sm leading-6 text-slate-600 md:text-[15px]">
                장소를 검색하고, 마커나 결과 카드를 눌러 주변 모집 흐름을 바로
                확인할 수 있도록 홈 화면의 위계를 정리했습니다.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-[22px] bg-white/72 px-4 py-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                  Map status
                </p>
                <p className="mt-2 text-sm font-semibold tracking-[-0.02em] text-slate-900">
                  {markerSummary}
                </p>
                <p className="mt-1 text-xs leading-5 text-slate-500">
                  검색 패널은 한 번의 탭으로 다시 열 수 있어요.
                </p>
              </div>

              <div className="rounded-[22px] bg-white/72 px-4 py-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                  Current focus
                </p>
                <p className="mt-2 truncate text-sm font-semibold tracking-[-0.02em] text-slate-900">
                  {selectedSummary}
                </p>
                <p className="mt-1 text-xs leading-5 text-slate-500">
                  {selectedDetail}
                </p>
              </div>
            </div>
          </Panel>
        </div>

        <div className="pointer-events-none absolute bottom-6 right-6 z-10 hidden w-[310px] lg:block">
          <Panel tone="strong" className="space-y-3 px-4 py-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              How it works
            </p>
            <div className="space-y-2.5 text-sm leading-6 text-slate-600">
              <div className="flex items-start gap-3">
                <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/88 text-xs font-semibold text-[rgb(var(--color-accent))]">
                  1
                </span>
                <p>가까운 공원이나 체육관을 검색해 지도 범위를 먼저 좁힙니다.</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/88 text-xs font-semibold text-[rgb(var(--color-accent))]">
                  2
                </span>
                <p>결과 카드나 마커를 눌러 현재 모집 흐름을 가볍게 비교합니다.</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/88 text-xs font-semibold text-[rgb(var(--color-accent))]">
                  3
                </span>
                <p>필요한 연결만 선택해서 부담 없이 다음 단계로 넘어갑니다.</p>
              </div>
            </div>
          </Panel>
        </div>
      </article>
    </section>
  );
}
