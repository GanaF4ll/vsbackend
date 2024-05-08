import express, { Request, Response } from "express";
import { body, validationResult } from "express-validator";

import * as RoleController from "./role.controller";

export const roleRouter = express.Router();

roleRouter.get("/all", RoleController.listRoles);

roleRouter.get("/:id", RoleController.getRoleById);

roleRouter.post("/add", RoleController.createRole);

roleRouter.put("/:id", RoleController.updateRole);

roleRouter.delete("/:id", RoleController.deleteRole);
