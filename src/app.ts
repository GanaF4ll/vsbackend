import express from "express";
import mysql from "mysql";
import dotenv from "dotenv";
// import cors from "cors";

// import userRouter from './routes/userRouter';

dotenv.config();

const app = express();
const port = process.env.PORT;

const connexion = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

connexion.connect((err: mysql.MysqlError) => {
  if (err) {
    console.error("Error connecting to database:", err);
    return;
  }
  console.log("Connection established");
});

connexion.query("SELECT * FROM users", (err, rows, fields) => {
  if (err) throw err;
  console.log("Data received from Db:", rows);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
