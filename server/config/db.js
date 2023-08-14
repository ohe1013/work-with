import postgres from "postgres";
import dbConfig from "./db.config.js";
const sql = postgres({
  user: dbConfig.USER,
  host: dbConfig.HOST,
  database: dbConfig.DB,
  password: dbConfig.PASSWORD,
  port: dbConfig.PORT,
});

export default sql;
