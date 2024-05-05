import { db } from "../db/db.server";

type Role = {
  id: number;
  name: string;
};

export const listRoles = async (): Promise<Role[]> => {
  return db.role.findMany({
    select: {
      id: true,
      name: true,
    },
  });
};