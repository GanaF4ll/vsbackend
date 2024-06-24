// src/user/user.router.ts

import express from "express";
import * as UserController from "./user.controller";
import { userToken, adminToken } from "../middleware/jwt";

export const userRouter = express.Router();

userRouter.get("/all", UserController.listUsers);
userRouter.get("/:id", UserController.getUserById);
userRouter.get("/name/:name", UserController.getUserByName);
userRouter.get("/mail/:mail", UserController.getUserByMail);
userRouter.post("/signup", UserController.signup);
userRouter.post("/login", UserController.login);
userRouter.put("/:id", userToken, UserController.updateUser);
userRouter.put("/pro/:id", userToken, UserController.sentinelUnlock);

// Admin routes
userRouter.put("/admin/:id", adminToken, UserController.updateUser);
userRouter.delete("/:id", userToken, UserController.deleteUser);
userRouter.delete("/admin/:id", adminToken, UserController.deleteUser);
