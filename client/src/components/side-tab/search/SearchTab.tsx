import { useRecoilValue, useResetRecoilState, useSetRecoilState } from "recoil";
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
import Loader from "@/components/common/Loader";
import SearchField from "@/components/common/SearchField";
import { MapInfoAtom, MapMarkersAtom, MapUserAtom } from "@/recoil/map";
import { MarkerWithId } from "@/types/map";
import { pageClickType } from "../../../types/util";
import { getSearchList } from "../../../service/search/kakaoSearch";
import SearchList from "./SearchList";
import SuggestList from "./SuggestList";

const SearchBar = () => {
  const [keyword, setKeyword] = useState("");
  const markers = useRecoilValue(MapMarkersAtom);
  const selectedMarker = useRecoilValue(MapInfoAtom);
  const setMarkers = useSetRecoilState(MapMarkersAtom);
  const resetSelectedMarker = useResetRecoilState(MapInfoAtom);
  const mapInfo = useRecoilValue(MapUserAtom);
  const [pagination, setPagination] = useState<kakao.maps.Pagination>();
  const [isfocused, setIsFocused] = useState(false);
  const queryKey = useDeferredValue(keyword);
  const inputRef = useRef<HTMLInputElement>(null);
  const activeSuggestList = isfocused;
  const normalizedKeyword = keyword.trim();
  const isSearchDisabled = normalizedKeyword.length === 0;
  const resultSummary =
    markers.length > 0 ? `${markers.length}곳 표시 중` : "검색 전";
  const selectedSummary = selectedMarker?.content ?? "마커를 누르면 미리보기가 열려요";

  const cb = (
    resultArr: kakao.maps.services.PlacesSearchResult,
    status: kakao.maps.services.Status,
    currentPagination: kakao.maps.Pagination
  ) => {
    if (status === kakao.maps.services.Status.OK) {
      const markers: MarkerWithId[] = [];

      for (const result of resultArr) {
        const categorySegments = result.category_name.split(">");
        const categoryName =
          categorySegments[categorySegments.length - 1].trim();

        markers.push({
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

      resetSelectedMarker();
      setMarkers(markers);
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
    const newKeyword = e.target.value;
    setKeyword(newKeyword);
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
              지도 위 모집 미리보기와 리스트 선택 상태를 맞춰둡니다.
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
        <SearchList></SearchList>
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
