import {useRecoilState} from "recoil";
import {MapMarkersAtom, MapUserAtom} from "../../../recoil/MapStatus";
import {ChangeEvent, FormEvent, useEffect, useState} from "react";
import SearchList from "./SearchList";
import {MarkerWithId} from "../../../types/map";
import Pagination from "../../common/Pagination";
import SortBy = kakao.maps.services.SortBy;
import LatLng = kakao.maps.LatLng;
import {IPagination} from "../../../types/util";
import DynamicSvg from "../../common/DynamicSvg";

const SearchBar = () => {
    const submitHandler = (event: FormEvent) => {
        event.preventDefault();
        search();
    };
    const [keyword, setKeyword] = useState("");
    const [markers, setMarkers] = useRecoilState(MapMarkersAtom);
    const [mapInfo, setMapInfo] = useRecoilState(MapUserAtom);
    const [nextPageHandler, setNextPageHandler] = useState<() => void | undefined>();
    const [prevPageHandler, setPrevPageHandler] = useState<() => void | undefined>();
    const [goPageHandler, setGoPageHandler] = useState<(val:number) => void | undefined>();
    const [pageInfo, setPageInfo] = useState<IPagination>({ firstPage:1,lastPage:1,currentPage:1, hasPrevPage: false, hasNextPage: false });
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
                    const prevPageBound = _pagination.prevPage.bind(_pagination);
                    const nextPageBound = _pagination.nextPage.bind(_pagination);

                    setPrevPageHandler(() => prevPageBound);
                    setNextPageHandler(() => nextPageBound);
                    setGoPageHandler ( (page:number) =>_pagination.gotoPage(page))
                    console.log(_pagination.gotoPage)
                    setPageInfo({
                        firstPage:1,
                        lastPage:_pagination.last,
                        currentPage:_pagination.current,
                        hasNextPage: _pagination.hasNextPage,
                        hasPrevPage: _pagination.hasPrevPage,

                    });
                }
                setMarkers(markers);
                // 검색된 장소 위치를 기준으로 지도 범위를 재설정합니다
            }
        },{location: new LatLng(mapInfo.center.lat,mapInfo.center.lng),useMapCenter:true,size:10,sort:SortBy.DISTANCE});
    };
    const pageClickHandler = (type: "prev" | "next" |"current",page?: number) => {
        if (type === "prev" && prevPageHandler) {
            prevPageHandler();
        } else if (type === "next" && nextPageHandler) {
            nextPageHandler();
        }
            console.log(goPageHandler)
        if ( type === 'current' && goPageHandler && page ) {
            goPageHandler(page)
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
                    ><DynamicSvg iconName={"search"}></DynamicSvg>
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
            <Pagination pageInfo={pageInfo} pageClickHandler={pageClickHandler} />
        </>
    );
};
export default SearchBar;
