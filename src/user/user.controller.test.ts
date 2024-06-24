import request from "supertest";
import { app } from "../app";
import { db } from "../app";

beforeAll(async () => {
  await db.$connect();
});

afterAll(async () => {
  await db.$disconnect();
});

describe("UserController.listUsers", () => {
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
