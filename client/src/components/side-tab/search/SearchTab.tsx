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
import Loader from "@/components/common/Loader";
import SearchField from "@/components/common/SearchField";
import { MapMarkersAtom, MapUserAtom } from "@/recoil/map";
import { MarkerWithId } from "@/types/map";
import { pageClickType } from "../../../types/util";
import { getSearchList } from "../../../service/search/kakaoSearch";
import SearchList from "./SearchList";
import SuggestList from "./SuggestList";

const SearchBar = () => {
  const [keyword, setKeyword] = useState("");
  const setMarkers = useSetRecoilState(MapMarkersAtom);
  const mapInfo = useRecoilValue(MapUserAtom);
  const [pagination, setPagination] = useState<kakao.maps.Pagination>();
  const [isfocused, setIsFocused] = useState(false);
  const queryKey = useDeferredValue(keyword);
  const inputRef = useRef<HTMLInputElement>(null);

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

      setMarkers(markers);
    }
  };

  const submitHandler: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    getSearchList({ keyword, mapInfo, cb });
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

  const activeSuggestList = isfocused;

  return (
    <div className="flex h-full max-h-[58vh] flex-col md:max-h-[calc(100vh-156px)]">
      <div className="space-y-4 px-4 pb-4 pt-4">
        <div className="space-y-1">
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

        <form className="w-full" onSubmit={submitHandler}>
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
        </form>
      </div>

      <Suspense
        fallback={<Loader className="px-4 pb-3" label="추천 검색어 준비 중" />}
      >
        <SuggestList
          keyword={queryKey}
          selectSuggest={selectSuggest}
          activeSuggestList={activeSuggestList}
        ></SuggestList>
      </Suspense>

      <div className="min-h-0 flex-1 overflow-y-auto px-3 pb-3">
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
