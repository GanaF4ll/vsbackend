import express, { Request, Response } from "express";
import { body, validationResult } from "express-validator";

import * as UserController from "./user.controller";

export const userRouter = express.Router();

userRouter.get("/", UserController.listUsers);

userRouter.get("/:id", UserController.getUserById);

// Params: firstName, lastName, mail, birthdate, password, role_id, isPro
userRouter.post("/signup", UserController.signup);

userRouter.put(
  "/:id",
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
    const id: number = parseInt(req.params.id, 10);
    try {
      const user = req.body;
      const updatedUser = await UserController.updateUser(user, id);
      return res.status(200).json(updatedUser);
    } catch (error: any) {
      return res.status(500).json(error.message);
    }
  }
);

userRouter.delete("/:id", async (req: Request, res: Response) => {
  const id: number = parseInt(req.params.id);
  try {
    await UserController.deleteUser(id);
    res.status(204).json("User deleted");
  } catch (error: any) {
    return res.status(500).json(error.message);
  }
});

// userRouter.post("/login", async (req: Request, res: Response) => {
//   try {
//     const user = await UserController.login(req, res);
//     return res.status(200).json(user);
//   } catch (error: any) {
//     return res.status(500).json(error.message);
//   }
// });

userRouter.post("/login", UserController.login);
