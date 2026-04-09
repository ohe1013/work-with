import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Roadview } from "react-kakao-maps-sdk";
import WorkWith from "../../api/map/workWith/model";
import { getWorkWithList } from "../../service/workWith/workWith";

function DetailCard({ option }: { option: WorkWith.LocItem["item"] }) {
  const [isShow, setIsShow] = useState(true);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setIsShow(false);
    }, option.dueTime);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [option.dueTime]);

  const endTime = new Date().getTime() + option.dueTime;

  if (!isShow) {
    return null;
  }

  return (
    <div className="rounded-[22px] bg-slate-50 px-4 py-3">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-semibold tracking-[-0.02em] text-slate-900">
          {option.title}
        </p>
        <span className="rounded-full bg-[rgba(14,116,144,0.08)] px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[rgb(var(--color-accent))]">
          {option.level}
        </span>
      </div>
      <div className="mt-2 space-y-1 text-xs leading-5 text-slate-500">
        <p>
          인원 {option.currentCount}/{option.maxCount}
        </p>
        <p>운동 시간 {option.workTime}</p>
        <p>마감 {new Date(endTime).toLocaleTimeString()}</p>
      </div>
    </div>
  );
}

export default function Card({
  id,
  title,
  position,
}: {
  id: string;
  title: string;
  position: { lat: number; lng: number };
}) {
  const { data: workWithList, isLoading } = useQuery({
    queryKey: ["workWith"],
    queryFn: () => getWorkWithList(id),
    staleTime: 1000,
    gcTime: 5000,
  });

  return (
    <div className="w-[320px] rounded-[28px] border border-white/80 bg-white/95 p-3 shadow-[0_26px_60px_rgba(15,23,42,0.20)] backdrop-blur-xl">
      <div className="overflow-hidden rounded-[22px]">
        <Roadview
          style={{ width: "100%", height: "148px" }}
          position={{ lat: position.lat, lng: position.lng, radius: 50 }}
        ></Roadview>
      </div>

      <div className="space-y-3 p-2 pt-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
            Match preview
          </p>
          <h3 className="mt-1 text-lg font-semibold tracking-[-0.03em] text-slate-900">
            {title}
          </h3>
        </div>

        <div className="space-y-2">
          {!isLoading ? (
            workWithList?.map((workWith) => (
              <DetailCard key={workWith.id} option={workWith}></DetailCard>
            ))
          ) : (
            <p className="text-sm text-slate-500">
              운동 메이트 모집을 불러오는 중입니다.
            </p>
          )}
        </div>

        <button
          type="button"
          className="inline-flex min-h-[44px] w-full items-center justify-center rounded-full bg-[rgb(var(--color-accent))] px-4 text-sm font-semibold text-white transition hover:bg-[rgb(var(--color-accent-strong))]"
        >
          같이 운동 요청하기
        </button>
      </div>
    </div>
  );
}
