import "@testing-library/jest-dom";
import { server } from "./src/mocks/server";

Object.defineProperty(globalThis, "kakao", {
  configurable: true,
  writable: true,
  value: {
    maps: {
      services: {
        SortBy: {
          DISTANCE: "DISTANCE",
        },
        Status: {
          OK: "OK",
        },
        Places: class {
          keywordSearch = jest.fn();
        },
      },
      LatLng: class {
        constructor(
          public lat: number,
          public lng: number
        ) {}
      },
      LatLngBounds: class {
        extend = jest.fn();
      },
    },
  },
});

jest.mock("react-kakao-maps-sdk", () => {
  const React = require("react");

  return {
    Map: ({ children }: { children?: React.ReactNode }) =>
      React.createElement("div", { "data-testid": "kakao-map" }, children),
    MapMarker: ({ children }: { children?: React.ReactNode }) =>
      React.createElement("div", null, children),
    CustomOverlayMap: ({ children }: { children?: React.ReactNode }) =>
      React.createElement("div", null, children),
    Roadview: () =>
      React.createElement("div", { "data-testid": "kakao-roadview" }),
  };
});

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
