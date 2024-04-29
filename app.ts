import express from "express";
// import userRouter from './routes/userRouter';

require("dotenv").config({ path: "./.env" });

const app = express();
const port = process.env.PORT;

// datasource db {
//     provider = "mysql"
//     url      = env("DATABASE_URL")
//   }

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
