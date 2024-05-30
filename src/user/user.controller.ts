import { db } from "../app";
import * as bcrypt from "bcrypt";
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
        gender: true,
      },
    });
    res.status(200).json(users);
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ message: "No users found" });
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
  const { firstName, lastName, mail, password, role_id, gender } = req.body;
  console.log("====================================");
  console.log("password:", password);
  console.log("====================================");

  const hashedPassword = await bcrypt.hash(password, 10);

  console.log("====================================");
  console.log("hashPassword:", hashedPassword);
  console.log("====================================");
  let user = await db.users.findFirst({ where: { mail } });
  if (user) {
    res.status(400).json({ message: "ERROR: User already exists !" });
  }

  // const passwordRegex =
  //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{7,}$/;
  // if (!passwordRegex.test(password)) {
  //   return res
  //     .status(400)
  //     .json({ message: "ERROR: Password is not strong enough!" });
  // }

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
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, mail, password, role_id, gender } = req.body;

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{7,}$/;
    if (!passwordRegex.test(password)) {
      return res
        .status(400)
        .json({ message: "ERROR: Password is not strong enough!" });
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
    res.status(500).json({ message: "User not deleted" });
  }
};

export const login = async (req: Request, res: Response) => {
  const { mail, password } = req.body;
  let user = await db.users.findFirst({ where: { mail } });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const isPasswordMatch = await bcrypt.compare(password, user.password);

  if (!isPasswordMatch) {
    return res.status(401).json({ message: "Invalid password" });
  }

  const token = jwt.sign(
    { id: user.id, mail: user.mail, role: user.role_id },
    process.env.TOKEN_SECRET as string,
    { noTimestamp: true }
  );

  res.status(200).json({ token });
};

export const sentinelUnlock = async (req: Request, res: Response) => {
  const role_id = 5;
  const id = parseInt(req.params.id);
  let user = await db.users.findFirst({ where: { role_id } });
  try {
    await db.users.update({
      where: { id },
      data: {
        role_id,
      },
    });
    const updatedUser = await db.users.findUnique({ where: { id } });
    res
      .status(200)
      .json({ message: `User ${id} is now a SENTINEL:`, updatedUser });
  } catch (error) {}
};
