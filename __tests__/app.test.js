const db = require("../db/connection.js");
const testData = require("../db/data/test-data/index.js");
const seed = require("../db/seeds/seed.js");
const request = require("supertest");
const app = require("../app.js");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("/api/...", () => {
  test("404 for non-existent route/typos", async () => {
    const { body } = await request(app).get("/not-a-route").expect(404);
    expect(body.msg).toBe("route not found");
  });
});

describe("GET /api/topics", () => {
  test("200: responds with an array of topics", async () => {
    const { body } = await request(app).get("/api/topics").expect(200);
    expect(body.topics.length).toBe(3);
    body.topics.forEach((topic) => {
      expect(topic).toEqual(
        expect.objectContaining({
          slug: expect.any(String),
          description: expect.any(String),
        })
      );
    });
  });
});

describe("GET /api/users/:username", () => {
  test("200: responds with the data object for the required user", async () => {
    const { body } = await request(app).get("/api/users/lurker").expect(200);
    expect(body.user).toEqual({
      username: "lurker",
      name: "do_nothing",
      avatar_url:
        "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
    });
  });
  test("404 - user not found:for non-existent user request", async () => {
    const { body } = await request(app).get("/api/users/maria").expect(404);
    expect(body.msg).toBe("user not found");
  });
});

describe("/api/articles/:article_id", () => {
  describe("GET /api/articles/:article_id", () => {
    test("200: responds with the data object for the required article", async () => {
      const { body } = await request(app).get("/api/articles/6").expect(200);
      expect(body.article).toEqual(
        expect.objectContaining({
          author: expect.any(String),
          title: expect.any(String),
          article_id: expect.any(Number),
          body: expect.any(String),
          topic: expect.any(String),
          created_at: expect.any(String /*Date*/),
          votes: expect.any(Number),
          comment_count: expect.any(Number),
        })
      );
    });
    test('400: "bad request" - for an invalid article_id', async () => {
      const { body } = await request(app)
        .get("/api/articles/not_an_article_id")
        .expect(400);
      expect(body.msg).toBe("Bad request! (PSQL 22P02)");
    });
    test('404: "article not found" - for a valid but non-existent article_id', async () => {
      const { body } = await request(app).get("/api/articles/9999").expect(404);
      expect(body.msg).toBe("article not found");
    });
  });
  describe("PATCH /api/articles/:article_id", () => {
    test("200: responds with the data object for the updated article as requested", async () => {
      const { body } = await request(app).patch("/api/articles/6").expect(200);
      expect(body.article).toEqual(
        expect.objectContaining({
          author: expect.any(String),
          title: expect.any(String),
          article_id: expect.any(Number),
          body: expect.any(String),
          topic: expect.any(String),
          created_at: expect.any(String /*Date*/),
          votes: expect.any(Number),
          comment_count: expect.any(Number),
        })
      );
    });

    test("200: number of votes gets increased by the newVote if passed in request body", async () => {
      const prevVotes = req.body.inc_count;
      const newVote = 5;
      const { body } = await request(app).patch("/api/articles/6").expect(200);
      expect(body.article.votes).toBe();
    });
  });
});
