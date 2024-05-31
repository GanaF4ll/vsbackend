import express, { Request, Response } from "express";
import * as UserController from "./user.controller";
import { userToken, adminToken } from "../middleware/jwt";

export const userRouter = express.Router();

userRouter.get("/all", UserController.listUsers);

userRouter.get("/:id", UserController.getUserById);

// Params: firstName, lastName, mail, birthdate, password, role_id, isPro
userRouter.post("/signup", UserController.signup);

userRouter.get("/name/:name", UserController.getUserByName);

userRouter.put("/:id", userToken, UserController.updateUser);

userRouter.delete("/:id", userToken, UserController.deleteUser);

userRouter.post("/login", UserController.login);

userRouter.put("/pro/:id", userToken, UserController.sentinelUnlock);

// ADMIN ROUTES

userRouter.put("/admin/:id", adminToken, UserController.updateUser);

userRouter.delete("/:id", adminToken, UserController.deleteUser);
