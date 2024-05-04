import { db } from "../db/db.server";

type User = {
  id: number;
  firstName: string;
  lastName: string;
  mail: string;
  role: string;
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
  });
};
