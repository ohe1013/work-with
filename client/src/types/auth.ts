export type LoginForm = {
  email: string;
  password: string;
};

export type AuthUser = {
  email: string;
  role: "user" | "admin";
  displayName: string;
};

export type LoginResponse = {
  token: string;
  expiresIn: number;
  user: AuthUser;
};

export type AuthErrorResponse = {
  message: string;
};

export type AuthSession = LoginResponse;

export type loginForm = LoginForm;
