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
