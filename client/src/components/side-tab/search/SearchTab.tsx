import { useRecoilValue, useSetRecoilState } from "recoil";
import {
  ChangeEvent,
  useState,
  useRef,
  FormEventHandler,
  Suspense,
  useDeferredValue,
} from "react";
import SearchList from "./SearchList";
import Pagination from "../../common/Pagination";
import DynamicSvg from "../../common/DynamicSvg";
import SuggestList from "./SuggestList";
import { getSearchList } from "../../../service/search/kakaoSearch";
import { pageClickType } from "../../../types/util";
import { MapMarkersAtom, MapUserAtom } from "@/recoil/map";
import { MarkerWithId } from "@/types/map";
import Loader from "@/components/common/Loader";

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
    _pagination: kakao.maps.Pagination
  ) => {
    if (status === kakao.maps.services.Status.OK) {
      const bounds = new kakao.maps.LatLngBounds();
      const markers: MarkerWithId[] = [];

      for (const result of resultArr) {
        const _category_name = result.category_name.split(">");
        const category_name = _category_name[_category_name.length - 1].trim();
        markers.push({
          id: result.id,
          position: {
            lat: +result.y,
            lng: +result.x,
          },
          content: result.place_name,
          place_url: result.place_url,
          category_name: category_name,
          phone: result.phone,
          address_name: result.address_name,
        });
        bounds.extend(new kakao.maps.LatLng(+result.y, +result.x));
      }
      if (_pagination && typeof _pagination.nextPage === "function") {
        setPagination(_pagination);
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
  const selectSuggest = (keyword: string) => {
    setKeyword(keyword);
    getSearchList({ keyword, mapInfo, cb });
    inputRef.current?.blur();
    setIsFocused(false);
  };

  const pageClickHandler = (
    type: pageClickType,
    page?: number,
    currentPagination?: kakao.maps.Pagination
  ) => {
    switch (type) {
      case "prev": {
        if (currentPagination.hasPrevPage) currentPagination.prevPage();
        break;
      }
      case "next": {
        if (currentPagination.hasNextPage) currentPagination.nextPage();
        break;
      }
      case "current": {
        if (page) {
          currentPagination.gotoPage(page);
        }
      }
    }
  };

  const inputHandler = async (e: ChangeEvent<HTMLInputElement>) => {
    const newKeyword = e.target.value;
    setKeyword(newKeyword);
  };
  const activeSuggestList = isfocused;
  return (
    <>
      <form className={"w-full flex justify-center"} onSubmit={submitHandler}>
        <label
          htmlFor="default-search"
          className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
        >
          Search
        </label>
        <div
          className={
            "relative justify-center flex transition-all duration-200" +
            (isfocused ? " w-full" : " w-4/5")
          }
        >
          <button
            type="submit"
            className="absolute inset-y-0 left-0 flex items-center pl-3 "
          >
            <DynamicSvg iconName={"search"}></DynamicSvg>
          </button>
          <input
            type="search"
            id="default-search"
            className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            value={keyword}
            onChange={inputHandler}
            ref={inputRef}
            onFocus={() => {
              setIsFocused(true);
            }}
          />
        </div>
      </form>
      <Suspense fallback={<Loader />}>
        <SuggestList
          keyword={queryKey}
          selectSuggest={selectSuggest}
          activeSuggestList={activeSuggestList}
        ></SuggestList>
      </Suspense>
      <SearchList></SearchList>
      <Pagination
        pagination={pagination}
        pageClickHandler={(type, page) =>
          pageClickHandler(type, page, pagination)
        }
      />
    </>
  );
};
export default SearchBar;
