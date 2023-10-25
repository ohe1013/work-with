import { useRecoilState } from "recoil";
import { MapMarkersAtom, MapUserAtom } from "../../../recoil/MapStatus";
import { ChangeEvent, FormEvent, useState, useRef } from "react";
import SearchList from "./SearchList";
import { MarkerWithId } from "../../../types/map";
import Pagination from "../../common/Pagination";
import SortBy = kakao.maps.services.SortBy;
import LatLng = kakao.maps.LatLng;
import DynamicSvg from "../../common/DynamicSvg";
import { getKakaoSuggest } from "../../../api/map/kakaoSearch";

const SearchBar = () => {
    const submitHandler = (event: FormEvent) => {
        event.preventDefault();
        search();
    };
    const keyword = useRef("");
    const [markers, setMarkers] = useRecoilState(MapMarkersAtom);
    const [mapInfo] = useRecoilState(MapUserAtom);
    const [pagination, setPagination] = useState<kakao.maps.Pagination>();
    const [isfocused, setIsFocused] = useState(false);

    const search = () => {
        const ps = new kakao.maps.services.Places();
        ps.keywordSearch(
            keyword.current,
            (data, status, _pagination) => {
                if (status === kakao.maps.services.Status.OK) {
                    // 검색된 장소 위치를 기준으로 지도 범위를 재설정하기위해
                    // LatLngBounds 객체에 좌표를 추가합니다
                    const bounds = new kakao.maps.LatLngBounds();
                    const markers: MarkerWithId[] = [];

                    for (let i = 0; i < data.length; i++) {
                        const _category_name = data[i].category_name.split(">");
                        const category_name = _category_name[_category_name.length - 1].trim();
                        markers.push({
                            id: data[i].id,
                            position: {
                                lat: +data[i].y,
                                lng: +data[i].x,
                            },
                            content: data[i].place_name,
                            place_url: data[i].place_url,
                            category_name: category_name,
                            phone: data[i].phone,
                            address_name: data[i].address_name,
                        });
                        bounds.extend(new kakao.maps.LatLng(+data[i].y, +data[i].x));
                    }
                    if (_pagination && typeof _pagination.nextPage === "function") {
                        setPagination(_pagination);
                    }
                    setMarkers(markers);
                    // 검색된 장소 위치를 기준으로 지도 범위를 재설정합니다
                }
            },
            {
                location: new LatLng(mapInfo.center.lat, mapInfo.center.lng),
                useMapCenter: true,
                size: 10,
                sort: SortBy.DISTANCE,
            }
        );
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
    const inputHandler = (e: ChangeEvent<HTMLInputElement>) => {
        keyword.current = e.target.value;
        getKakaoSuggest(keyword.current).then((res) => {
            console.log(res);
        });
    };
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
                        onChange={inputHandler}
                        onFocus={() => {
                            setIsFocused(true);
                        }}
                        onBlur={() => {
                            setIsFocused(false);
                        }}
                    />
                </div>
            </form>
            <SearchList markers={markers}></SearchList>
            <Pagination
                pagination={pagination}
                pageClickHandler={(type, page) => pageClickHandler(type, page, pagination)}
            />
        </>
    );
};
export default SearchBar;
