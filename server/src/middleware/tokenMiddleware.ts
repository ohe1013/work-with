import { getToken } from "../controller/authController.ts";
import { verify } from "../util/jwt.utils.ts";

const verifyToken = (req: any, res: any, next: any) => {
  const token = getToken(req); // 토큰을 얻는 방식을 getToken 함수로 추상화
  if (!token) {
    return res.status(401).json({ message: "Access token not found" });
  }

  const result = verify(token);
  if (!result.ok) {
    return res.status(403).json({ message: result.message });
  }

  req.user = result.payload;
  next();
};

export { verifyToken };
