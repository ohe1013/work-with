import express from "express";
import cors from "cors";
const app = express();
app.use(cors());

import postgres from "postgres";
import dbConfig from "./config/db.config.js";
const sql = postgres({
  user: dbConfig.USER,
  host: dbConfig.HOST,
  database: dbConfig.DB,
  password: dbConfig.PASSWORD,
  port: dbConfig.PORT,
});

app.get("/", async (req, res) => {
  const xs = await sql`
    select * from user_table
  `;
  res.send(xs);
  console.log(xs);
});

app.post("/api/login", async (req, res) => {
  res.send({ token: "hi" });
});

app.listen(3000, () => console.log("is open"));
