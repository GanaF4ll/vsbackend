import express, { Request, Response } from "express";
import * as UserController from "./user.controller";
import { userToken } from "../middleware/jwt";

export const userRouter = express.Router();

userRouter.get("/", UserController.listUsers);

userRouter.get("/:id", UserController.getUserById);

// Params: firstName, lastName, mail, birthdate, password, role_id, isPro
userRouter.post("/signup", UserController.signup);

userRouter.put("/:id", userToken, UserController.updateUser);

userRouter.delete("/:id", UserController.deleteUser);

userRouter.post("/login", UserController.login);
