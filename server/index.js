import express from "express";
const app = express();
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

app.listen(3000, () => console.log("is open"));
