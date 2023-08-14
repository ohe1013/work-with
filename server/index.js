import express from "express";
import cors from "cors";
import { verifyToken } from "./middleware/tokenMiddleware.js";
const app = express();
app.use(cors());

app.get("/", verifyToken, async (req, res) => {
  console.log(xs);
  res.send(xs);
});
app.post("/api/login", verifyToken, async (req, res) => {
  res.send({ token: "hi" });
});

app.listen(3000, () => console.log("is open"));
