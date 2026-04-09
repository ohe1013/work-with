import jwt, { JwtPayload } from "jsonwebtoken";

const secret = process.env.JWT_SECRET || "work-with-dev-secret";
const TOKEN_EXPIRES_IN_SECONDS = 60 * 60;

type JwtUserPayload = {
  email: string;
  role: "user" | "admin";
};

const sign = (payload: JwtUserPayload) =>
  jwt.sign(payload, secret, { expiresIn: TOKEN_EXPIRES_IN_SECONDS });

const verify = (token: string) => {
  try {
    const decoded = jwt.verify(token, secret) as JwtPayload & JwtUserPayload;

    return {
      ok: true as const,
      payload: {
        email: decoded.email,
        role: decoded.role,
      },
    };
  } catch (e) {
    return {
      ok: false as const,
      message: e instanceof Error ? e.message : "Token verification failed",
    };
  }
};

export { sign, verify, TOKEN_EXPIRES_IN_SECONDS };
export type { JwtUserPayload };
