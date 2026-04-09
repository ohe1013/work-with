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
import PageHero from "@/components/common/PageHero";
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
  { label: "헬스", searchTerm: "헬스" },
  { label: "축구", searchTerm: "축구" },
  { label: "필라테스", searchTerm: "필라테스" },
] as const;

const timeOptions = ["오늘 저녁", "출근 전", "주말 오전"] as const;
const intensityOptions = ["가볍게", "꾸준하게", "강하게"] as const;

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
    <div className="space-y-3">
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
                "inline-flex min-h-[42px] items-center justify-center rounded-full px-4 text-sm font-semibold tracking-[-0.02em] transition",
                isActive
                  ? "bg-slate-900 text-white"
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
      ? `${discoveryState.resultCount}곳이 조건 검색 결과로 준비됐어요`
      : discoveryState.phase === "loading"
        ? `${conditionSummary} 기준으로 장소를 정리하고 있어요`
        : discoveryState.phase === "empty"
          ? `${conditionSummary} 기준에서 조금 더 넓혀볼 필요가 있어요`
          : discoveryState.phase === "error"
            ? "조건 검색 결과를 다시 불러와 주세요"
            : "지역과 운동 조건을 먼저 고르고 지도에서 비교할 수 있게 준비해 두었습니다.";

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
      <PageHero
        eyebrow="조건 기반 탐색"
        badge={`${activeConditionCount}개 조건 활성화`}
        title="찾는 조건을 먼저 좁히고 지도 위에서 바로 비교해보세요"
        description="운동 종류, 시간대, 강도를 정한 뒤 지역 키워드로 검색하면 지도와 결과 목록이 같은 흐름으로 맞물려 비교됩니다."
      >
        <form className="space-y-3" onSubmit={submitHandler}>
          <SearchField
            id="find-search"
            value={areaKeyword}
            ref={inputRef}
            onChange={(event) => setAreaKeyword(event.target.value)}
            onFocus={() => setIsFocused(true)}
            placeholder="예: 잠실 한강공원, 올림픽공원"
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

        <div className="grid gap-3 border-t border-slate-200/80 pt-3 sm:grid-cols-2">
          <div className="space-y-1">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              현재 조건
            </p>
            <p className="text-sm font-semibold tracking-[-0.02em] text-slate-900">
              {conditionSummary}
            </p>
            <p className="text-xs leading-5 text-slate-500">
              {composedKeyword || "지역 키워드를 입력해 주세요"}
            </p>
          </div>

          <div className="space-y-1">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              현재 상태
            </p>
            <p className="text-sm font-semibold tracking-[-0.02em] text-slate-900">
              {discoveryState.phase === "results"
                ? `${discoveryState.resultCount}곳 준비 완료`
                : discoveryState.phase === "loading"
                  ? "검색 진행 중"
                  : discoveryState.phase === "empty"
                    ? "조건 재조정 필요"
                    : discoveryState.phase === "error"
                      ? "재시도 필요"
                      : "검색 대기"}
            </p>
            <p className="text-xs leading-5 text-slate-500">{routeSummary}</p>
          </div>
        </div>

        <Suspense
          fallback={
            <Loader
              surface="panel"
              label="추천 지역을 정리하고 있어요"
              description="조건 탐색에서 자주 쓰는 지역 검색어를 먼저 보여드립니다."
            />
          }
        >
          <SuggestList
            keyword={deferredKeyword}
            selectSuggest={selectSuggest}
            activeSuggestList={activeSuggestList}
          />
        </Suspense>
      </PageHero>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,420px)_minmax(0,1fr)]">
        <div className="order-2 space-y-4 xl:order-1">
          <Panel className="space-y-5 px-4 py-4 md:px-5 md:py-5">
            <ConditionGroup
              label="운동 종류"
              helper="검색어와 함께 반영되어 목적에 맞는 장소를 더 빠르게 찾게 도와줍니다."
              options={workoutOptions.map((option) => option.label)}
              value={workoutType}
              onChange={setWorkoutType}
            />

            <ConditionGroup
              label="선호 시간대"
              helper="결과 비교 문구와 선택 흐름을 같은 시간대 기준으로 정리합니다."
              options={timeOptions}
              value={timeWindow}
              onChange={setTimeWindow}
            />

            <ConditionGroup
              label="운동 강도"
              helper="가볍게 움직일지, 꾸준히 달릴지 먼저 맞춘 뒤 비교할 수 있습니다."
              options={intensityOptions}
              value={intensity}
              onChange={setIntensity}
            />
          </Panel>

          <section ref={detailSurfaceRef} className="space-y-3">
            <div className="flex items-end justify-between gap-3 px-1">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                  선택한 장소
                </p>
                <h3 className="mt-1 text-sm font-semibold tracking-[-0.02em] text-slate-900">
                  {selectedMarker
                    ? `${timeWindow} 기준으로 본 ${selectedMarker.content} 모집 흐름`
                    : "장소를 고르면 조건에 맞는 모집 흐름을 바로 비교할 수 있어요"}
                </h3>
              </div>

              {selectedMarker ? (
                <button
                  type="button"
                  onClick={clearSelectedMarker}
                  className="inline-flex min-h-[38px] items-center justify-center rounded-full bg-slate-100 px-3 text-xs font-semibold text-slate-600 transition hover:bg-slate-200 hover:text-slate-900"
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
                title="먼저 한 곳을 고르고 조건에 맞는 모집 흐름을 비교해보세요"
                description="찾기 화면에서도 결과 목록과 지도는 같은 선택 상태를 공유해서, 장소별 비교 흐름이 자연스럽게 이어집니다."
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
                    : "조건에 맞는 장소부터 하나씩 골라보세요"}
                </h3>
              </div>
              <p className="text-xs leading-5 text-slate-500">
                {selectedMarker
                  ? "현재 상세 흐름을 유지한 채 다른 장소 카드로 바로 전환할 수 있습니다."
                  : "지도와 목록이 같은 결과를 가리켜서 조건 중심 비교가 더 쉬워집니다."}
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

        <div className="order-1 space-y-4 xl:order-2">
          <section className="relative min-h-[420px] overflow-hidden rounded-[30px] md:min-h-[560px] xl:sticky xl:top-[104px] xl:h-[calc(100vh-132px)]">
            <BaseMap />
            <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white/20 to-transparent" />
            <div className="pointer-events-none absolute left-4 right-4 top-4 md:left-6 md:right-auto md:w-[320px]">
              <Panel className="space-y-2 px-4 py-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                    조건 탐색 지도
                  </span>
                  <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                    {discoveryState.phase === "results"
                      ? `${discoveryState.resultCount}곳`
                      : "조건 확인"}
                  </span>
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-semibold tracking-[-0.02em] text-slate-900">
                    지도에서 조건 결과를 바로 비교해보세요
                  </h3>
                  <p className="text-sm leading-6 text-slate-500">
                    {discoveryState.phase === "results"
                      ? `${conditionSummary} 기준으로 나온 장소를 지도와 목록에서 함께 확인하고 있습니다.`
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
