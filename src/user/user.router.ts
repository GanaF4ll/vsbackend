import express, { Request, Response } from "express";
import UserController from "./user.controller";

const router = express.Router();
const userController = new UserController();

// GET /users
router.get("/", userController.listUsers);

// GET /users/:id
router.get("/:id", userController.getUserById);

// GET /users/name/:name
router.get("/name/:name", userController.getUserByName);

// GET /users/mail/:mail
router.get("/mail/:mail", userController.getUserByMail);

// POST /users/signup
router.post("/signup", userController.signup);

// POST /users/login
router.post("/login", userController.login);

// PUT /users/:id
router.put("/:id", userController.updateUser);

// PUT /users/sentinel/:id
router.put("/sentinel/:id", userController.sentinelUnlock);

// DELETE /users/:id
router.delete("/:id", userController.deleteUser);

export default router;
