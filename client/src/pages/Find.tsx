import {
  FormEventHandler,
  Suspense,
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Button from "@/components/common/Button";
import Card from "@/components/common/Card";
import EmptyState from "@/components/common/EmptyState";
import Loader from "@/components/common/Loader";
import Pagination from "@/components/common/Pagination";
import Panel from "@/components/common/Panel";
import SearchField from "@/components/common/SearchField";
import BaseMap from "@/components/map/BaseMap";
import SearchList from "@/components/side-tab/search/SearchList";
import SuggestList from "@/components/side-tab/search/SuggestList";
import { useMapDiscoverySearch } from "@/hooks/map/useMapDiscoverySearch";
import { useMarkerSelection } from "@/hooks/map/useMarkerSelection";

const workoutOptions = [
  { label: "전체", searchTerm: "" },
  { label: "러닝", searchTerm: "러닝" },
  { label: "헬스", searchTerm: "헬스장" },
  { label: "농구", searchTerm: "농구장" },
  { label: "클라이밍", searchTerm: "클라이밍" },
] as const;

const timeOptions = ["오늘 저녁", "출근 전", "주말 오전"] as const;
const intensityOptions = ["가볍게", "꾸준히", "강하게"] as const;

function ConditionGroup<T extends string>({
  label,
  helper,
  options,
  value,
  onChange,
}: {
  label: string;
  helper: string;
  options: readonly T[];
  value: T;
  onChange: (nextValue: T) => void;
}) {
  return (
    <div className="space-y-2.5">
      <div className="space-y-1">
        <p className="text-sm font-semibold tracking-[-0.02em] text-slate-900">
          {label}
        </p>
        <p className="text-xs leading-5 text-slate-500">{helper}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isActive = option === value;

          return (
            <button
              key={option}
              type="button"
              onClick={() => onChange(option)}
              className={[
                "inline-flex min-h-[40px] items-center justify-center rounded-full px-4 text-sm font-semibold transition",
                isActive
                  ? "bg-[rgb(var(--color-accent))] text-white shadow-[0_14px_30px_rgba(14,116,144,0.22)]"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900",
              ].join(" ")}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function buildFindSearchKeyword(areaKeyword: string, workoutLabel: string) {
  const trimmedKeyword = areaKeyword.trim();
  if (trimmedKeyword.length === 0) {
    return "";
  }

  const workoutOption = workoutOptions.find(
    (option) => option.label === workoutLabel
  );
  const searchTerm = workoutOption?.searchTerm ?? "";
  if (searchTerm.length === 0 || trimmedKeyword.includes(searchTerm)) {
    return trimmedKeyword;
  }

  return `${trimmedKeyword} ${searchTerm}`;
}

export default function Find(): JSX.Element {
  const {
    discoveryState,
    pagination,
    pageClickHandler,
    resetDiscovery,
    runSearch,
  } = useMapDiscoverySearch();
  const { selectedMarker, clearSelectedMarker } = useMarkerSelection();
  const [areaKeyword, setAreaKeyword] = useState(discoveryState.keyword);
  const [workoutType, setWorkoutType] =
    useState<(typeof workoutOptions)[number]["label"]>("전체");
  const [timeWindow, setTimeWindow] =
    useState<(typeof timeOptions)[number]>("오늘 저녁");
  const [intensity, setIntensity] =
    useState<(typeof intensityOptions)[number]>("가볍게");
  const [isFocused, setIsFocused] = useState(false);
  const detailSurfaceRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const deferredKeyword = useDeferredValue(areaKeyword);
  const activeSuggestList = isFocused;
  const composedKeyword = useMemo(
    () => buildFindSearchKeyword(areaKeyword, workoutType),
    [areaKeyword, workoutType]
  );
  const hasSearchKeyword = areaKeyword.trim().length > 0;
  const activeConditionCount = [
    workoutType !== "전체",
    timeWindow.length > 0,
    intensity.length > 0,
  ].filter(Boolean).length;
  const conditionSummary = `${workoutType}, ${timeWindow}, ${intensity}`;
  const routeSummary =
    discoveryState.phase === "results"
      ? `${discoveryState.resultCount}곳이 조건 탐색 결과로 열렸어요`
      : discoveryState.phase === "loading"
        ? `${conditionSummary} 기준으로 장소를 정리하고 있어요`
        : discoveryState.phase === "empty"
          ? `${conditionSummary} 기준으로 다시 범위를 넓혀보세요`
          : discoveryState.phase === "error"
            ? "조건 탐색 결과를 다시 불러와 주세요"
            : "지역, 운동 종류, 시간대를 먼저 정하고 지도로 비교할 수 있어요";

  useEffect(() => {
    setAreaKeyword(discoveryState.keyword);
  }, [discoveryState.keyword]);

  useEffect(() => {
    if (!selectedMarker) {
      return;
    }

    detailSurfaceRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, [selectedMarker?.id, selectedMarker]);

  const focusSearchField = () => {
    inputRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
    inputRef.current?.focus();
  };

  const runConditionSearch = (nextAreaKeyword: string) => {
    const nextKeyword = buildFindSearchKeyword(nextAreaKeyword, workoutType);
    const didStart = runSearch(nextKeyword);
    if (!didStart) {
      return;
    }

    inputRef.current?.blur();
    setIsFocused(false);
  };

  const submitHandler: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    runConditionSearch(areaKeyword);
  };

  const resetHandler = () => {
    setAreaKeyword("");
    setWorkoutType("전체");
    setTimeWindow("오늘 저녁");
    setIntensity("가볍게");
    resetDiscovery();
  };

  const selectSuggest = (nextKeyword: string) => {
    setAreaKeyword(nextKeyword);
    const didStart = runSearch(buildFindSearchKeyword(nextKeyword, workoutType));
    if (!didStart) {
      return;
    }

    inputRef.current?.blur();
    setIsFocused(false);
  };

  return (
    <section className="space-y-4">
      <Panel tone="strong" className="space-y-4 px-4 py-4 md:px-6 md:py-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-[rgba(14,116,144,0.10)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[rgb(var(--color-accent))]">
            조건 중심 탐색
          </span>
          <span className="rounded-full bg-white/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
            {activeConditionCount}개 조건 활성화
          </span>
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-semibold tracking-[-0.03em] text-slate-900 md:text-[1.9rem] md:leading-[1.2]">
            찾는 조건을 먼저 정하고 맞는 운동 장소를 골라보세요
          </h2>
          <p className="text-sm leading-6 text-slate-600 md:text-[15px]">
            홈보다 더 명시적으로 운동 종류, 시간대, 강도를 정한 뒤 지도와 결과
            목록을 함께 비교할 수 있는 탐색 화면입니다.
          </p>
        </div>

        <form className="space-y-3" onSubmit={submitHandler}>
          <SearchField
            id="find-search"
            value={areaKeyword}
            ref={inputRef}
            onChange={(event) => setAreaKeyword(event.target.value)}
            onFocus={() => setIsFocused(true)}
            placeholder="예: 성수동, 잠실한강공원, 올림픽공원"
          />

          <div className="flex flex-col gap-2 sm:flex-row">
            <Button type="submit" size="md" isDisabled={!hasSearchKeyword}>
              조건으로 찾기
            </Button>
            <Button
              type="button"
              size="md"
              variant="secondary"
              onClick={resetHandler}
            >
              조건 초기화
            </Button>
          </div>
        </form>

        <Suspense
          fallback={
            <Loader
              surface="panel"
              label="추천 지역을 정리하고 있어요"
              description="조건 탐색에 자주 쓰는 지역 검색어를 먼저 보여드립니다."
            />
          }
        >
          <SuggestList
            keyword={deferredKeyword}
            selectSuggest={selectSuggest}
            activeSuggestList={activeSuggestList}
          ></SuggestList>
        </Suspense>
      </Panel>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,420px)_minmax(0,1fr)]">
        <div className="space-y-4">
          <Panel className="space-y-5 px-4 py-4 md:px-5 md:py-5">
            <ConditionGroup
              label="운동 종류"
              helper="장소 검색어에 함께 반영돼 더 목적에 맞는 결과를 찾기 쉽게 합니다."
              options={workoutOptions.map((option) => option.label)}
              value={workoutType}
              onChange={setWorkoutType}
            />

            <ConditionGroup
              label="선호 시간대"
              helper="결과 비교 문구와 선택 브리프를 같은 시간대 기준으로 읽기 쉽게 정리합니다."
              options={timeOptions}
              value={timeWindow}
              onChange={setTimeWindow}
            />

            <ConditionGroup
              label="운동 강도"
              helper="가볍게 훑을지, 꾸준히 같이할 후보를 볼지 탐색 톤을 먼저 맞춥니다."
              options={intensityOptions}
              value={intensity}
              onChange={setIntensity}
            />
          </Panel>

          <Panel tone="soft" className="space-y-3 px-4 py-4 md:px-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                  현재 조건
                </p>
                <h3 className="mt-1 text-base font-semibold tracking-[-0.02em] text-slate-900">
                  {conditionSummary}
                </h3>
              </div>
              <span className="rounded-full bg-white/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                {composedKeyword || "지역 입력 대기"}
              </span>
            </div>
            <p className="text-sm leading-6 text-slate-500">{routeSummary}</p>
            <div className="grid grid-cols-3 gap-2">
              <div className="rounded-[20px] bg-white/72 px-3 py-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                  검색 기준
                </p>
                <p className="mt-2 text-sm font-semibold tracking-[-0.02em] text-slate-900">
                  {workoutType}
                </p>
              </div>
              <div className="rounded-[20px] bg-white/72 px-3 py-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                  시간대
                </p>
                <p className="mt-2 text-sm font-semibold tracking-[-0.02em] text-slate-900">
                  {timeWindow}
                </p>
              </div>
              <div className="rounded-[20px] bg-white/72 px-3 py-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                  탐색 톤
                </p>
                <p className="mt-2 text-sm font-semibold tracking-[-0.02em] text-slate-900">
                  {intensity}
                </p>
              </div>
            </div>
          </Panel>

          <section ref={detailSurfaceRef} className="space-y-3">
            <div className="flex items-end justify-between gap-3 px-1">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                  선택한 장소
                </p>
                <h3 className="mt-1 text-sm font-semibold tracking-[-0.02em] text-slate-900">
                  {selectedMarker
                    ? `${timeWindow} 기준으로 볼 ${selectedMarker.content} 모집 현황`
                    : "장소를 고르면 조건에 맞춰 비교할 모집 브리프가 열려요"}
                </h3>
              </div>

              {selectedMarker ? (
                <button
                  type="button"
                  onClick={clearSelectedMarker}
                  className="inline-flex min-h-[36px] items-center justify-center rounded-full bg-slate-100 px-3 text-xs font-semibold text-slate-600 transition hover:bg-slate-200 hover:text-slate-900"
                >
                  선택 해제
                </button>
              ) : null}
            </div>

            {selectedMarker ? (
              <Card
                id={selectedMarker.id}
                title={selectedMarker.content}
                position={selectedMarker.position}
                addressName={selectedMarker.address_name}
                phone={selectedMarker.phone}
                onClose={clearSelectedMarker}
                className="w-full"
              />
            ) : (
              <EmptyState
                eyebrow="조건 탐색 상세"
                title="먼저 한 곳을 골라 조건에 맞는 모집 현황을 열어보세요"
                description="찾기 화면에서는 결과 목록과 지도가 같은 선택 상태를 유지해서 장소별 후보를 더 명시적으로 비교할 수 있습니다."
                action={
                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    onClick={focusSearchField}
                  >
                    검색창으로 돌아가기
                  </Button>
                }
              />
            )}
          </section>

          <section className="space-y-3">
            <div className="flex flex-col gap-1.5 px-1 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                  조건 결과
                </p>
                <h3 className="mt-1 text-sm font-semibold tracking-[-0.02em] text-slate-900">
                  {selectedMarker
                    ? "다른 후보도 같은 조건으로 이어서 비교해보세요"
                    : "조건에 맞는 장소부터 하나 골라보세요"}
                </h3>
              </div>
              <p className="text-xs leading-5 text-slate-500">
                {selectedMarker
                  ? "현재 상세를 유지한 채 다른 장소 브리프로 바로 전환할 수 있어요."
                  : "지도 마커와 목록이 같은 결과를 가리켜서 조건 중심 비교가 쉬워집니다."}
              </p>
            </div>

            <SearchList
              onRetrySearch={() => runSearch(composedKeyword)}
              onRefineSearch={focusSearchField}
            />

            <Pagination
              pagination={pagination}
              pageClickHandler={(type, page) =>
                pageClickHandler(type, page, pagination)
              }
            />
          </section>
        </div>

        <div className="space-y-4">
          <section className="relative min-h-[420px] overflow-hidden rounded-[32px] md:min-h-[560px] xl:sticky xl:top-[104px] xl:h-[calc(100vh-132px)]">
            <BaseMap></BaseMap>
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.24),_transparent_42%)]" />
            <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-slate-950/16 via-slate-950/4 to-transparent" />
            <div className="pointer-events-none absolute left-4 right-4 top-4 md:left-6 md:right-auto md:w-[320px]">
              <Panel tone="soft" className="space-y-3 px-4 py-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-[rgba(14,116,144,0.10)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[rgb(var(--color-accent))]">
                    조건 탐색 지도
                  </span>
                  <span className="rounded-full bg-white/78 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                    {discoveryState.phase === "results"
                      ? `${discoveryState.resultCount}곳`
                      : "조건 확인"}
                  </span>
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-semibold tracking-[-0.02em] text-slate-900">
                    지도에서 조건 결과를 바로 비교하세요
                  </h3>
                  <p className="text-sm leading-6 text-slate-500">
                    {discoveryState.phase === "results"
                      ? `${conditionSummary} 기준으로 열린 장소를 지도와 목록에서 함께 보고 있습니다.`
                      : "조건을 정한 뒤 검색하면 지도와 결과 목록이 같은 흐름으로 열립니다."}
                  </p>
                </div>
              </Panel>
            </div>
          </section>
        </div>
      </div>
    </section>
  );
}
