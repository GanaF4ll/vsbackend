import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import { userRouter } from "./user/user.router";
import { roleRouter } from "./role/role.router";
import { categoryRouter } from "./category/category.router";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
const PORT = process.env.PORT;

// app.use("/users", userRouter);
app.use("/role", roleRouter);
app.use("/category", categoryRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
