import type {
  AuthErrorResponse,
  LoginForm,
  LoginResponse,
} from "../../types/auth";

const baseUrl = import.meta.env.DEV ? "http://localhost:3000" : "";

class AuthApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "AuthApiError";
    this.status = status;
  }
}

const signIn = async ({
  email,
  password,
}: LoginForm): Promise<LoginResponse> => {
  const response = await fetch(baseUrl + "/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const payload = (await response.json()) as
    | Partial<LoginResponse>
    | AuthErrorResponse;

  if (!response.ok) {
    throw new AuthApiError(
      "message" in payload && typeof payload.message === "string"
        ? payload.message
        : "로그인에 실패했어요.",
      response.status
    );
  }

  if (
    !("token" in payload) ||
    typeof payload.token !== "string" ||
    !("user" in payload) ||
    typeof payload.user !== "object" ||
    payload.user === null ||
    !("expiresIn" in payload) ||
    typeof payload.expiresIn !== "number"
  ) {
    throw new AuthApiError("로그인 응답 형식이 올바르지 않아요.", 500);
  }

  return payload as LoginResponse;
};

export { AuthApiError, signIn };
