import { db } from "../db/db.server";

type Category = {
  id: number;
  name: string;
};

export const listCategories = async (): Promise<Category[]> => {
  return db.category.findMany({
    select: {
      id: true,
      name: true,
    },
  });
};

export const getCategoryById = async (id: number): Promise<Category | null> => {
  return db.category.findUnique({
    where: {
      id,
    },
  });
};

export const createCategory = async (
  category: Omit<Category, "id">
): Promise<Category> => {
  const { name } = category;

  return db.category.create({
    data: {
      name,
    },
    select: {
      id: true,
      name: true,
    },
  });
};

export const updateCategory = async (
  category: Omit<Category, "id">,
  id: number
): Promise<Category> => {
  const { name } = category;
  return db.category.update({
    where: {
      id,
    },
    data: {
      name,
    },
  });
};

export const deleteCategory = async (id: number): Promise<Category | null> => {
  return db.category.delete({
    where: {
      id,
    },
  });
};
