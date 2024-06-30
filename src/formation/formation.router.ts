import { Router } from "express";
import { formationController } from "./formation.controller";
import { creatorToken } from "../middleware/jwt";

export const formationRouter = Router();

formationRouter.get(
  "/all",
  formationController.listFormations.bind(formationController)
);
formationRouter.get(
  "/:id/dev",
  formationController.getFormationByIdDev.bind(formationController)
);
formationRouter.get(
  "/:id",
  formationController.getFormationById.bind(formationController)
);
formationRouter.get(
  "/category/:category_id",
  formationController.getFormationByCategory.bind(formationController)
);
formationRouter.get(
  "/title/:title",
  formationController.getFormationByTitle.bind(formationController)
);
formationRouter.post(
  "/add",
  creatorToken,
  formationController.createFormation.bind(formationController)
);
formationRouter.put(
  "/:id",
  creatorToken,
  formationController.updateFormation.bind(formationController)
);
formationRouter.delete(
  "/:id",
  creatorToken,
  formationController.deleteFormation.bind(formationController)
);
