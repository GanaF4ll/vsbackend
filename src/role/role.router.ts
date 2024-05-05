import express, { Request, Response } from "express";
import { body, validationResult } from "express-validator";

import * as RoleController from "./role.controller";

export const roleRouter = express.Router();

roleRouter.get("/", async (req: Request, res: Response) => {
  try {
    const roles = await RoleController.listRoles();
    return res.status(200).json(roles);
  } catch (error: any) {
    const err = error as Error;
    return res.status(500).json({ message: err.message });
  }
});

roleRouter.get("/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const role = await RoleController.getRoleById(id);
    if (!role) {
      return res.status(404).json({ message: "Role not found" });
    }
    return res.status(200).json(role);
  } catch (error: any) {
    const err = error as Error;
    return res.status(500).json({ message: err.message });
  }
});

roleRouter.post("/add", async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array() });
    }
  } catch (error) {
    const err = error as Error;
    return res.status(500).json({ message: err.message });
  }
});
