import { Router } from "express";
import { userToken, adminToken } from "../middleware/jwt";
import userController from "./user.controller";

export const userRouter = Router();

userRouter.get("/all", userController.listUsers.bind(userController));
userRouter.get("/:id", userController.getUserById.bind(userController));
userRouter.get(
  "/name/:name",
  userController.getUserByName.bind(userController)
);
userRouter.get(
  "/mail/:mail",
  userController.getUserByMail.bind(userController)
);
userRouter.post("/signup", userController.signup.bind(userController));
userRouter.post("/login", userController.login.bind(userController));

userRouter.put(
  "/:id",
  userToken,
  userController.updateUser.bind(userController)
);
userRouter.put(
  "/pro/:id",
  userToken,
  userController.sentinelUnlock.bind(userController)
);

// Admin routes
userRouter.put(
  "/admin/:id",
  adminToken,
  userController.updateUser.bind(userController)
);
userRouter.delete(
  "/:id",
  userToken,
  userController.deleteUser.bind(userController)
);
userRouter.delete(
  "/admin/:id",
  adminToken,
  userController.deleteUser.bind(userController)
);
