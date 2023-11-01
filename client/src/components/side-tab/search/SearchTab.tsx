import { useRecoilState } from "recoil";
import { MapMarkersAtom, MapUserAtom } from "../../../recoil/MapStatus";
import { ChangeEvent, FormEvent, useState, useRef } from "react";
import SearchList from "./SearchList";
import Pagination from "../../common/Pagination";
import DynamicSvg from "../../common/DynamicSvg";
import SuggestList from "./SuggestList";
import {
  getSearchList,
  getSuggestList,
} from "../../../service/search/kakaoSearch";

const SearchBar = () => {
  const [keyword, setKeyword] = useState("");
  const [markers, setMarkers] = useRecoilState(MapMarkersAtom);
  const [mapInfo] = useRecoilState(MapUserAtom);
  const [pagination, setPagination] = useState<kakao.maps.Pagination>();
  const [isfocused, setIsFocused] = useState(false);
  const [suggestList, setSuggestList] = useState([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const submitHandler = (event: FormEvent) => {
    event.preventDefault();
    getSearchList({ keyword, mapInfo, setPagination, setMarkers });
    inputRef.current?.blur();
  };

  const pageClickHandler = (
    type: "prev" | "next" | "current",
    page?: number,
    currentPagination?: kakao.maps.Pagination
  ) => {
    if (type === "prev" && currentPagination?.hasPrevPage) {
      currentPagination?.prevPage();
    } else if (type === "next" && currentPagination?.hasNextPage) {
      currentPagination?.nextPage();
    }
    if (type === "current" && page) {
      currentPagination?.gotoPage(page);
    }
  };

  const inputHandler = async (e: ChangeEvent<HTMLInputElement>) => {
    const newKeyword = e.target.value;
    setKeyword(newKeyword);
    const newSuggestList = await getSuggestList(newKeyword, 10);
    setSuggestList(newSuggestList);
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
            onBlur={() => {
              setIsFocused(false);
            }}
          />
        </div>
      </form>
      <SuggestList
        suggestList={suggestList}
        setKeyword={setKeyword}
        activeSuggestList={activeSuggestList}
      ></SuggestList>
      <SearchList markers={markers}></SearchList>
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
