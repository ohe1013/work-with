const express = require("express");

const app = express();

const { Client } = require("pg");
const query = require("pg").Query;
const dbConfig = require("./config/db.config.js");

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
app.get("/", (req, res) => {
  client.query("select * from user_table", (error, result) => {
    if (error) {
      res.sendStatus(500);
    } else {
      res.status(200).json(result.rows);
    }
  });
});

app.listen(3000, () => console.log("is open"));
