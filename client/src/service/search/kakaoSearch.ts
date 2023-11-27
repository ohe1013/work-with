import { AxiosError } from "axios";
import { fetchKakaoSuggest } from "../../api/map/kakaoSearch";
import { MarkerWithId } from "../../types/map";
import SortBy = kakao.maps.services.SortBy;
import LatLng = kakao.maps.LatLng;
import KakaoSearch from "../../api/map/kakaoSearch/model";
import { SetterOrUpdater } from "recoil";
import { MapUserInfo } from "../../recoil/MapStatus";

export type SuggestProps = {
    keyword: string;
    itemSize: number;
};

export type SearchProps = {
    keyword: string;
    mapInfo: MapUserInfo;
    setPagination: React.Dispatch<React.SetStateAction<kakao.maps.Pagination | undefined>>;
    setMarkers: SetterOrUpdater<MarkerWithId[]>;
};

const getSuggestList = async ({
    keyword,
    itemSize,
}: SuggestProps): Promise<Array<KakaoSearch.Suggest>> => {
    const trimKeyword = keyword.trim();
    try {
        if (!trimKeyword.length) return [];
        const kakaoSuggestRes = await fetchKakaoSuggest(trimKeyword);
        const { items } = kakaoSuggestRes.data;
        return items.slice(0, itemSize);
    } catch (error) {
        if (error instanceof AxiosError) console.log("axios 에러발생", error);
        else console.log("error발생", error);
        return [];
    }
};

const getSearchList = ({ keyword, mapInfo, setPagination, setMarkers }: SearchProps) => {
    const ps = new kakao.maps.services.Places();
    ps.keywordSearch(
        keyword,
        (data, status, _pagination) => {
            if (status === kakao.maps.services.Status.OK) {
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

export { getSuggestList, getSearchList };
