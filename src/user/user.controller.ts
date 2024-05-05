import { db } from "../db/db.server";

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
  const {
    firstName,
    lastName,
    mail,
    birthdate = new Date(),
    password,
    role_id,
  } = user;

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
