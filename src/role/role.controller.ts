import { db } from "../db/db.server";
import { Request, Response } from "express";

export const listRoles = async (req: Request, res: Response) => {
  try {
    const roles = db.roles.findMany({
      select: {
        id: true,
        name: true,
      },
    });
    res.status(200).json(roles);
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ message: "No roles found" });
  }
};

export const getRoleById = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  try {
    const role = await db.roles.findUnique({
      where: {
        id,
      },
    });
    res.status(200).json(role);
  } catch (error: any) {
    console.error(error);
    res.status(404).json({ message: "No role found with that id" });
  }
};

export const createRole = async (req: Request, res: Response) => {
  const { name } = req.body;

  let role = await db.roles.findFirst({ where: { name } });
  if (!role) {
    const newRole = await db.roles.create({
      data: {
        name,
      },
      select: {
        id: true,
        name: true,
      },
    });
    res.status(201).json(newRole);
  } else {
    res.status(400).json({ message: "ERROR: Role already exists !" });
  }
};

export const updateRole = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const { name } = req.body;
  try {
    await db.roles.update({
      where: { id },
      data: {
        name,
      },
    });
    const updatedRole = await db.roles.findUnique({
      where: {
        id,
      },
    });
    res.status(200).json(updatedRole);
  } catch (error: any) {
    console.error(error);
    res.status(404).json({ message: "No role found with that id" });
  }
};

export const deleteRole = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  try {
    await db.roles.delete({
      where: {
        id,
      },
    });
    res.status(204).json({ message: "Role deleted" });
  } catch (error: any) {
    console.error(error);
    res.status(404).json({ message: "No role found with that id" });
  }
};
