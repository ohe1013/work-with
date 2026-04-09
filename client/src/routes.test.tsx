import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen } from "@testing-library/react";
import { RecoilRoot } from "recoil";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { routes } from "./routes";

jest.mock("./api/auth/authApi", () => ({
  signIn: jest.fn(),
}));

jest.mock("./components/common/DynamicSvg", () => {
  return {
    __esModule: true,
    default: () => <div data-testid="dynamic-svg" />,
  };
});

jest.mock("./components/side-tab/search/SuggestList", () => ({
  __esModule: true,
  default: () => null,
}));

describe("routes", () => {
  function renderRouter(path: string) {
    const router = createMemoryRouter(routes, { initialEntries: [path] });
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });

    render(
      <RecoilRoot>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
        </QueryClientProvider>
      </RecoilRoot>
    );
  }

  test("renders the map-first home route", () => {
    renderRouter("/");

    expect(screen.getByRole("searchbox")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "지도에서 보기" })
    ).toBeDisabled();
    expect(
      screen.getByText("운동 메이트를 지도 위에서 빠르게 비교하세요")
    ).toBeInTheDocument();
    expect(screen.getByText("먼저 장소를 검색해보세요")).toBeInTheDocument();
    expect(screen.getByTestId("kakao-map")).toBeInTheDocument();
  });

  test("renders the condition-based find route", () => {
    renderRouter("/find");

    expect(
      screen.getByText("찾는 조건을 먼저 정하고 맞는 운동 장소를 골라보세요")
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "조건으로 찾기" })
    ).toBeDisabled();
    expect(screen.getByText("운동 종류")).toBeInTheDocument();
    expect(screen.getByText("현재 조건")).toBeInTheDocument();
    expect(screen.getByTestId("kakao-map")).toBeInTheDocument();
  });

  test("enables login when email and password are filled", () => {
    renderRouter("/login");

    const email = screen.getByLabelText("Email");
    const password = screen.getByLabelText("Password");
    const loginButton = screen.getByRole("button", { name: "Login" });

    expect(loginButton).toBeDisabled();

    fireEvent.change(email, { target: { value: "test123@naver.com" } });
    fireEvent.change(password, { target: { value: "test123" } });

    expect(loginButton).toBeEnabled();
  });
});
