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

export const getRoleById = async (id: number): Promise<Role | null> => {
  return db.role.findUnique({
    where: {
      id,
    },
  });
};
