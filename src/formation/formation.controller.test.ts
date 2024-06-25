import request from "supertest";
import { app, server, db } from "../app";
// import { after } from "node:test";

describe("FormationController", () => {
  let formationMock: any;

  beforeAll(async () => {
    await db.$connect();
  });

  afterAll(async () => {
    await db.$disconnect();
    server.close();
  });

  beforeEach(async () => {
    formationMock = await db.formations.create({
      data: {
        title: "Test Formation",
        description: "This is a test formation",
        completionTime: 10,
        difficulty: "easy",
        coverImage: "formation1.jpg",
        qualityRating: 5,
        video: "video.mp4",
        author_id: 1,
        category_id: 1,
      },
    });
  });

  afterEach(async () => {
    if (formationMock) {
      await db.formations.delete({
        where: { id: formationMock.id },
      });
    }
  });

  describe("listFormations", () => {
    it("should return a list of formations", async () => {
      const res = await request(app).get("/formations/all");
      expect(res.status).toBe(200);
      expect(res.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(Number),
            author_id: expect.any(Number),
            title: expect.any(String),
            description: expect.any(String),
            video: expect.any(String),
            category_id: expect.any(Number),
            difficulty: expect.any(String),
            completionTime: expect.any(Number),
            qualityRating: expect.any(Number),
            coverImage: expect.any(String),
          }),
        ])
      );
    });
  });
});
