import { useRecoilValue } from "recoil";
import EmptyState from "@/components/common/EmptyState";
import Panel from "@/components/common/Panel";
import { MapMarkersAtom } from "@/recoil/map";
import { useMarkerSelection } from "@/hooks/map/useMarkerSelection";

export default function SearchList() {
  const markers = useRecoilValue(MapMarkersAtom);
  const { selectedMarker, focusMarker } = useMarkerSelection();

  if (markers.length === 0) {
    return (
      <EmptyState
        eyebrow="Search ready"
        title="검색 결과가 아직 없어요"
        description="장소를 검색하면 주변 운동 메이트 모집과 비교할 수 있는 후보를 여기에 보여드릴게요."
      />
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-1.5 px-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
            Map results
          </p>
          <h3 className="mt-1 text-sm font-semibold tracking-[-0.02em] text-slate-900">
            {markers.length}곳을 바로 비교할 수 있어요
          </h3>
        </div>
        <p className="text-xs leading-5 text-slate-500">
          카드나 마커를 누르면 같은 상세가 바로 열립니다.
        </p>
      </div>

      {markers.map((marker, idx) => (
        <Panel
          key={marker.id + idx}
          tone="soft"
          className={[
            "overflow-hidden",
            selectedMarker?.id === marker.id
              ? "ring-1 ring-[rgba(14,116,144,0.18)] shadow-[0_18px_44px_rgba(14,116,144,0.12)]"
              : "",
          ].join(" ")}
        >
          <button
            type="button"
            onClick={() => focusMarker(marker, { toggle: true })}
            aria-pressed={selectedMarker?.id === marker.id}
            className={[
              "flex w-full flex-col gap-3 px-4 py-4 text-left transition hover:bg-white/60",
              selectedMarker?.id === marker.id ? "bg-white/70" : "",
            ].join(" ")}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-sm font-semibold tracking-[-0.02em] text-slate-900">
                  {marker.content}
                </h3>
                <p className="mt-1 text-xs font-medium uppercase tracking-[0.14em] text-slate-400">
                  {marker.category_name}
                </p>
              </div>
              <span className="rounded-full bg-[rgba(14,116,144,0.08)] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[rgb(var(--color-accent))]">
                {selectedMarker?.id === marker.id ? "선택됨" : "지도 보기"}
              </span>
            </div>

            <div className="space-y-1 text-sm leading-6 text-slate-500">
              <p>{marker.address_name || "주소 정보 없음"}</p>
              <p>{marker.phone || "연락처 정보 없음"}</p>
            </div>
          </button>
        </Panel>
      ))}
    </div>
  );
}
