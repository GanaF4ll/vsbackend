import request from "supertest";
import { app } from "../app";
import { db } from "../app";
import bcrypt from "bcrypt";

describe("UserController", () => {
  let newUser: any;

  beforeAll(async () => {
    await db.$connect();
  });

  afterAll(async () => {
    await db.$disconnect();
  });

  beforeEach(async () => {
    newUser = await db.users.create({
      data: {
        firstName: "Test",
        lastName: "User",
        birthdate: new Date("1990-01-01"),
        password: await bcrypt.hash("Password?24", 10),
        mail: "test.user@example.com",
        role_id: 1,
        gender: "male",
      },
    });
  });

  afterEach(async () => {
    if (newUser) {
      await db.users.delete({
        where: { id: newUser.id },
      });
    }
  });

  ////////////////////////////////////////
  /////////////////GET////////////////////
  ////////////////////////////////////////

  describe("listUsers", () => {
    it("should return a list of users", async () => {
      const response = await request(app).get("/users/all");
      expect(response.status).toBe(200);
      expect(response.body).toEqual(
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
      const response = await request(app).get(`/users/${newUser.id}`);
      expect(response.status).toBe(200);
      expect(response.body).toEqual(
        expect.objectContaining({
          id: newUser.id,
          firstName: "Test",
          lastName: "User",
          birthdate: newUser.birthdate.toISOString(),
          mail: "test.user@example.com",
          role_id: 1,
          gender: "male",
        })
      );
    });

    it("should return 404 if user not found", async () => {
      const response = await request(app).get("/users/9999");
      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: "No user found with that id" });
    });
  });

  describe("getUserByName", () => {
    it("should return a list of users filtered by their name", async () => {
      const response = await request(app).get(
        `/users/name/${newUser.firstName}`
      );
      expect(response.status).toBe(200);
      const userIdsInResponse = response.body.map((user: any) => user.id);
      expect(userIdsInResponse).toContain(newUser.id);
    });

    it("should return 404 if user not found", async () => {
      const response = await request(app).get("/users/name/zzz");
      expect(response.status).toBe(404);
      expect(response.body).toEqual({
        message: "No user found with that name",
      });
    });
  });

  describe("getUserByMail", () => {
    it("should return a user by mail", async () => {
      const response = await request(app).get(`/users/mail/${newUser.mail}`);
      expect(response.status).toBe(200);
      expect(response.body.firstName).toBe(newUser.firstName);
      expect(response.body.lastName).toBe(newUser.lastName);
      expect(new Date(response.body.birthdate)).toEqual(newUser.birthdate);
      expect(response.body.mail).toBe(newUser.mail);
      expect(response.body.role_id).toBe(newUser.role_id);
      expect(response.body.gender).toBe(newUser.gender);
    });

    it("should return 404 if user not found", async () => {
      const response = await request(app).get("/users/mail/test");
      expect(response.status).toBe(404);
      expect(response.body).toEqual({
        message: "No user found with that email",
      });
    });
  });

  ////////////////////////////////////////
  /////////////////POST///////////////////
  ////////////////////////////////////////
  describe("signup", () => {
    it("should create a new user successfully", async () => {
      const response = await request(app).post("/users/signup").send({
        firstName: "John",
        lastName: "Doe",
        mail: "john.doe@example.com",
        password: "Password?24",
        role_id: 1,
        gender: "male",
        birthdate: "1990-01-01",
      });

      expect(response.status).toBe(201);
      expect(response.body).toEqual(
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
        where: { id: response.body.id },
      });
    });

    it("should return an error if the email already exists", async () => {
      const existingUser = await db.users.create({
        data: {
          firstName: "Existing",
          lastName: "User",
          mail: "existing.user@example.com", // Utilisez un email qui existe déjà
          password: await bcrypt.hash("Password?24", 10),
          role_id: 1,
          gender: "male",
          birthdate: new Date("1990-01-01"),
        },
      });

      const response = await request(app).post("/users/signup").send({
        firstName: "Jane",
        lastName: "Doe",
        mail: "existing.user@example.com", // Utilisez le même email
        password: "Password?24",
        role_id: 1,
        gender: "female",
        birthdate: "1990-01-01",
      });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        message: "ERROR: User already exists !",
      });

      // Clean up
      await db.users.delete({
        where: { id: existingUser.id },
      });
    });

    it("should return an error if the password is not strong enough", async () => {
      const response = await request(app).post("/users/signup").send({
        firstName: "John",
        lastName: "Weak",
        mail: "john.weakpass@example.com",
        password: "weakpass",
        role_id: 1,
        gender: "male",
        birthdate: "1990-01-01",
      });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        message: "ERROR: Password is not strong enough!",
      });
    });
  });
});
