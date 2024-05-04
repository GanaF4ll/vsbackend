import { db } from "../db/db.server";

type User = {
  id: number;
  firstName: string;
  lastName: string;
  mail: string;
  role: string;
  birthdate?: Date;
  password?: string;
};

export const listUsers = async (): Promise<User[]> => {
  return db.users.findMany({
    select: {
      id: true,
      firstName: true,
      lastName: true,
      mail: true,
      role: true,
    },
  });
};

export const getUserById = async (id: number): Promise<User | null> => {
  return db.users.findUnique({
    where: {
      id,
    },
    // select: {
    //   id: true,
    //   firstName: true,
    //   lastName: true,
    //   mail: true,
    //   role: true,
    // },
  });
};

export const createUser = async (user: Omit<User, "id">): Promise<User> => {
  const { firstName, lastName, mail, birthdate, password, role } = user;
  return db.users.create({
    data: {
      firstName,
      lastName,
      mail,
      birthdate: birthdate ?? "",
      password: password || "",
      role,
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      mail: true,
      role: true,
      birthdate: true,
      password: true,
    },
  });
};

export const updateUser = async (
  user: Omit<User, "id">,
  id: number
): Promise<User> => {
  const { firstName, lastName, mail, birthdate, password, role } = user;
  return db.users.update({
    where: {
      id,
    },
    data: {
      firstName,
      lastName,
      mail,
      birthdate: birthdate ?? "",
      password: password || "",
      role,
    },
  });
};
