import { AxiosError } from "axios";
import { getKakaoSuggest } from "../../api/map/kakaoSearch";
import { MarkerWithId } from "../../types/map";
import SortBy = kakao.maps.services.SortBy;
import LatLng = kakao.maps.LatLng;
import { MapUserInfo } from "../../recoil/MapStatus";
import { SetterOrUpdater } from "recoil";
const getSuggestList = async (keyword: string, itemSize: number) => {
  try {
    const kakaoSuggestRes = await getKakaoSuggest(keyword);
    const { items } = kakaoSuggestRes.data;
    return items.slice(0, itemSize);
  } catch (error) {
    if (error instanceof AxiosError) console.log("axios 에러발생", error);
    else console.log("error발생", error);
    return [];
  }
};
type searchProps = {
  keyword: string;
  mapInfo: MapUserInfo;
  setPagination: React.Dispatch<
    React.SetStateAction<kakao.maps.Pagination | undefined>
  >;
  setMarkers: SetterOrUpdater<MarkerWithId[]>;
};
const getSearchList = ({
  keyword,
  mapInfo,
  setPagination,
  setMarkers,
}: searchProps) => {
  const ps = new kakao.maps.services.Places();
  ps.keywordSearch(
    keyword,
    (data, status, _pagination) => {
      if (status === kakao.maps.services.Status.OK) {
        // 검색된 장소 위치를 기준으로 지도 범위를 재설정하기위해
        // LatLngBounds 객체에 좌표를 추가합니다
        const bounds = new kakao.maps.LatLngBounds();
        const markers: MarkerWithId[] = [];

        for (let i = 0; i < data.length; i++) {
          const _category_name = data[i].category_name.split(">");
          const category_name =
            _category_name[_category_name.length - 1].trim();
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

export { getSuggestList, getSearchList };
