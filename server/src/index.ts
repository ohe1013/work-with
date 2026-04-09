import express from "express";
import cors from "cors";
import https from "https";
import crypto from "crypto";
import axios from "axios";
import { login } from "./controller/authController.ts";

const app = express();
const origin = "http://localhost:5173";
app.use(
  cors({
    origin,
    credentials: true,
  })
);
app.use(express.json());

app.post("/api/login", login);

const allowLegacyRenegotiationforNodeJsOptions = {
  httpsAgent: new https.Agent({
    // for self signed you could also add
    // rejectUnauthorized: false,
    // allow legacy server
    secureOptions: crypto.constants.SSL_OP_LEGACY_SERVER_CONNECT,
  }),
};
const fetchKakaoSuggest = async (baseURL: string) =>
  axios({
    ...allowLegacyRenegotiationforNodeJsOptions,
    baseURL,
  });

app.get("/kakao/get/search", async function (req, res) {
  const { query } = req;
  const { keyword } = query;
  const baseURL =
    "https://map.kakao.com/api/dapi/suggest/hub?service=local-suggest&q=" +
    keyword;
  try {
    const response = await fetchKakaoSuggest(baseURL);
    res.json(response.data);
  } catch (err: any) {
    res.status(500);
    res.json({ message: err.response.data.message });
  }
});

app.listen(3000, () => console.log("nodemon"));
