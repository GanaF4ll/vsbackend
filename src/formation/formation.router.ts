import express from "express";
import * as FormationController from "./formation.controller";
import { creatorToken } from "../middleware/jwt";

export const formationRouter = express.Router();

formationRouter.get("/all", FormationController.listFormations);

formationRouter.get("/dev/:id", FormationController.getFormationByIdDev);

formationRouter.get("/:id", FormationController.getFormationById);

formationRouter.get(
  "/category/:category_id",
  FormationController.getFormationByCategory
);

formationRouter.post("/add", creatorToken, FormationController.createFormation);

formationRouter.put("/:id", creatorToken, FormationController.updateFormation);

formationRouter.delete(
  "/:id",
  creatorToken,
  FormationController.deleteFormation
);
