import express, { Request, Response } from "express";
import { body, validationResult } from "express-validator";

import * as RoleController from "./role.controller";

export const roleRouter = express.Router();

roleRouter.get("/all", async (req: Request, res: Response) => {
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

roleRouter.post(
  "/add",
  body("name").isString(),
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array() });
    }
    try {
      const role = req.body;
      const newRole = await RoleController.createRole(role);
      return res.status(201).json(newRole);
    } catch (error) {
      const err = error as Error;
      return res.status(500).json({ message: err.message });
    }
  }
);

roleRouter.put(
  "/:id",
  body("name").isString(),
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array() });
    }
    const id: number = parseInt(req.params.id, 10);
    try {
      const role = req.body;
      const updateRole = await RoleController.updateRole(role, id);
      return res.status(200).json(updateRole);
    } catch (error: any) {
      return res.status(500).json(error.message);
    }
  }
);

roleRouter.delete("/:id", async (req: Request, res: Response) => {
  const id: number = parseInt(req.params.id, 10);
  try {
    await RoleController.deleteRole(id);
    return res.status(204).json("Role deleted");
  } catch (error: any) {
    return res.status(500).json(error.message);
  }
});
