import express from "express";
import cors from "cors";
import https from "https";
import http from "http";
import { verifyToken } from "./middleware/tokenMiddleware.ts";
const app = express();
// const origin = "http://localhost:5173";
// app.use(cors());
// app.use((req, res) => {
//   res.header("Access-Control-Allow-Origin", origin);
// });
app.get("/", verifyToken, async (req, res) => {
  res.send("xs ");
});
app.post("/api/login", verifyToken, async (req, res) => {
  res.send({ token: "hi" });
});
const options = {
  // 다음 옵션을 추가
  rejectUnauthorized: false,
};
app.get("/kakao/get/search", function (req, res) {
  const { query } = req;
  const { keyword } = query;
  const baseURL =
    "http://map.kakao.com/api/dapi/suggest/hub?service=local-suggest&q=";
  console.log(baseURL + keyword);
  http.get(baseURL + keyword, function (res) {
    res.on("data", (chunk) => {
      console.log(chunk);
    });
  });
});
app.listen(3000, () => console.log("nodemon"));
