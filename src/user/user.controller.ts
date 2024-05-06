import { db } from "../db/db.server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

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
  try {
    const user = await db.user.findFirst({
      where: {
        mail: req.body.mail,
      },
    });

    if (
      !user ||
      !(await bcrypt.compare(req.body.password, admin.password as String))
    ) {
      res
        .status(401)
        .json({ message: "Incorrect combination of email and password" });
      return;
    }

    const userData = {
      id: user.id,
      mail: user.mail,
    };

    const token = jwt.sign(adminData, process.env.TOKEN_SECRET as string, {
      expiresIn: "48h",
    });
    res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred during the connection attempt" });
  }
};
