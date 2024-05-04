import { db } from "../db/db.server";

type User = {
  id: number;
  firstName: string;
  lastName: string;
};

const listUsers = async (): Promise<User[]> => {
  return db.users.findMany({
    select: {
      id: true,
      firstName: true,
      lastName: true,
    },
  });
};
