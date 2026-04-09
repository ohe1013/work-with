import { useRecoilValue } from "recoil";
import Button from "@/components/common/Button";
import EmptyState from "@/components/common/EmptyState";
import Loader from "@/components/common/Loader";
import Panel from "@/components/common/Panel";
import { MapDiscoveryAtom, MapMarkersAtom } from "@/recoil/map";
import { useMarkerSelection } from "@/hooks/map/useMarkerSelection";

export default function SearchList({
  showHeader = true,
  onRetrySearch,
  onRefineSearch,
}: {
  showHeader?: boolean;
  onRetrySearch?: () => void;
  onRefineSearch?: () => void;
}) {
  const markers = useRecoilValue(MapMarkersAtom);
  const discoveryState = useRecoilValue(MapDiscoveryAtom);
  const { selectedMarker, focusMarker } = useMarkerSelection();

  if (discoveryState.phase === "loading") {
    return (
      <Loader
        surface="panel"
        label={
          discoveryState.keyword
            ? `${discoveryState.keyword} 주변 장소를 찾고 있어요`
            : "주변 장소를 찾고 있어요"
        }
        description="결과가 준비되면 지도 마커와 비교 카드가 함께 업데이트됩니다."
      />
    );
  }

  if (discoveryState.phase === "error") {
    return (
      <EmptyState
        eyebrow="탐색 오류"
        title="검색 결과를 불러오지 못했어요"
        description={
          discoveryState.errorMessage ??
          "잠시 후 다시 시도하거나, 검색어를 조금 넓혀 다시 열어보세요."
        }
        action={
          onRetrySearch || onRefineSearch ? (
            <div className="flex flex-col gap-2 sm:flex-row">
              {onRetrySearch ? (
                <Button type="button" size="sm" onClick={onRetrySearch}>
                  같은 조건으로 다시 시도
                </Button>
              ) : null}
              {onRefineSearch ? (
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  onClick={onRefineSearch}
                >
                  검색어 다시 고르기
                </Button>
              ) : null}
            </div>
          ) : undefined
        }
      />
    );
  }

  if (discoveryState.phase === "empty") {
    return (
      <EmptyState
        eyebrow="주변 결과 없음"
        title={
          discoveryState.keyword
            ? `${discoveryState.keyword} 주변에서는 바로 비교할 장소가 아직 없어요`
            : "조건에 맞는 장소가 아직 없어요"
        }
        description="동네 이름이나 대표 시설명처럼 조금 더 큰 범위로 바꾸면 결과가 더 부드럽게 열릴 수 있어요."
        action={
          onRefineSearch ? (
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={onRefineSearch}
            >
              검색어 다듬기
            </Button>
          ) : undefined
        }
      />
    );
  }

  if (markers.length === 0) {
    return (
      <EmptyState
        eyebrow="탐색 시작"
        title="먼저 어디서 만날지부터 정해볼까요?"
        description="공원, 체육관, 동네 이름처럼 크게 입력해도 지도와 결과 목록이 함께 열립니다."
        action={
          onRefineSearch ? (
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={onRefineSearch}
            >
              검색부터 시작하기
            </Button>
          ) : undefined
        }
      />
    );
  }

  return (
    <div className="space-y-3">
      {showHeader ? (
        <div className="flex flex-col gap-1.5 px-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              비교 후보
            </p>
            <h3 className="mt-1 text-sm font-semibold tracking-[-0.02em] text-slate-900">
              {markers.length}곳을 바로 비교할 수 있어요
            </h3>
          </div>
          <p className="text-xs leading-5 text-slate-500">
            카드나 마커를 누르면 같은 상세가 바로 열립니다.
          </p>
        </div>
      ) : null}

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
                {selectedMarker?.id === marker.id ? "선택됨" : "모집 보기"}
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
