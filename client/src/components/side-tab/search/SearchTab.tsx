import { useRecoilValue, useSetRecoilState } from "recoil";
import {
  ChangeEvent,
  FormEventHandler,
  Suspense,
  useDeferredValue,
  useRef,
  useState,
} from "react";
import Pagination from "../../common/Pagination";
import Button from "@/components/common/Button";
import Card from "@/components/common/Card";
import EmptyState from "@/components/common/EmptyState";
import Loader from "@/components/common/Loader";
import SearchField from "@/components/common/SearchField";
import { MapMarkersAtom, MapUserAtom } from "@/recoil/map";
import { useMarkerSelection } from "@/hooks/map/useMarkerSelection";
import { MarkerWithId } from "@/types/map";
import { pageClickType } from "../../../types/util";
import { getSearchList } from "../../../service/search/kakaoSearch";
import SearchList from "./SearchList";
import SuggestList from "./SuggestList";

const SearchBar = () => {
  const [keyword, setKeyword] = useState("");
  const markers = useRecoilValue(MapMarkersAtom);
  const setMarkers = useSetRecoilState(MapMarkersAtom);
  const mapInfo = useRecoilValue(MapUserAtom);
  const { selectedMarker, clearSelectedMarker } = useMarkerSelection();
  const [pagination, setPagination] = useState<kakao.maps.Pagination>();
  const [isFocused, setIsFocused] = useState(false);
  const queryKey = useDeferredValue(keyword);
  const inputRef = useRef<HTMLInputElement>(null);
  const activeSuggestList = isFocused;
  const normalizedKeyword = keyword.trim();
  const isSearchDisabled = normalizedKeyword.length === 0;
  const resultSummary =
    markers.length > 0 ? `${markers.length}곳 표시 중` : "검색 전";
  const selectedSummary =
    selectedMarker?.content ?? "마커를 누르면 미리보기가 열려요";
  const detailTitle = selectedMarker
    ? "선택한 장소의 모집 흐름"
    : markers.length > 0
      ? "장소를 하나 선택하면 상세가 이어집니다"
      : "검색 후 상세 흐름이 이어집니다";
  const detailDescription = selectedMarker
    ? "리스트와 지도는 같은 선택 상태를 공유합니다."
    : markers.length > 0
      ? "리스트 카드나 맵 마커를 누르면 같은 상세 패널이 여기서 열립니다."
      : "먼저 장소를 검색하면 결과 목록과 상세 패널이 함께 활성화됩니다.";

  const cb = (
    resultArr: kakao.maps.services.PlacesSearchResult,
    status: kakao.maps.services.Status,
    currentPagination: kakao.maps.Pagination
  ) => {
    if (status === kakao.maps.services.Status.OK) {
      const nextMarkers: MarkerWithId[] = [];

      for (const result of resultArr) {
        const categorySegments = result.category_name.split(">");
        const categoryName =
          categorySegments[categorySegments.length - 1].trim();

        nextMarkers.push({
          id: result.id,
          position: {
            lat: +result.y,
            lng: +result.x,
          },
          content: result.place_name,
          place_url: result.place_url,
          category_name: categoryName,
          phone: result.phone,
          address_name: result.address_name,
        });
      }

      if (typeof currentPagination.nextPage === "function") {
        setPagination(currentPagination);
      }

      clearSelectedMarker();
      setMarkers(nextMarkers);
    }
  };

  const submitHandler: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    if (normalizedKeyword.length === 0) {
      return;
    }

    getSearchList({ keyword: normalizedKeyword, mapInfo, cb });
    inputRef.current?.blur();
    setIsFocused(false);
  };

  const selectSuggest = (nextKeyword: string) => {
    setKeyword(nextKeyword);
    getSearchList({ keyword: nextKeyword, mapInfo, cb });
    inputRef.current?.blur();
    setIsFocused(false);
  };

  const pageClickHandler = (
    type: pageClickType,
    page?: number,
    currentPagination?: kakao.maps.Pagination
  ) => {
    switch (type) {
      case "prev":
        if (currentPagination?.hasPrevPage) {
          currentPagination.prevPage();
        }
        break;
      case "next":
        if (currentPagination?.hasNextPage) {
          currentPagination.nextPage();
        }
        break;
      case "current":
        if (page && currentPagination) {
          currentPagination.gotoPage(page);
        }
        break;
    }
  };

  const inputHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
  };

  return (
    <div className="flex h-full max-h-[min(56vh,520px)] flex-col md:max-h-[calc(100vh-236px)]">
      <div className="space-y-4 px-4 pb-4 pt-4 md:px-5">
        <div className="space-y-1.5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
            Search nearby
          </p>
          <h3 className="text-lg font-semibold tracking-[-0.03em] text-slate-900">
            장소를 입력하고 바로 지도에서 비교하세요
          </h3>
          <p className="text-sm leading-6 text-slate-500">
            운동 장소, 공원, 체육관 이름으로 검색한 뒤 부담 없이 조건만
            확인할 수 있습니다.
          </p>
        </div>

        <form className="w-full space-y-3" onSubmit={submitHandler}>
          <SearchField
            id="default-search"
            value={keyword}
            onChange={inputHandler}
            ref={inputRef}
            placeholder="예: 잠실한강공원, 올림픽공원"
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
              Results
            </p>
            <p className="mt-2 text-sm font-semibold tracking-[-0.02em] text-slate-900">
              {resultSummary}
            </p>
            <p className="mt-1 text-xs leading-5 text-slate-500">
              검색 결과 카드를 누르면 지도가 즉시 이동합니다.
            </p>
          </div>

          <div className="rounded-[22px] bg-slate-50 px-4 py-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
              Preview
            </p>
            <p className="mt-2 truncate text-sm font-semibold tracking-[-0.02em] text-slate-900">
              {selectedSummary}
            </p>
            <p className="mt-1 text-xs leading-5 text-slate-500">
              지도와 리스트가 같은 선택 상태를 유지합니다.
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
            description="주변 장소를 빠르게 찾을 수 있도록 자주 쓰는 검색어를 먼저 보여줍니다."
          />
        }
      >
        <SuggestList
          keyword={queryKey}
          selectSuggest={selectSuggest}
          activeSuggestList={activeSuggestList}
        ></SuggestList>
      </Suspense>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-4 md:px-5">
        <div className="space-y-4">
          <section className="space-y-3">
            <div className="flex items-end justify-between gap-3 px-1">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Detail flow
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
                eyebrow="Selection flow"
                title={detailTitle}
                description={detailDescription}
              />
            )}
          </section>

          <SearchList></SearchList>
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
