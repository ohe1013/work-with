import { useRecoilState } from "recoil";
import { MapMarkersAtom } from "../../../recoil/MapStatus";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import SearchList from "./SearchList";
import { MarkerWithId } from "../../../types/map";
import Button from "../../common/Button";
import Pagination from "../../common/Pagination";

const SearchBar = () => {
  const submitHandler = (event: FormEvent) => {
    event.preventDefault();
    search();
  };
  const [keyword, setKeyword] = useState("");
  const [markers, setMarkers] = useRecoilState(MapMarkersAtom);
  const [nextPageHandler, setNextPageHandler] =
    useState<() => void | undefined>();
  const [prevPageHandler, setPrevPageHandler] =
    useState<() => void | undefined>();
  const [pagInfo, setPageInfo] = useState<{
    hasPrevPage: boolean;
    hasNextPage: boolean;
  }>({ hasPrevPage: false, hasNextPage: false });
  useEffect(() => {}, [nextPageHandler]);
  const search = () => {
    const ps = new kakao.maps.services.Places();
    ps.keywordSearch(keyword, (data, status, _pagination) => {
      if (status === kakao.maps.services.Status.OK) {
        // 검색된 장소 위치를 기준으로 지도 범위를 재설정하기위해
        // LatLngBounds 객체에 좌표를 추가합니다
        const bounds = new kakao.maps.LatLngBounds();
        const markers: MarkerWithId[] = [];

        for (let i = 0; i < data.length; i++) {
          markers.push({
            id: data[i].id,
            position: {
              lat: +data[i].y,
              lng: +data[i].x,
            },
            content: data[i].place_name,
          });
          bounds.extend(new kakao.maps.LatLng(+data[i].y, +data[i].x));
        }
        if (_pagination && typeof _pagination.nextPage === "function") {
          console.log(_pagination.nextPage);
          const prevPageBound = _pagination.prevPage.bind(_pagination);
          const nextPageBound = _pagination.nextPage.bind(_pagination);
          setPrevPageHandler(() => prevPageBound);
          setNextPageHandler(() => nextPageBound);
          setPageInfo({
            hasNextPage: _pagination.hasNextPage,
            hasPrevPage: _pagination.hasPrevPage,
          });
        }
        setMarkers(markers);
        // 검색된 장소 위치를 기준으로 지도 범위를 재설정합니다
      }
    });
  };
  const pageClickHandler = (type: "prev" | "next") => {
    if (type === "prev" && prevPageHandler) {
      prevPageHandler();
    } else if (type === "next" && nextPageHandler) {
      nextPageHandler();
    }
  };
  const inputHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
  };
  return (
    <>
      <form className={"w-full"} onSubmit={submitHandler}>
        <label
          htmlFor="default-search"
          className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
        >
          Search
        </label>
        <div className="relative">
          <button
            type="submit"
            className="absolute inset-y-0 left-0 flex items-center pl-3 "
          >
            <svg
              aria-hidden="true"
              className="w-5 h-5 text-gray-500 dark:text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              ></path>
            </svg>
          </button>
          <input
            type="search"
            id="default-search"
            className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            value={keyword}
            onChange={inputHandler}
          />
        </div>
      </form>
      <SearchList markers={markers}></SearchList>
      <Pagination
        isPrev={pagInfo.hasPrevPage}
        pageClickHandler={pageClickHandler}
        isNext={pagInfo.hasNextPage}
      />
    </>
  );
};
export default SearchBar;
