import express, { Request, Response } from "express";
import { body, validationResult } from "express-validator";

import * as UserService from "./user.controller";

export const userRouter = express.Router();

userRouter.get("/", async (req: Request, res: Response) => {
  try {
    const users = await UserService.listUsers();
    return res.status(200).json(users);
  } catch (error: any) {
    const err = error as Error;
    return res.status(500).json({ message: err.message });
  }
});

userRouter.get("/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const user = await UserService.getUserById(id);
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
userRouter.post("/", async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array() });
    }

    const user = await UserService.createUser(req.body);
    return res.status(201).json(user);
  } catch (error: any) {
    const err = error as Error;
    return res.status(500).json({ message: err.message });
  }
});
