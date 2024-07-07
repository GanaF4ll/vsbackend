import request from "supertest";
import { app, server, db } from "../app";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

describe("UserController", () => {
  let userMock: any;
  let token: string;

  beforeAll(async () => {
    await db.$connect();
  });

  afterAll(async () => {
    await db.$disconnect();
    server.close();
  });

  beforeEach(async () => {
    const plainPassword = "Password?24";
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    userMock = await db.users.create({
      data: {
        firstName: "Test",
        lastName: "User",
        birthdate: new Date("1990-01-01"),
        password: hashedPassword,
        mail: "test.user@example.com",
        role_id: 1,
        gender: "male",
      },
    });

    const loginRes = await request(app).post("/users/login").send({
      mail: userMock.mail,
      password: plainPassword,
    });
    token = loginRes.body.token;
  });

  afterEach(async () => {
    if (userMock) {
      await db.users.delete({
        where: { id: userMock.id },
      });
    }
  });

  ////////////////////////////////////////
  /////////////////GET////////////////////
  ////////////////////////////////////////

  describe("listUsers", () => {
    it("should return a list of users", async () => {
      const res = await request(app).get("/users/all");
      expect(res.status).toBe(200);
      expect(res.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(Number),
            firstName: expect.any(String),
            lastName: expect.any(String),
            birthdate: expect.any(String),
            mail: expect.any(String),
            role_id: expect.any(Number),
            gender: expect.any(String),
          }),
        ])
      );
    });
  });

  describe("getUserById", () => {
    it("should return a user by ID", async () => {
      const res = await request(app).get(`/users/${userMock.id}`);
      expect(res.status).toBe(200);
      expect(res.body).toEqual(
        expect.objectContaining({
          id: userMock.id,
          firstName: userMock.firstName,
          lastName: userMock.lastName,
          birthdate: userMock.birthdate.toISOString(),
          mail: userMock.mail,
          role_id: userMock.role_id,
          gender: userMock.gender,
        })
      );
    });

    it("should return 404 if user not found", async () => {
      const res = await request(app).get("/users/9999");
      expect(res.status).toBe(404);
      expect(res.body).toEqual({ message: "No user found with that id" });
    });
  });

  describe("getUserByName", () => {
    it("should return a list of users filtered by their name", async () => {
      const res = await request(app).get(`/users/name/${userMock.firstName}`);
      expect(res.status).toBe(200);
      const userIdsInres = res.body.map((user: any) => user.id);
      expect(userIdsInres).toContain(userMock.id);
    });

    it("should return 404 if user not found", async () => {
      const res = await request(app).get("/users/name/zzz");
      expect(res.status).toBe(404);
      expect(res.body).toEqual({
        message: "No user found with that name",
      });
    });
  });

  describe("getUserByMail", () => {
    it("should return a user by mail", async () => {
      const res = await request(app).get(`/users/mail/${userMock.mail}`);
      expect(res.status).toBe(200);
      expect(res.body.firstName).toBe(userMock.firstName);
      expect(res.body.lastName).toBe(userMock.lastName);
      expect(new Date(res.body.birthdate)).toEqual(userMock.birthdate);
      expect(res.body.mail).toBe(userMock.mail);
      expect(res.body.role_id).toBe(userMock.role_id);
      expect(res.body.gender).toBe(userMock.gender);
    });

    it("should return 404 if user not found", async () => {
      const res = await request(app).get("/users/mail/test");
      expect(res.status).toBe(404);
      expect(res.body).toEqual({
        message: "No user found with that email",
      });
    });
  });

  ////////////////////////////////////////
  /////////////////POST///////////////////
  ////////////////////////////////////////
  describe("signup", () => {
    it("should create a new user successfully", async () => {
      const res = await request(app).post("/users/signup").send({
        firstName: "John",
        lastName: "Doe",
        mail: "john.doe@example.com",
        password: "Password?24",
        role_id: 1,
        gender: "male",
        birthdate: "1990-01-01",
      });

      expect(res.status).toBe(201);
      expect(res.body).toEqual(
        expect.objectContaining({
          id: expect.any(Number),
          firstName: "John",
          lastName: "Doe",
          mail: "john.doe@example.com",
          role_id: 1,
          gender: "male",
          birthdate: "1990-01-01T00:00:00.000Z",
        })
      );

      // Clean up
      await db.users.delete({
        where: { id: res.body.id },
      });
    });

    it("should return an error if the email already exists", async () => {
      const existingUser = await db.users.create({
        data: {
          firstName: "Existing",
          lastName: "User",
          mail: "existing.user@example.com",
          password: await bcrypt.hash("Password?24", 10),
          role_id: 1,
          gender: "male",
          birthdate: new Date("1990-01-01"),
        },
      });

      const res = await request(app).post("/users/signup").send({
        firstName: "Jane",
        lastName: "Doe",
        mail: "existing.user@example.com",
        password: "Password?24",
        role_id: 1,
        gender: "female",
        birthdate: "1990-01-01",
      });

      expect(res.status).toBe(400);
      expect(res.body).toEqual({
        message: "ERROR: User already exists!",
      });

      // Clean up
      await db.users.delete({
        where: { id: existingUser.id },
      });
    });

    it("should return an error if the password is not strong enough", async () => {
      const res = await request(app).post("/users/signup").send({
        firstName: "John",
        lastName: "Weak",
        mail: "john.weakpass@example.com",
        password: "weakpass",
        role_id: 1,
        gender: "male",
        birthdate: "1990-01-01",
      });

      expect(res.status).toBe(400);
      expect(res.body).toEqual({
        message: "ERROR: Password is not strong enough!",
      });
    });
  });

  describe("login", () => {
    it("should log in successfully with correct credentials", async () => {
      const res = await request(app).post("/users/login").send({
        mail: "test.user@example.com",
        password: "Password?24",
      });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("token");

      const decodedToken = jwt.verify(
        res.body.token,
        process.env.TOKEN_SECRET as string
      );

      expect(decodedToken).toEqual(
        expect.objectContaining({
          id: userMock.id,
          mail: userMock.mail,
          role: userMock.role_id,
        })
      );
    });

    it("should return 404 if user is not found", async () => {
      const res = await request(app).post("/users/login").send({
        mail: "nonexistent@example.com",
        password: "Password?24",
      });

      expect(res.status).toBe(404);
      expect(res.body).toEqual({ message: "User not found" });
    });

    it("should return 401 if the password is incorrect", async () => {
      const res = await request(app).post("/users/login").send({
        mail: "test.user@example.com",
        password: "WrongPassword",
      });

      expect(res.status).toBe(401);
      expect(res.body).toEqual({ message: "Invalid mail or password" });
    });
  });

  ////////////////////////////////////////
  /////////////////PUT////////////////////
  ////////////////////////////////////////

  describe("updateUser", () => {
    it("should update a user successfully", async () => {
      const res = await request(app)
        .put(`/users/${userMock.id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          firstName: "Updated",
          lastName: "User",
          mail: "updated.user@example.com",
          password: "NewPassword?24",
          role_id: 2,
          gender: "female",
          birthdate: "1992-01-01",
        });

      expect(res.status).toBe(200);
      expect(res.body).toEqual(
        expect.objectContaining({
          id: userMock.id,
          firstName: "Updated",
          lastName: "User",
          mail: "updated.user@example.com",
          role_id: 2,
          gender: "female",
          birthdate: "1992-01-01T00:00:00.000Z",
        })
      );
    });

    it("should return an error if the password is not strong enough", async () => {
      const res = await request(app)
        .put(`/users/${userMock.id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          firstName: "Updated",
          lastName: "User",
          mail: "updated.user@example.com",
          password: "weakpass",
          role_id: 2,
          gender: "female",
          birthdate: "1992-01-01",
        });

      expect(res.status).toBe(400);
      expect(res.body).toEqual({
        message: "ERROR: Password is not strong enough!",
      });
    });

    it("should return 404 if user to be updated does not exist", async () => {
      const res = await request(app)
        .put("/users/9999")
        .set("Authorization", `Bearer ${token}`)
        .send({
          firstName: "Updated",
          lastName: "User",
          mail: "updated.user@example.com",
          password: "NewPassword?24",
          role_id: 2,
          gender: "female",
          birthdate: "1992-01-01",
        });

      expect(res.status).toBe(404);
      expect(res.body).toEqual({ message: "No user found with that id" });
    });
  });
});
