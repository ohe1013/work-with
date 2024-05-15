import { AxiosError } from "axios";
import { fetchKakaoSuggest } from "../../api/map/kakaoSearch";
import SortBy = kakao.maps.services.SortBy;
import LatLng = kakao.maps.LatLng;
import KakaoSearch from "../../api/map/kakaoSearch/model";
import { MapUserInfo } from "@/recoil/map";

export type SuggestProps = {
  keyword: string;
  itemSize: number;
};

export type SearchProps = {
  keyword: string;
  mapInfo: MapUserInfo;
  cb: (
    data: kakao.maps.services.PlacesSearchResult,
    status: kakao.maps.services.Status,
    _pagination: kakao.maps.Pagination
  ) => void;
  // setPagination: React.Dispatch<
  //   React.SetStateAction<kakao.maps.Pagination | undefined>
  // >;
  // setMarkers: SetterOrUpdater<MarkerWithId[]>;
};

const getSuggestList = async ({
  keyword,
  itemSize,
}: SuggestProps): Promise<Array<KakaoSearch.Suggest["item"]>> => {
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

const getSearchList = ({ keyword, mapInfo, cb }: SearchProps) => {
  const ps = new kakao.maps.services.Places();
  ps.keywordSearch(keyword, cb, {
    location: new LatLng(mapInfo.center.lat, mapInfo.center.lng),
    useMapCenter: true,
    size: 10,
    sort: SortBy.DISTANCE,
  });
};

export { getSuggestList, getSearchList };
