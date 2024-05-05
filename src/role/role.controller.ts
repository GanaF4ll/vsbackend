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

export const createRole = async (role: Omit<Role, "id">): Promise<Role> => {
  const { name } = role;

  return db.role.create({
    data: {
      name,
    },
  });
};
