import { useRecoilValue, useSetRecoilState } from "recoil";
import EmptyState from "@/components/common/EmptyState";
import Panel from "@/components/common/Panel";
import { MarkerWithId } from "../../../types/map";
import { MapInfoAtom, MapMarkersAtom, MapUserAtom } from "@/recoil/map";

export default function SearchList() {
  const markers = useRecoilValue(MapMarkersAtom);
  const setInfo = useSetRecoilState<MarkerWithId>(MapInfoAtom);
  const setMapInfo = useSetRecoilState(MapUserAtom);

  const clickHandler = (marker: MarkerWithId) => {
    setInfo(marker);
    setMapInfo({ zoom: 3, center: { ...marker.position } });
  };

  if (markers.length === 0) {
    return (
      <EmptyState
        title="검색 결과가 아직 없어요"
        description="장소를 검색하면 주변 운동 메이트 모집과 비교할 수 있는 후보를 여기에 보여드릴게요."
      />
    );
  }

  return (
    <div className="space-y-3">
      {markers.map((marker, idx) => (
        <Panel key={marker.id + idx} tone="soft" className="overflow-hidden">
          <button
            type="button"
            onClick={() => clickHandler(marker)}
            className="flex w-full flex-col gap-2 px-4 py-4 text-left transition hover:bg-white/60"
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
                지도 보기
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
