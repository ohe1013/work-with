import { getToken } from "../controller/authController";
import jwt from "jsonwebtoken";
const accessTokenSecret = "your-access-token-secret"; // Access Token의 시크릿 키
const verifyToken = (req, res, next) => {
    const token = getToken(req); // 토큰을 얻는 방식을 getToken 함수로 추상화
    console.log("token", token);
    if (!token) {
        return res.status(401).json({ message: "Access token not found" });
    }
    try {
        const decoded = jwt.verify(token, accessTokenSecret);
        req.user = decoded;
        next();
    }
    catch (error) {
        return res.status(403).json({ message: "Invalid token" });
    }
};
export { verifyToken };
