import { db } from "../db/db.server";
import { hashSync, compareSync } from "bcrypt";
import * as jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { Request, Response } from "express";

dotenv.config();

export const listUsers = async (req: Request, res: Response) => {
  try {
    const users = await db.users.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        birthdate: true,
        mail: true,
        role_id: true,
        isPro: true,
      },
    });
    res.status(200).json(users);
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ message: "No user found" });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const user = await db.users.findUnique({
      where: {
        id: parseInt(req.params.id),
      },
    });
    res.status(200).json(user);
  } catch (error: any) {
    console.error(error);
    res.status(404).json({ message: "No user found with that id" });
  }
};

export const signup = async (req: Request, res: Response) => {
  const { firstName, lastName, mail, password, role_id, isPro } = req.body;

  let user = await db.users.findFirst({ where: { mail } });
  if (user) {
    res.status(400).json({ message: "ERROR: User already exists !" });
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
      password: hashSync(password, 10),
      role_id,
      isPro,
    },
  });

  res.status(201).json(user);
};

export const updateUser = async (req: Request, res: Response) => {
  const id: number = parseInt(req.params.id);
  try {
    const { firstName, lastName, mail, password, role_id, isPro } = req.body;
    await db.users.update({
      where: {
        id,
      },
      data: {
        firstName,
        lastName,
        mail,
        password: hashSync(password, 10),
        role_id,
        isPro,
      },
    });

    const updatedUser = await db.users.findUnique({
      where: {
        id,
      },
    });

    res.status(200).json(updatedUser);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: "User not updated" });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  const id: number = parseInt(req.params.id);
  try {
    const user = await db.users.delete({
      where: {
        id,
      },
    });
    res.status(200).json({ message: "User deleted : ", user });
  } catch (error: any) {
    res.status(500).json({ message: "User could not be deleted" });
  }
};

export const login = async (req: Request, res: Response) => {
  const { mail, password } = req.body;
  let user = await db.users.findFirst({ where: { mail } });
  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }
  // if (!compareSync(password, user.password)) {
  //   return res
  //     .status(400)
  //     .json({ message: "Invalid combination of mail and password" });
  // }
  const token = jwt.sign(
    { id: user.id, mail: user.mail },
    process.env.TOKEN_SECRET as string,
    { noTimestamp: true }
  );

  res.status(200).json({ token });
};
