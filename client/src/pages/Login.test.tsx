import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Login from "./Login";

const mockNavigate = jest.fn();
const mockLogin = jest.fn();

jest.mock("react-router-dom", () => {
  const actual = jest.requireActual("react-router-dom");

  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

jest.mock("../hooks/auth/useAuth", () => ({
  useAuth: () => ({
    isAuthenticated: false,
    login: mockLogin,
    logout: jest.fn(),
    token: null,
    user: null,
  }),
}));

describe("Login", () => {
  beforeEach(() => {
    mockLogin.mockReset();
    mockNavigate.mockReset();
  });

  test("shows the server auth message when login fails", async () => {
    mockLogin.mockRejectedValueOnce(
      new Error("이메일 또는 비밀번호가 올바르지 않아요.")
    );

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText("이메일"), {
      target: { value: "test123@naver.com" },
    });
    fireEvent.change(screen.getByLabelText("비밀번호"), {
      target: { value: "wrong-password" },
    });
    fireEvent.click(screen.getByRole("button", { name: "로그인" }));

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(
        "이메일 또는 비밀번호가 올바르지 않아요."
      );
    });
  });

  test("navigates home after a successful login", async () => {
    mockLogin.mockResolvedValueOnce({
      token: "testToken",
      expiresIn: 3600,
      user: {
        email: "test123@naver.com",
        role: "user",
        displayName: "워크위드 메이트",
      },
    });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText("이메일"), {
      target: { value: "test123@naver.com" },
    });
    fireEvent.change(screen.getByLabelText("비밀번호"), {
      target: { value: "test123" },
    });
    fireEvent.click(screen.getByRole("button", { name: "로그인" }));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/");
    });
  });
});
