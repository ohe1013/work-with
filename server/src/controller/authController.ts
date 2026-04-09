import { Request, Response } from "express";
import { sign, TOKEN_EXPIRES_IN_SECONDS } from "../util/jwt.utils.ts";

type AuthDemoUser = {
  email: string;
  password: string;
  role: "user" | "admin";
  displayName: string;
};

const authUsers: AuthDemoUser[] = [
  {
    email: process.env.DEMO_USER_EMAIL ?? "test123@naver.com",
    password: process.env.DEMO_USER_PASSWORD ?? "test123",
    role: "user",
    displayName: "워크위드 메이트",
  },
];

const login = (req: Request, res: Response) => {
  const { email, password } = (req.body ?? {}) as {
    email?: string;
    password?: string;
  };

  if (typeof email !== "string" || typeof password !== "string") {
    return res.status(400).json({
      message: "이메일과 비밀번호를 모두 입력해 주세요.",
    });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const normalizedPassword = password.trim();

  if (normalizedEmail.length === 0 || normalizedPassword.length === 0) {
    return res.status(400).json({
      message: "이메일과 비밀번호를 모두 입력해 주세요.",
    });
  }

  const user = authUsers.find(
    (candidate) => candidate.email.toLowerCase() === normalizedEmail
  );

  if (!user || user.password !== normalizedPassword) {
    return res.status(401).json({
      message: "이메일 또는 비밀번호가 올바르지 않아요.",
    });
  }

  const token = sign({
    email: user.email,
    role: user.role,
  });

  return res.status(200).json({
    token,
    expiresIn: TOKEN_EXPIRES_IN_SECONDS,
    user: {
      email: user.email,
      role: user.role,
      displayName: user.displayName,
    },
  });
};

const getToken = (req: Request) => {
  const authHeader = req.headers["authorization"];
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.split("Bearer ")[1];
  }
  return null;
};
export { getToken, login };
