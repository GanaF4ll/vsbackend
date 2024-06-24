import request from "supertest";
import { app } from "../app";
import { db } from "../app";
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
        password: "Password?24",
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
  });
});
