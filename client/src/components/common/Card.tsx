import { useQuery } from "@tanstack/react-query";
import { Roadview } from "react-kakao-maps-sdk";
import Button from "./Button";
import EmptyState from "./EmptyState";
import Loader from "./Loader";
import Panel from "./Panel";
import { getWorkWithList } from "../../service/workWith/workWith";
import type { WorkWithItem } from "../../types/workWith";

function getRemainingMinutes(dueAt: string) {
  const dueAtTime = new Date(dueAt).getTime();

  if (Number.isNaN(dueAtTime)) {
    return 1;
  }

  return Math.max(1, Math.ceil((dueAtTime - Date.now()) / 60000));
}

function formatScheduleLabel(scheduledAt: string) {
  const date = new Date(scheduledAt);

  if (Number.isNaN(date.getTime())) {
    return "일정 조율 중";
  }

  return date.toLocaleString("ko-KR", {
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

function DetailCard({ option }: { option: WorkWithItem }) {
  const remainingMinutes = getRemainingMinutes(option.dueAt);
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
        <p>운동 시간 {formatScheduleLabel(option.scheduledAt)}</p>
        <p>현재 인원 {option.currentCount}명, 최대 {option.maxCount}명</p>
        <p>{option.note}</p>
      </div>
    </Panel>
  );
}

function formatRemainingLabel(remainingMinutes: number) {
  return remainingMinutes >= 60
    ? `${Math.ceil(remainingMinutes / 60)}시간 내 마감`
    : `${remainingMinutes}분 내 마감`;
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
  const { data: workWithList, error, isError, isLoading, refetch } = useQuery({
    queryKey: ["workWith", id, title],
    queryFn: () => getWorkWithList(id, title),
    staleTime: 1000,
    gcTime: 5000,
  });
  const matches = workWithList ?? [];
  const hasMatches = matches.length > 0;
  const openSeatCount = matches.reduce(
    (total, option) => total + Math.max(option.maxCount - option.currentCount, 0),
    0
  );
  const nearestClosingMinutes = hasMatches
    ? Math.min(...matches.map((option) => getRemainingMinutes(option.dueAt)))
    : null;
  const levelLabels = Array.from(new Set(matches.map((option) => option.level)));
  const levelSummary = levelLabels.length
    ? levelLabels.length === 1
      ? levelLabels[0]
      : `${levelLabels[0]} 외 ${levelLabels.length - 1}단계`
    : "모집 대기";

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
              선택한 장소 모집 브리프
            </p>
            <h3 className="mt-1 text-lg font-semibold tracking-[-0.03em] text-slate-900">
              {title}
            </h3>
            <p className="mt-1 text-xs leading-5 text-slate-500">
              지도를 벗어나지 않고 이 장소에서 바로 합류할 수 있는 모집 흐름만
              빠르게 확인합니다.
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

        <div className="grid grid-cols-3 gap-2">
          <div className="rounded-[20px] bg-slate-50 px-3 py-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
              열린 모집
            </p>
            <p className="mt-2 text-sm font-semibold tracking-[-0.02em] text-slate-900">
              {isLoading ? "정리 중" : hasMatches ? `${matches.length}건` : "없음"}
            </p>
          </div>

          <div className="rounded-[20px] bg-slate-50 px-3 py-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
              남은 자리
            </p>
            <p className="mt-2 text-sm font-semibold tracking-[-0.02em] text-slate-900">
              {isLoading ? "확인 중" : hasMatches ? `${openSeatCount}자리` : "대기 중"}
            </p>
          </div>

          <div className="rounded-[20px] bg-slate-50 px-3 py-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
              빠른 마감
            </p>
            <p className="mt-2 text-sm font-semibold tracking-[-0.02em] text-slate-900">
              {isLoading
                ? "확인 중"
                : nearestClosingMinutes
                  ? formatRemainingLabel(nearestClosingMinutes)
                  : "없음"}
            </p>
          </div>
        </div>

        <Panel tone="soft" className="rounded-[22px] px-4 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
            모집 톤
          </p>
          <p className="mt-2 text-sm font-semibold tracking-[-0.02em] text-slate-900">
            {isLoading
              ? "난이도와 시간대를 정리하고 있어요"
              : `${levelSummary} 모집을 확인할 수 있어요`}
          </p>
          <p className="mt-1 text-xs leading-5 text-slate-500">
            {hasMatches
              ? "카드별 운동 시간과 남은 인원을 보고 바로 합류 가능성을 비교해보세요."
              : "다른 장소를 눌러 주변 운동 메이트 모집을 더 넓게 비교해볼 수 있어요."}
          </p>
        </Panel>

        <div className="space-y-2">
          {isLoading ? (
            <Loader
              surface="panel"
              label="주변 모집을 정리하고 있어요"
              description="선택한 장소 근처에서 바로 합류할 수 있는 운동 메이트를 불러오는 중입니다."
            />
          ) : isError ? (
            <EmptyState
              eyebrow="모집 불러오기 실패"
              title="이 장소 모집 정보를 아직 가져오지 못했어요"
              description={
                error instanceof Error
                  ? error.message
                  : "잠시 후 다시 시도해 주세요."
              }
              action={
                <Button type="button" onClick={() => void refetch()}>
                  다시 시도
                </Button>
              }
              className="px-4 py-4"
            />
          ) : hasMatches ? (
            workWithList?.map((workWith) => (
              <DetailCard key={workWith.id} option={workWith}></DetailCard>
            ))
          ) : (
            <EmptyState
              eyebrow="주변 모집 없음"
              title="지금 바로 합류할 모집이 아직 없어요"
              description="다른 공원이나 체육관을 눌러 같은 시간대에 열린 후보를 더 비교해보세요."
              className="px-4 py-4"
            />
          )}
        </div>

        {hasMatches ? (
          <Button type="button" size="md">
            이 장소로 같이 운동 요청하기
          </Button>
        ) : null}
      </div>
    </div>
  );
}
