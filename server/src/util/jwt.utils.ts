import jwt, { JwtPayload } from "jsonwebtoken";

const secret = "";

type JwtUserPayload = {
  email: string;
};

const sign = (email: string) => {
  const payload: JwtUserPayload = { email };

  return jwt.sign(payload, secret, { expiresIn: "1h" }, (err, token) => {
    if (err) {
      console.error(err);
      return;
    }

    console.log(token);
  });
};

const verify = (token: string) => {
  try {
    const decoded = jwt.verify(token, secret) as JwtPayload & JwtUserPayload;

    return {
      type: true,
      email: decoded.email,
    };
  } catch (e) {
    return {
      type: false,
      message: e instanceof Error ? e.message : "Token verification failed",
    };
  }
};

export { sign, verify };
