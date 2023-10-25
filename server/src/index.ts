import express from "express";
import cors from "cors";
import https from "https";
import http from "http";
import crypto from "crypto";
import { verifyToken } from "./middleware/tokenMiddleware.ts";
import axios from "axios";
const app = express();
const origin = "http://localhost:5173";
app.all("/*", function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
});
app.use(cors());
// app.get("/", verifyToken, async (req, res) => {
//     res.send("xs ");
// });
// app.post("/api/login", verifyToken, async (req, res) => {
//     res.send({ token: "hi" });
// });
const allowLegacyRenegotiationforNodeJsOptions = {
    httpsAgent: new https.Agent({
        // for self signed you could also add
        // rejectUnauthorized: false,
        // allow legacy server
        secureOptions: crypto.constants.SSL_OP_LEGACY_SERVER_CONNECT,
    }),
};
app.get("/kakao/get/search", async function (req, res) {
    const { query } = req;
    const { keyword } = query;
    const baseURL = "https://map.kakao.com/api/dapi/suggest/hub?service=local-suggest&q=" + keyword;
    const r = await axios({
        ...allowLegacyRenegotiationforNodeJsOptions,
        baseURL,
    });
    console.log(r.data);
    // res.json(r.data);
    res.json(r.data);
});
app.listen(3000, () => console.log("nodemon"));
