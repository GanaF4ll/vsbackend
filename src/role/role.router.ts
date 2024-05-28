import express, { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { adminToken } from "../middleware/jwt";

import * as RoleController from "./role.controller";

export const roleRouter = express.Router();

roleRouter.get(
  "/all",
  // adminToken,
  RoleController.listRoles
);

roleRouter.get("/:id", adminToken, RoleController.getRoleById);

roleRouter.post(
  "/add",
  // adminToken,
  body("name").isString().notEmpty(),
  RoleController.createRole
);

roleRouter.put(
  "/:id",
  adminToken,
  body("name").isString().notEmpty(),
  RoleController.updateRole
);

roleRouter.delete("/:id", adminToken, RoleController.deleteRole);
