const express = require("express");

const app = express();

const { Client } = import("pg");
const dbConfig = "./config/db.config.js";
app.use(express.json());
const cors = require("cors");
app.use(cors());
const jwt = require("jsonwebtoken");
const client = new Client({
  user: dbConfig.USER,
  host: dbConfig.HOST,
  database: dbConfig.DB,
  password: dbConfig.PASSWORD,
  port: dbConfig.PORT,
});

client.connect((err) => {
  if (err) {
    console.log("error", err.stack);
  } else {
    console.log("success");
  }
});
app.get("/api/login", (req, res) => {
  client.query("select * from user_table", (error, result) => {
    if (error) {
      res.sendStatus(500);
    } else {
      res.status(200).json(result.rows);
    }
  });
});

app.post("/api/login", (req, res) => {
  const { email, password } = req.body;
  client.query(
    "select * from user_table where email = $1 and password = $2",
    [email, password],
    (err, result) => {
      console.log(result);
      if (err) {
        throw err;
      }
      res.status(201).send({ token: "hi" });
    },
  );
});
app.post("/api/signin", (req, res) => {
  const { email, password } = req.body;
  jwt.client.query(
    "insert into user_table (email,password) values ($1,$2)",
    [email, password],
    (err, result) => {
      if (err) {
        throw err;
      }
      res.status(201).send({ token });
    },
  );
});

app.listen(3000, () => console.log("is open"));
