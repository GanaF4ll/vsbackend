import { db } from "../src/db/db.server";

type User = {
  firstName: string;
  lastName: string;
  birthdate: Date;
  mail: string;
  password: string;
  role: string;
};

function getUsers(): Array<User> {
  return [
    {
      firstName: "Seto",
      lastName: "Kaiba",
      birthdate: new Date("1990-01-01"),
      mail: "setokaiba@gmail.com",
      password: "blueeyeswhite123",
      role: "user",
    },
    {
      firstName: "Ichigo",
      lastName: "Kurosaki",
      birthdate: new Date("1990-01-01"),
      mail: "kurosaki@gmail.com",
      password: "bankai123",
      role: "user",
    },
  ];
}

async function seedUsers() {
  const users = getUsers();
  for (const user of users) {
    await db.users.create({
      data: {
        firstName: user.firstName,
        lastName: user.lastName,
        birthdate: user.birthdate,
        mail: user.mail,
        password: user.password,
        role: user.role,
      },
    });
  }
  const author = await db.users.findFirst({
    where: {
      firstName: "Seto",
    },
  });
}
seedUsers();
