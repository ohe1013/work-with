import { SetterOrUpdater } from "recoil";
import { MapUserInfo } from "../recoil/MapStatus";
import { MarkerWithId } from "./map";

export type suggestProps = {
  keyword: string;
  itemSize: number;
};

export type searchProps = {
  keyword: string;
  mapInfo: MapUserInfo;
  setPagination: React.Dispatch<
    React.SetStateAction<kakao.maps.Pagination | undefined>
  >;
  setMarkers: SetterOrUpdater<MarkerWithId[]>;
};
