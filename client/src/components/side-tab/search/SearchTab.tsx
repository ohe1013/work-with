import { useRecoilValue } from "recoil";
import {
  ChangeEvent,
  FormEventHandler,
  Suspense,
  useDeferredValue,
  useEffect,
  useRef,
  useState,
} from "react";
import Pagination from "../../common/Pagination";
import Button from "@/components/common/Button";
import Card from "@/components/common/Card";
import EmptyState from "@/components/common/EmptyState";
import Loader from "@/components/common/Loader";
import SearchField from "@/components/common/SearchField";
import { MapMarkersAtom } from "@/recoil/map";
import { useMapDiscoverySearch } from "@/hooks/map/useMapDiscoverySearch";
import { useMarkerSelection } from "@/hooks/map/useMarkerSelection";
import SearchList from "./SearchList";
import SuggestList from "./SuggestList";

const SearchBar = () => {
  const [keyword, setKeyword] = useState("");
  const markers = useRecoilValue(MapMarkersAtom);
  const {
    discoveryState,
    pageClickHandler,
    pagination,
    runSearch: executeSearch,
  } = useMapDiscoverySearch();
  const { selectedMarker, clearSelectedMarker } = useMarkerSelection();
  const [isFocused, setIsFocused] = useState(false);
  const queryKey = useDeferredValue(keyword);
  const inputRef = useRef<HTMLInputElement>(null);
  const detailSurfaceRef = useRef<HTMLDivElement>(null);
  const activeSuggestList = isFocused;
  const normalizedKeyword = keyword.trim();
  const isSearchDisabled = normalizedKeyword.length === 0;
  const hasSelection = Boolean(selectedMarker);
  const resultSummary =
    discoveryState.phase === "loading"
      ? "검색 중"
      : discoveryState.phase === "empty"
        ? "결과 없음"
        : discoveryState.phase === "error"
          ? "다시 시도 필요"
          : markers.length > 0
            ? `${markers.length}곳 표시 중`
            : "검색 대기";
  const selectedSummary =
    selectedMarker?.content ?? "장소를 고르면 모집 흐름이 여기서 열려요";
  const detailTitle = selectedMarker
    ? "선택한 장소의 모집 흐름"
    : markers.length > 0
      ? "장소를 하나 고르면 모집 흐름이 바로 열려요"
      : "검색 후 선택한 장소의 모집 흐름이 이어집니다";
  const detailDescription = selectedMarker
    ? "목록과 지도는 같은 선택 상태를 공유해서 비교 흐름이 끊기지 않습니다."
    : markers.length > 0
      ? "목록 카드나 지도 마커를 누르면 같은 장소 브리프가 여기에서 열립니다."
      : "먼저 장소를 검색하면 결과 목록과 장소별 모집 흐름이 함께 활성화됩니다.";

  useEffect(() => {
    if (!hasSelection) {
      return;
    }

    detailSurfaceRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, [hasSelection, selectedMarker?.id]);

  const focusSearchField = () => {
    inputRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
    inputRef.current?.focus();
  };

  const runSearch = (nextKeyword: string) => {
    const didStart = executeSearch(nextKeyword);
    if (!didStart) {
      return;
    }

    inputRef.current?.blur();
    setIsFocused(false);
  };

  const submitHandler: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    runSearch(normalizedKeyword);
  };

  const selectSuggest = (nextKeyword: string) => {
    setKeyword(nextKeyword);
    runSearch(nextKeyword);
  };

  const inputHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
  };

  return (
    <div
      className={[
        "flex h-full flex-col md:max-h-[calc(100vh-236px)]",
        hasSelection
          ? "max-h-[calc(100vh-188px)]"
          : "max-h-[min(58vh,560px)]",
      ].join(" ")}
    >
      <div className="space-y-4 px-4 pb-4 pt-4 md:px-5">
        <div className="space-y-1.5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
            지도 기반 탐색
          </p>
          <h3 className="text-lg font-semibold tracking-[-0.03em] text-slate-900">
            운동 장소를 찾고 바로 모집 흐름을 비교해보세요
          </h3>
          <p className="text-sm leading-6 text-slate-500">
            공원이나 체육관 이름으로 검색하면, 같은 화면에서 모집 여부와 여유 자리까지 가볍게 확인할 수 있습니다.
          </p>
        </div>

        <form className="w-full space-y-3" onSubmit={submitHandler}>
          <SearchField
            id="default-search"
            value={keyword}
            onChange={inputHandler}
            ref={inputRef}
            placeholder="예: 여의도공원, 올림픽공원"
            onFocus={() => {
              setIsFocused(true);
            }}
          />

          <Button type="submit" size="md" isDisabled={isSearchDisabled}>
            지도에서 보기
          </Button>
        </form>

        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-[22px] bg-slate-50 px-4 py-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
              탐색 상태
            </p>
            <p className="mt-2 text-sm font-semibold tracking-[-0.02em] text-slate-900">
              {resultSummary}
            </p>
            <p className="mt-1 text-xs leading-5 text-slate-500">
              검색 결과 카드를 누르면 지도와 상세 흐름이 같은 선택으로 이어집니다.
            </p>
          </div>

          <div className="rounded-[22px] bg-slate-50 px-4 py-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
              현재 선택
            </p>
            <p className="mt-2 truncate text-sm font-semibold tracking-[-0.02em] text-slate-900">
              {selectedSummary}
            </p>
            <p className="mt-1 text-xs leading-5 text-slate-500">
              지도와 리스트가 같은 장소를 가리키도록 맞춰 두었습니다.
            </p>
          </div>
        </div>
      </div>

      <Suspense
        fallback={
          <Loader
            className="px-4 pb-3 md:px-5"
            surface="panel"
            label="추천 검색어를 정리하고 있어요"
            description="주변 장소를 더 빨리 찾을 수 있도록 자주 쓰는 검색어를 먼저 보여드립니다."
          />
        }
      >
        <SuggestList
          keyword={queryKey}
          selectSuggest={selectSuggest}
          activeSuggestList={activeSuggestList}
        />
      </Suspense>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-4 md:px-5">
        <div className="space-y-4">
          <section
            ref={detailSurfaceRef}
            className={[
              "space-y-3",
              hasSelection
                ? "sticky top-0 z-10 rounded-[28px] bg-[rgba(248,250,252,0.96)] pb-3 pt-1 backdrop-blur-sm"
                : "",
            ].join(" ")}
          >
            <div className="flex items-end justify-between gap-3 px-1">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                  선택한 장소
                </p>
                <h3 className="mt-1 text-sm font-semibold tracking-[-0.02em] text-slate-900">
                  {detailTitle}
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
                eyebrow="선택 대기"
                title={detailTitle}
                description={detailDescription}
              />
            )}
          </section>

          <section className="space-y-3">
            <div className="flex flex-col gap-1.5 px-1 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                  비교 후보
                </p>
                <h3 className="mt-1 text-sm font-semibold tracking-[-0.02em] text-slate-900">
                  {hasSelection
                    ? "다른 후보를 이어서 비교해보세요"
                    : "먼저 한 곳을 고르고 모집 흐름을 이어보세요"}
                </h3>
              </div>
              <p className="text-xs leading-5 text-slate-500">
                {hasSelection
                  ? "현재 상세 흐름을 닫지 않고 다른 장소의 모집 브리프로 빠르게 전환할 수 있어요."
                  : discoveryState.phase === "loading"
                    ? "검색 결과를 불러오는 동안 지도와 목록을 함께 정리합니다."
                    : "카드와 지도 마커를 누르면 선택한 장소 브리프가 상단에 고정됩니다."}
              </p>
            </div>

            <SearchList
              showHeader={false}
              onRetrySearch={() => runSearch(discoveryState.keyword)}
              onRefineSearch={focusSearchField}
            />
          </section>
        </div>
      </div>

      <Pagination
        pagination={pagination}
        pageClickHandler={(type, page) =>
          pageClickHandler(type, page, pagination)
        }
      />
    </div>
  );
};

export default SearchBar;
