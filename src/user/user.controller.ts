import { Request, Response } from "express";
import { db } from "../app";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { Controller } from "../models/controller";

dotenv.config();

class UserController extends Controller {
  public listUsers = this.handleRequest(
    async (req: Request, res: Response): Promise<void> => {
      const users = await db.users.findMany({
        select: {
          id: true,
          firstName: true,
          lastName: true,
          birthdate: true,
          mail: true,
          role_id: true,
          gender: true,
        },
      });
      res.status(200).json(users);
    }
  );

  public getUserById = this.handleRequest(
    async (req: Request, res: Response): Promise<void> => {
      const user = await db.users.findUnique({
        where: {
          id: parseInt(req.params.id),
        },
      });

      if (!user) {
        res.status(404).json({ message: "No user found with that id" });
        return;
      }

      res.status(200).json(user);
    }
  );

  public getUserByName = this.handleRequest(
    async (req: Request, res: Response): Promise<void> => {
      const name = req.params.name;
      const users = await db.users.findMany({
        where: {
          OR: [
            { firstName: { contains: name } },
            { lastName: { contains: name } },
          ],
        },
      });

      if (users.length === 0) {
        res.status(404).json({ message: "No user found with that name" });
        return;
      }

      res.status(200).json(users);
    }
  );

  public getUserByMail = this.handleRequest(
    async (req: Request, res: Response): Promise<void> => {
      const mail = req.params.mail;
      const user = await db.users.findFirst({
        where: {
          mail,
        },
      });

      if (!user) {
        res.status(404).json({ message: "No user found with that email" });
        return;
      }

      res.status(200).json(user);
    }
  );

  public signup = this.handleRequest(
    async (req: Request, res: Response): Promise<void> => {
      const { firstName, lastName, mail, password, role_id, gender } = req.body;

      const hashedPassword = await bcrypt.hash(password, 10);

      const existingUser = await db.users.findFirst({ where: { mail } });
      if (existingUser) {
        res.status(400).json({ message: "ERROR: User already exists!" });
        return;
      }

      const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{7,}$/;
      if (!passwordRegex.test(password)) {
        res
          .status(400)
          .json({ message: "ERROR: Password is not strong enough!" });
        return;
      }

      let birthdate: Date;
      if (req.body.birthdate) {
        birthdate = new Date(req.body.birthdate);
      } else {
        birthdate = new Date();
      }

      const user = await db.users.create({
        data: {
          firstName,
          lastName,
          mail,
          birthdate,
          password: hashedPassword,
          role_id,
          gender,
        },
      });

      res.status(201).json(user);
    }
  );

  public login = this.handleRequest(
    async (req: Request, res: Response): Promise<void> => {
      const { mail, password } = req.body;

      const user = await db.users.findFirst({ where: { mail } });
      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      const isPasswordMatch = await bcrypt.compare(password, user.password);
      if (!isPasswordMatch) {
        res.status(401).json({ message: "Invalid mail or password" });
        return;
      }

      const token = jwt.sign(
        { id: user.id, mail: user.mail, role: user.role_id },
        process.env.TOKEN_SECRET as string,
        { noTimestamp: true }
      );

      res.status(200).json({ token });
    }
  );

  public updateUser = this.handleRequest(
    async (req: Request, res: Response): Promise<void> => {
      const { id } = req.params;
      const { firstName, lastName, mail, password, role_id, gender } = req.body;

      const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{7,}$/;
      if (!passwordRegex.test(password)) {
        res
          .status(400)
          .json({ message: "ERROR: Password is not strong enough!" });
        return;
      }

      let birthdate: Date;
      if (req.body.birthdate) {
        birthdate = new Date(req.body.birthdate);
      } else {
        birthdate = new Date();
      }

      await db.users.update({
        where: { id: parseInt(id) },
        data: {
          firstName,
          lastName,
          mail,
          password: await bcrypt.hash(password, 10),
          role_id,
          gender,
        },
      });

      const updatedUser = await db.users.findUnique({
        where: { id: parseInt(id) },
      });

      res.status(200).json(updatedUser);
    }
  );

  public sentinelUnlock = this.handleRequest(
    async (req: Request, res: Response): Promise<void> => {
      const { id } = req.params;

      const role_id = 5;

      await db.users.update({
        where: { id: parseInt(id) },
        data: {
          role_id,
        },
      });

      const updatedUser = await db.users.findUnique({
        where: { id: parseInt(id) },
      });

      res
        .status(200)
        .json({ message: `User ${id} is now a SENTINEL`, updatedUser });
    }
  );

  public deleteUser = this.handleRequest(
    async (req: Request, res: Response): Promise<void> => {
      const { id } = req.params;

      await db.users.delete({ where: { id: parseInt(id) } });

      res.status(200).json({ message: `User with id ${id} has been deleted` });
    }
  );
}

export default new UserController();
