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
      const { body } = await request(app).get("/api/articles/9").expect(200);
      expect(body.article).toEqual(
        expect.objectContaining({
          author: expect.any(String),
          title: "They're not exactly dogs, are they?",
          article_id: expect.any(Number),
          body: expect.any(String),
          topic: expect.any(String),
          created_at: expect.any(String /*Date*/),
          votes: expect.any(Number),
          comment_count: 2,
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
      const { body } = await request(app)
        .patch("/api/articles/6")
        .send({ inc_votes: 15 })
        .expect(200);
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
      const prevVotes = 0;

      const { body } = await request(app)
        .patch("/api/articles/6")
        .send({ inc_votes: 15 })
        .expect(200);
      expect(body.article.votes).toBe(15);
    });

    test('400: "bad request" - for an invalid number of votes', async () => {
      const { body } = await request(app)
        .patch("/api/articles/not_an_article_id")
        .send({ inc_votes: "not_a_number" })
        .expect(400);
      expect(body.msg).toBe("Bad request! (PSQL 22P02)");
    });

    test('400: "bad request" - for request with no "inc_votes" on the request body', async () => {
      const { body } = await request(app)
        .patch("/api/articles/6")
        .send({ random_key: 13 })
        .expect(400);
      expect(body.msg).toBe("invalid request body");
    });
    test('400: "bad request" - for request with other keys in addition to "inc_votes" on the request body', async () => {
      const { body } = await request(app)
        .patch("/api/articles/6")
        .send({ inc_votes: 15, random_key: "shouldn't be here" })
        .expect(400);
      expect(body.msg).toBe("invalid request body");
    });
  });
});

describe("GET /api/articles", () => {
  test("200: responds with an array of articles, with specified properties", async () => {
    const { body } = await request(app).get("/api/articles").expect(200);
    expect(body.articles.length).toBe(12);
    body.articles.forEach((article) => {
      expect(article).toEqual(
        expect.objectContaining({
          author: expect.any(String),
          title: expect.any(String),
          article_id: expect.any(Number),
          topic: expect.any(String),
          created_at: expect.any(String /*Date*/),
          votes: expect.any(Number),
          comment_count: expect.any(Number),
        })
      );
    });
  });
  test("200: articles are sorted by date (descending) by default ", async () => {
    const { body } = await request(app).get("/api/articles").expect(200);
    expect(body.articles[0].article_id).toBe(3);
    expect(body.articles).toBeSortedBy("created_at", { descending: true });
  });
  test("200: articles are sorted according to sort_by query(if provided) and order (if provided) ", async () => {
    const { body } = await request(app)
      .get("/api/articles?sort_by=article_id&order=asc")
      .expect(200);

    expect(body.articles[0].article_id).toBe(1);

    expect(body.articles).toBeSortedBy("article_id", { ascending: true });
  });
  test("200: articles are filtered by topic(if provided) and sorted according to sort_by query(if provided) and order (if provided)", async () => {
    const { body } = await request(app)
      .get("/api/articles?topic=cats&sort_by=article_id&order=asc")
      .expect(200);

    expect(body.articles[0].article_id).toBe(5);
    expect(body.articles[0].topic).toBe("cats");
    expect(body.articles).toBeSortedBy("article_id", { ascending: true });
  });
  test('400: "bad request" - for an invalid sort_by column', async () => {
    const { body } = await request(app)
      .get("/api/articles?sort_by=not_a_column")
      .expect(400);
    expect(body.msg).toBe("Invalid sort query: column doesn't exist");
  });
  test('400: "bad request" - for an invalid order query', async () => {
    const { body } = await request(app)
      .get("/api/articles?order=not_asc_or_desc")
      .expect(400);
    expect(body.msg).toBe("Invalid order query");
  });
  test('404: "topic not found" - for filtering by non-existent topic', async () => {
    const { body } = await request(app)
      .get("/api/articles?topic=dogs")
      .expect(404);
    expect(body.msg).toBe("Topic not found");
  });
  test("200: empty array for filtering by an existing topic that doesn't have any articles attributed to it", async () => {
    const { body } = await request(app)
      .get("/api/articles?topic=paper")
      .expect(200);
    expect(body.articles).toHaveLength(0);
  });
});
