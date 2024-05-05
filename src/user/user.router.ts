import express, { Request, Response } from "express";
import { body, validationResult } from "express-validator";

import * as UserController from "./user.controller";

export const userRouter = express.Router();

userRouter.get("/", async (req: Request, res: Response) => {
  try {
    const users = await UserController.listUsers();
    return res.status(200).json(users);
  } catch (error: any) {
    const err = error as Error;
    return res.status(500).json({ message: err.message });
  }
});

userRouter.get("/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const user = await UserController.getUserById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json(user);
  } catch (error: any) {
    const err = error as Error;
    return res.status(500).json({ message: err.message });
  }
});

// Params: firstName, lastName, mail, birthdate, password, role
userRouter.post(
  "/add",
  body("firstName").isString(),
  body("lastName").isString(),
  body("birthdate").isString(),
  body("mail").isString(),
  body("password").isString(),
  body("role_id").isInt(),
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array() });
    }
    try {
      const user = req.body;
      const newUser = await UserController.createUser(user);
      return res.status(201).json(newUser);
    } catch (error) {
      const err = error as Error;
      return res.status(500).json({ message: err.message });
    }
  }
);
