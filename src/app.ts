import express from "express";
import mysql from "mysql";
import dotenv from "dotenv";
import cors from "cors";

import { userRouter } from "./user/user.router";
import { roleRouter } from "./role/role.router";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
const PORT = process.env.PORT;

app.use("/users", userRouter);
app.use("/role", roleRouter);
// const connexion = mysql.createConnection({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
// });

// connexion.connect((err: mysql.MysqlError) => {
//   if (err) {
//     console.error("Error connecting to database:", err);
//     return;
//   }
//   console.log("Connection established");
// });

// connexion.query("SELECT * FROM users", (err, rows, fields) => {
//   if (err) throw err;
//   console.log("Data received from Db:", rows);
// });

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
