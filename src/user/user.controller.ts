import { db } from "../app";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { Request, Response } from "express";
import { Controller } from "../models/controller";

dotenv.config();

class UserController extends Controller {
  constructor() {
    super(); // Appel au constructeur de Controller
    // Bind des méthodes de classe pour assurer le bon contexte 'this'
    this.listUsers = this.listUsers.bind(this);
    this.getUserById = this.getUserById.bind(this);
    this.getUserByName = this.getUserByName.bind(this);
    this.getUserByMail = this.getUserByMail.bind(this);
    this.signup = this.signup.bind(this);
    this.login = this.login.bind(this);
    this.updateUser = this.updateUser.bind(this);
    this.sentinelUnlock = this.sentinelUnlock.bind(this);
    this.deleteUser = this.deleteUser.bind(this);
  }

  ////////////////////////////////////////
  //////////////////GET////////////////////
  ////////////////////////////////////////

  public listUsers = this.handleRequest(
    async (req: Request, res: Response): Promise<void> => {
      try {
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
      } catch (error: any) {
        console.log(error);
        res.status(500).json({ message: "No users found" });
      }
    }
  );

  public getUserById = this.handleRequest(
    async (req: Request, res: Response): Promise<void> => {
      try {
        const user = await db.users.findUnique({
          where: {
            id: parseInt(req.params.id),
          },
        });

        if (!user) {
          res.status(404).json({ message: "No user found with that id" });
          return; // Ajout d'un return pour éviter l'erreur de type
        }

        res.status(200).json(user);
      } catch (error: any) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
      }
    }
  );

  public getUserByName = this.handleRequest(
    async (req: Request, res: Response): Promise<void> => {
      const name = req.params.name;
      try {
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
          return; // Ajout d'un return pour éviter l'erreur de type
        }

        res.status(200).json(users);
      } catch (error: any) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
      }
    }
  );

  public getUserByMail = this.handleRequest(
    async (req: Request, res: Response): Promise<void> => {
      const mail = req.params.mail;
      try {
        const user = await db.users.findFirst({
          where: { mail },
        });
        if (user) {
          res.status(200).json(user);
        } else {
          res.status(404).json({ message: "No user found with that email" });
        }
      } catch (error: any) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
      }
    }
  );

  ////////////////////////////////////////
  //////////////////POST///////////////////
  ////////////////////////////////////////

  public signup = this.handleRequest(
    async (req: Request, res: Response): Promise<void> => {
      const { firstName, lastName, mail, password, role_id, gender } = req.body;

      const hashedPassword = await bcrypt.hash(password, 10);

      try {
        let user = await db.users.findFirst({ where: { mail } });
        if (user) {
          res.status(400).json({ message: "User already exists" });
          return; // Ajout d'un return pour éviter l'erreur de type
        }

        const passwordRegex =
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{7,}$/;
        if (!passwordRegex.test(password)) {
          res.status(400).json({ message: "Password is not strong enough" });
          return; // Ajout d'un return pour éviter l'erreur de type
        }

        let birthdate: Date;
        if (req.body.birthdate) {
          birthdate = new Date(req.body.birthdate);
        } else {
          birthdate = new Date();
        }

        user = await db.users.create({
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
      } catch (error: any) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
      }
    }
  );

  public login = this.handleRequest(
    async (req: Request, res: Response): Promise<void> => {
      const { mail, password } = req.body;
      try {
        let user = await db.users.findFirst({ where: { mail } });

        if (!user) {
          res.status(404).json({ message: "User not found" });
          return; // Ajout d'un return pour éviter l'erreur de type
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);

        if (!isPasswordMatch) {
          res.status(401).json({ message: "Invalid mail or password" });
          return; // Ajout d'un return pour éviter l'erreur de type
        }

        const token = jwt.sign(
          { id: user.id, mail: user.mail, role: user.role_id },
          process.env.TOKEN_SECRET as string,
          { noTimestamp: true }
        );

        res.status(200).json({ token });
      } catch (error: any) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
      }
    }
  );

  ////////////////////////////////////////
  //////////////////PUT////////////////////
  ////////////////////////////////////////

  public updateUser = this.handleRequest(
    async (req: Request, res: Response): Promise<void> => {
      try {
        const { id } = req.params;
        const { firstName, lastName, mail, password, role_id, gender } =
          req.body;

        const passwordRegex =
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{7,}$/;
        if (!passwordRegex.test(password)) {
          res.status(400).json({ message: "Password is not strong enough" });
          return; // Ajout d'un return pour éviter l'erreur de type
        }

        let birthdate: Date;
        if (req.body.birthdate) {
          birthdate = new Date(req.body.birthdate);
        } else {
          birthdate = new Date();
        }

        await db.users.update({
          where: {
            id: parseInt(id),
          },
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
          where: {
            id: parseInt(id),
          },
        });

        res.status(200).json(updatedUser);
      } catch (error: any) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
      }
    }
  );

  ////////////////////////////////////////
  //////////////////DELETE/////////////////
  ////////////////////////////////////////

  public sentinelUnlock = this.handleRequest(
    async (req: Request, res: Response): Promise<void> => {
      const role_id = 5;
      const id = parseInt(req.params.id);
      try {
        await db.users.update({
          where: { id },
          data: { role_id },
        });

        const updatedUser = await db.users.findUnique({ where: { id } });

        res
          .status(200)
          .json({ message: `User ${id} is now a SENTINEL`, updatedUser });
      } catch (error: any) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
      }
    }
  );

  public deleteUser = this.handleRequest(
    async (req: Request, res: Response): Promise<void> => {
      const id: number = parseInt(req.params.id);
      try {
        const user = await db.users.delete({
          where: { id },
        });

        res.status(200).json({ message: "User deleted", user });
      } catch (error: any) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
      }
    }
  );
}

export default UserController;
