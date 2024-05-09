import express from "express";
import * as FormationController from "./formation.controller";

export const formationRouter = express.Router();

formationRouter.get("/all", FormationController.listFormations);

formationRouter.get("/:id", FormationController.getFormationById);

formationRouter.get(
  "/category/:category_id",
  FormationController.getFormationByCategory
);

formationRouter.post("/add", FormationController.createFormation);

formationRouter.put("/:id", FormationController.updateFormation);

formationRouter.delete("/:id", FormationController.deleteFormation);
