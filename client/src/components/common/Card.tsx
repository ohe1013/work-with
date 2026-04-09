import { useQuery } from "@tanstack/react-query";
import { Roadview } from "react-kakao-maps-sdk";
import Button from "./Button";
import EmptyState from "./EmptyState";
import Loader from "./Loader";
import Panel from "./Panel";
import WorkWith from "../../api/map/workWith/model";
import { getWorkWithList } from "../../service/workWith/workWith";

function DetailCard({ option }: { option: WorkWith.LocItem["item"] }) {
  const remainingMinutes = Math.max(1, Math.ceil(option.dueTime / 60000));
  const remainingLabel =
    remainingMinutes >= 60
      ? `${Math.ceil(remainingMinutes / 60)}시간 남음`
      : `${remainingMinutes}분 남음`;

  return (
    <Panel tone="soft" className="rounded-[22px] px-4 py-3">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-sm font-semibold tracking-[-0.02em] text-slate-900">
            {option.title}
          </p>
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
            {remainingLabel}
          </p>
        </div>

        <div className="flex flex-col items-end gap-1">
          <span className="rounded-full bg-[rgba(14,116,144,0.08)] px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[rgb(var(--color-accent))]">
            {option.level}
          </span>
          <span className="rounded-full bg-slate-100 px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
            {option.currentCount}/{option.maxCount}명
          </span>
        </div>
      </div>

      <div className="mt-3 space-y-1 text-xs leading-5 text-slate-500">
        <p>운동 시간 {option.workTime}</p>
        <p>현재 인원 {option.currentCount}명, 최대 {option.maxCount}명</p>
      </div>
    </Panel>
  );
}

export default function Card({
  id,
  title,
  position,
  addressName,
  phone,
  onClose,
  className = "",
}: {
  id: string;
  title: string;
  position: { lat: number; lng: number };
  addressName?: string;
  phone?: string;
  onClose?: () => void;
  className?: string;
}) {
  const { data: workWithList, isLoading } = useQuery({
    queryKey: ["workWith", id],
    queryFn: () => getWorkWithList(id),
    staleTime: 1000,
    gcTime: 5000,
  });
  const hasMatches = (workWithList?.length ?? 0) > 0;

  return (
    <div
      className={[
        "w-[320px] rounded-[28px] border border-white/80 bg-white/95 p-3 shadow-[0_26px_60px_rgba(15,23,42,0.20)] backdrop-blur-xl",
        className,
      ].join(" ")}
    >
      <div className="overflow-hidden rounded-[22px]">
        <Roadview
          style={{ width: "100%", height: "148px" }}
          position={{ lat: position.lat, lng: position.lng, radius: 50 }}
        ></Roadview>
      </div>

      <div className="space-y-3 p-2 pt-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              Match preview
            </p>
            <h3 className="mt-1 text-lg font-semibold tracking-[-0.03em] text-slate-900">
              {title}
            </h3>
            <p className="mt-1 text-xs leading-5 text-slate-500">
              지도를 벗어나지 않고 현재 열려 있는 모집 상태만 빠르게 비교합니다.
            </p>
            {addressName ? (
              <p className="mt-2 text-xs leading-5 text-slate-500">
                {addressName}
              </p>
            ) : null}
            {phone ? (
              <p className="mt-1 text-xs leading-5 text-slate-500">{phone}</p>
            ) : null}
          </div>

          {onClose ? (
            <button
              type="button"
              onClick={onClose}
              aria-label="상세 미리보기 닫기"
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-lg font-semibold text-slate-500 transition hover:bg-slate-200 hover:text-slate-900"
            >
              ×
            </button>
          ) : null}
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-[20px] bg-slate-50 px-3 py-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
              Open matches
            </p>
            <p className="mt-2 text-sm font-semibold tracking-[-0.02em] text-slate-900">
              {hasMatches ? `${workWithList?.length}건 확인 가능` : "대기 중"}
            </p>
          </div>

          <div className="rounded-[20px] bg-slate-50 px-3 py-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
              Map focus
            </p>
            <p className="mt-2 text-sm font-semibold tracking-[-0.02em] text-slate-900">
              {position.lat.toFixed(3)}, {position.lng.toFixed(3)}
            </p>
          </div>
        </div>

        <div className="space-y-2">
          {isLoading ? (
            <Loader
              surface="panel"
              label="주변 모집을 정리하고 있어요"
              description="선택한 장소 근처에서 바로 합류할 수 있는 운동 메이트를 불러오는 중입니다."
            />
          ) : hasMatches ? (
            workWithList?.map((workWith) => (
              <DetailCard key={workWith.id} option={workWith}></DetailCard>
            ))
          ) : (
            <EmptyState
              eyebrow="No open matches"
              title="지금 바로 합류할 모집이 아직 없어요"
              description="다른 공원이나 체육관을 눌러 주변 후보를 더 비교해보세요."
              className="px-4 py-4"
            />
          )}
        </div>

        {hasMatches ? (
          <Button type="button" size="md">
            같이 운동 요청하기
          </Button>
        ) : null}
      </div>
    </div>
  );
}
