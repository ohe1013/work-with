import { useCallback, useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { MapDiscoveryAtom, MapMarkersAtom, MapUserAtom } from "@/recoil/map";
import { MarkerWithId } from "@/types/map";
import { pageClickType } from "@/types/util";
import { getSearchList } from "@/service/search/kakaoSearch";
import { useMarkerSelection } from "./useMarkerSelection";

export function useMapDiscoverySearch() {
  const discoveryState = useRecoilValue(MapDiscoveryAtom);
  const mapInfo = useRecoilValue(MapUserAtom);
  const setMarkers = useSetRecoilState(MapMarkersAtom);
  const setDiscoveryState = useSetRecoilState(MapDiscoveryAtom);
  const { clearSelectedMarker } = useMarkerSelection();
  const [pagination, setPagination] = useState<kakao.maps.Pagination>();

  const buildMarkers = useCallback(
    (resultArr: kakao.maps.services.PlacesSearchResult) => {
      const nextMarkers: MarkerWithId[] = [];

      for (const result of resultArr) {
        const categorySegments = result.category_name.split(">");
        const categoryName =
          categorySegments[categorySegments.length - 1].trim();

        nextMarkers.push({
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

      return nextMarkers;
    },
    []
  );

  const runSearch = useCallback(
    (nextKeyword: string) => {
      const trimmedKeyword = nextKeyword.trim();
      if (trimmedKeyword.length === 0) {
        return false;
      }

      clearSelectedMarker();
      setMarkers([]);
      setPagination(undefined);
      setDiscoveryState({
        phase: "loading",
        keyword: trimmedKeyword,
        resultCount: 0,
      });

      const cb = (
        resultArr: kakao.maps.services.PlacesSearchResult,
        status: kakao.maps.services.Status,
        currentPagination: kakao.maps.Pagination
      ) => {
        if (status === kakao.maps.services.Status.OK) {
          const nextMarkers = buildMarkers(resultArr);

          clearSelectedMarker();
          setPagination(currentPagination);
          setMarkers(nextMarkers);
          setDiscoveryState({
            phase: "results",
            keyword: trimmedKeyword,
            resultCount: nextMarkers.length,
          });
          return;
        }

        clearSelectedMarker();
        setMarkers([]);
        setPagination(undefined);

        if (status === kakao.maps.services.Status.ZERO_RESULT) {
          setDiscoveryState({
            phase: "empty",
            keyword: trimmedKeyword,
            resultCount: 0,
          });
          return;
        }

        setDiscoveryState({
          phase: "error",
          keyword: trimmedKeyword,
          resultCount: 0,
          errorMessage:
            "검색 결과를 불러오지 못했어요. 같은 장소로 다시 시도해 주세요.",
        });
      };

      try {
        getSearchList({ keyword: trimmedKeyword, mapInfo, cb });
      } catch (_error) {
        clearSelectedMarker();
        setMarkers([]);
        setPagination(undefined);
        setDiscoveryState({
          phase: "error",
          keyword: trimmedKeyword,
          resultCount: 0,
          errorMessage:
            "검색 준비 중 문제가 생겼어요. 잠시 후 다시 시도해 주세요.",
        });
      }

      return true;
    },
    [
      buildMarkers,
      clearSelectedMarker,
      mapInfo,
      setDiscoveryState,
      setMarkers,
    ]
  );

  const pageClickHandler = useCallback(
    (
      type: pageClickType,
      page?: number,
      currentPagination: kakao.maps.Pagination | undefined = pagination
    ) => {
      const activeKeyword = discoveryState.keyword.trim();
      if (!currentPagination || activeKeyword.length === 0) {
        return;
      }

      clearSelectedMarker();
      setMarkers([]);
      setPagination(undefined);
      setDiscoveryState({
        phase: "loading",
        keyword: activeKeyword,
        resultCount: 0,
      });

      switch (type) {
        case "prev":
          if (currentPagination.hasPrevPage) {
            currentPagination.prevPage();
          }
          break;
        case "next":
          if (currentPagination.hasNextPage) {
            currentPagination.nextPage();
          }
          break;
        case "current":
          if (page) {
            currentPagination.gotoPage(page);
          }
          break;
      }
    },
    [
      clearSelectedMarker,
      discoveryState.keyword,
      pagination,
      setDiscoveryState,
      setMarkers,
    ]
  );

  const resetDiscovery = useCallback(() => {
    clearSelectedMarker();
    setMarkers([]);
    setPagination(undefined);
    setDiscoveryState({
      phase: "idle",
      keyword: "",
      resultCount: 0,
    });
  }, [clearSelectedMarker, setDiscoveryState, setMarkers]);

  return {
    discoveryState,
    pagination,
    pageClickHandler,
    resetDiscovery,
    runSearch,
  };
}
