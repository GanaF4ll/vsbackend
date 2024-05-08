import { db } from "../db/db.server";
import { hashSync, compareSync } from "bcrypt";
import * as jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { Request, Response } from "express";

dotenv.config();

type User = {
  id: number;
  firstName: string;
  lastName: string;
  birthdate: Date;
  mail: string;
  password: string;
  role_id: number;
  isPro: boolean;
};

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

export async function updateUser(
  user: Omit<User, "id">,
  id: number
): Promise<User> {
  const { firstName, lastName, mail, password, role_id, isPro } = user;

  let birthdate: Date;
  if (user.birthdate) {
    birthdate = new Date(user.birthdate);
  } else {
    birthdate = new Date();
  }

  return db.users.update({
    where: { id },
    data: {
      firstName,
      lastName,
      mail,
      birthdate,
      password,
      role_id,
      isPro,
    },
  });
}

export const deleteUser = async (id: number): Promise<User> => {
  return db.users.delete({
    where: {
      id,
    },
  });
};

export const login = async (req: Request, res: Response) => {
  const { mail, password } = req.body;
  let user = await db.users.findFirst({ where: { mail } });
  if (!user) {
    throw new Error("User not found");
  }
  if (!compareSync(password, user.password)) {
    throw new Error("Invalid combination of mail and password");
  }
  const token = jwt.sign(
    { id: user.id, mail: user.mail },
    process.env.TOKEN_SECRET as string
  );

  res.json({ token });
};
