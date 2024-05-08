import { db } from "../db/db.server";

type Role = {
  id: number;
  name: string;
};

export const listRoles = async (): Promise<Role[]> => {
  return db.roles.findMany({
    select: {
      id: true,
      name: true,
    },
  });
};

export const getRoleById = async (id: number): Promise<Role | null> => {
  return db.roles.findUnique({
    where: {
      id,
    },
  });
};

export const createRole = async (role: Omit<Role, "id">): Promise<Role> => {
  const { name } = role;

  return db.roles.create({
    data: {
      name,
    },
    select: {
      id: true,
      name: true,
    },
  });
};

export const updateRole = async (
  role: Omit<Role, "id">,
  id: number
): Promise<Role> => {
  const { name } = role;
  return db.roles.update({
    where: {
      id,
    },
    data: {
      name,
    },
  });
};

export const deleteRole = async (id: number): Promise<Role | null> => {
  return db.roles.delete({
    where: {
      id,
    },
  });
};
