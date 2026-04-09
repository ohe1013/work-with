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
    expect(
      screen.getByText("먼저 어디서 만날지부터 정해볼까요?")
    ).toBeInTheDocument();
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

  test("renders the staged regist route", () => {
    renderRouter("/regist");

    expect(
      screen.getByText("부담 없이 올리고, 제출 전 한 번 더 확인하세요")
    ).toBeInTheDocument();
    expect(screen.getByText("운동 종류를 정하세요")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "제출 전 요약 보기" })
    ).toBeDisabled();
    expect(screen.getByText("제출 전 요약")).toBeInTheDocument();
  });

  test("enables login when email and password are filled", () => {
    renderRouter("/login");

    const email = screen.getByLabelText("이메일");
    const password = screen.getByLabelText("비밀번호");
    const loginButton = screen
      .getAllByRole("button", { name: "로그인" })
      .find((button) => button.getAttribute("type") === "submit");

    expect(loginButton).toBeDefined();
    if (!loginButton) {
      throw new Error("로그인 submit 버튼을 찾지 못했습니다.");
    }

    expect(loginButton).toBeDisabled();

    fireEvent.change(email, { target: { value: "test123@naver.com" } });
    fireEvent.change(password, { target: { value: "test123" } });

    expect(loginButton).toBeEnabled();
  });
});
