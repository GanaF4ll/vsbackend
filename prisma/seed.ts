import { db } from "../src/db/db.server";

type User = {
  firstName: string;
  lastName: string;
  birthdate: Date;
  mail: string;
  password: string;
  role: string;
};
