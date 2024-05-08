import { db } from "../db/db.server";
import { Request, Response } from "express";

export const listRoles = async (req: Request, res: Response) => {
  try {
    const roles = await db.roles.findMany({
      select: {
        id: true,
        name: true,
      },
    });
    res.status(200).json(roles);
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ message: "No role found" });
  }
};

export const getRoleById = async (req: Request, res: Response) => {
  try {
    const role = await db.roles.findUnique({
      where: {
        id: parseInt(req.params.id),
      },
      select: {
        id: true,
        name: true,
      },
    });
    res.status(200).json(role);
  } catch (error: any) {
    res.status(404).json({ message: "No role found with that id" });
  }
};

export const createRole = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    const role = await db.roles.create({
      data: {
        name,
      },
    });
    res.status(201).json(role);
  } catch (error: any) {
    res.status(500).json({ message: "ERROR: Could not create the role" });
  }
};

export const updateRole = async (req: Request, res: Response) => {
  const id: number = parseInt(req.params.id);

  try {
    const { name } = req.body;
    await db.roles.update({
      where: {
        id,
      },
      data: {
        id,
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
    res.status(500).json({ message: "Role could not be updated" });
  }
};

export const deleteRole = async (req: Request, res: Response) => {
  const id: number = parseInt(req.params.id);
  try {
    const role = await db.roles.delete({
      where: {
        id,
      },
    });
    res.status(200).json({ message: "Role deleted: ", role });
  } catch (error: any) {
    res.status(500).json({ message: "Role could not be deleted" });
  }
};
