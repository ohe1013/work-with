import { fireEvent, render, screen } from "@testing-library/react";
import { RecoilRoot } from "recoil";
import SearchList from "./SearchList";
import {
  MapDiscoveryAtom,
  MapDiscoveryState,
  MapMarkersAtom,
} from "@/recoil/map";

function renderSearchList({
  discoveryState,
  markers = [],
  onRetrySearch,
  onRefineSearch,
}: {
  discoveryState: MapDiscoveryState;
  markers?: Array<{
    id: string;
    content: string;
    position: { lat: number; lng: number };
    place_url: string;
    category_name: string;
    phone: string;
    address_name: string;
  }>;
  onRetrySearch?: () => void;
  onRefineSearch?: () => void;
}) {
  render(
    <RecoilRoot
      initializeState={({ set }) => {
        set(MapDiscoveryAtom, discoveryState);
        set(MapMarkersAtom, markers);
      }}
    >
      <SearchList
        showHeader={false}
        onRetrySearch={onRetrySearch}
        onRefineSearch={onRefineSearch}
      />
    </RecoilRoot>
  );
}

describe("SearchList", () => {
  test("renders the idle discovery prompt before any search", () => {
    renderSearchList({
      discoveryState: {
        phase: "idle",
        keyword: "",
        resultCount: 0,
      },
    });

    expect(
      screen.getByText("먼저 어디서 만날지부터 정해볼까요?")
    ).toBeInTheDocument();
  });

  test("lets the user start from the search field before any search", () => {
    const onRefineSearch = jest.fn();

    renderSearchList({
      discoveryState: {
        phase: "idle",
        keyword: "",
        resultCount: 0,
      },
      onRefineSearch,
    });

    fireEvent.click(screen.getByRole("button", { name: "검색부터 시작하기" }));

    expect(onRefineSearch).toHaveBeenCalledTimes(1);
  });

  test("renders a loading panel while map discovery is in progress", () => {
    renderSearchList({
      discoveryState: {
        phase: "loading",
        keyword: "잠실한강공원",
        resultCount: 0,
      },
    });

    expect(
      screen.getByText("잠실한강공원 주변 장소를 찾고 있어요")
    ).toBeInTheDocument();
  });

  test("lets the user refine an empty search result", () => {
    const onRefineSearch = jest.fn();

    renderSearchList({
      discoveryState: {
        phase: "empty",
        keyword: "잠실대교 남단",
        resultCount: 0,
      },
      onRefineSearch,
    });

    fireEvent.click(screen.getByRole("button", { name: "검색어 다듬기" }));

    expect(onRefineSearch).toHaveBeenCalledTimes(1);
  });

  test("lets the user retry after a search error", () => {
    const onRetrySearch = jest.fn();

    renderSearchList({
      discoveryState: {
        phase: "error",
        keyword: "올림픽공원",
        resultCount: 0,
        errorMessage: "검색 결과를 불러오지 못했어요.",
      },
      onRetrySearch,
    });

    fireEvent.click(
      screen.getByRole("button", { name: "같은 조건으로 다시 시도" })
    );

    expect(onRetrySearch).toHaveBeenCalledTimes(1);
  });
});
