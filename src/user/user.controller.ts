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
};

export const listUsers = async (): Promise<User[]> => {
  return db.user.findMany({
    select: {
      id: true,
      firstName: true,
      lastName: true,
      birthdate: true,
      mail: true,
      password: true,
      role_id: true,
    },
  });
};

export const getUserById = async (id: number): Promise<User | null> => {
  return db.user.findUnique({
    where: {
      id,
    },
  });
};

export const createUser = async (user: Omit<User, "id">): Promise<User> => {
  const { firstName, lastName, mail, password, role_id } = user;

  let birthdate: Date;
  if (user.birthdate) {
    birthdate = new Date(user.birthdate);
  } else {
    birthdate = new Date();
  }

  return db.user.create({
    data: {
      firstName,
      lastName,
      mail,
      birthdate,
      password,
      role_id,
    },
  });
};

export async function updateUser(
  user: Omit<User, "id">,
  id: number
): Promise<User> {
  const { firstName, lastName, mail, password, role_id } = user;

  let birthdate: Date;
  if (user.birthdate) {
    birthdate = new Date(user.birthdate);
  } else {
    birthdate = new Date();
  }

  return db.user.update({
    where: { id },
    data: {
      firstName,
      lastName,
      mail,
      birthdate,
      password,
      role_id,
    },
  });
}

export const deleteUser = async (id: number): Promise<User> => {
  return db.user.delete({
    where: {
      id,
    },
  });
};

export const login = async (req: Request, res: Response) => {
  const { mail, password } = req.body;
  let user = await db.user.findFirst({ where: { mail } });
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
