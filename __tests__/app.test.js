const db = require("../db/connection.js");
const testData = require("../db/data/test-data/index.js");
const seed = require("../db/seeds/seed.js");
const request = require("supertest");
const app = require("../app.js");
const { endpoints } = require("../controllers/api.controllers");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("/api", () => {
  test("responds with JSON object of endpoints", async () => {
    const { body } = await request(app).get("/api").expect(200);

    expect(body).toEqual(endpoints);
  });
});

describe("/api/... - 404 for non-existent route/typos", () => {
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

describe("/api/articles/:article_id/comments", () => {
  describe("GET /api/articles/:article_id/comments", () => {
    test("200: responds with an array of comments, with specified properties", async () => {
      const { body } = await request(app)
        .get("/api/articles/9/comments")
        .expect(200);
      expect(body.comments.length).toBe(2);
      body.comments.forEach((comment) => {
        expect(comment).toEqual(
          expect.objectContaining({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String /*Date*/),
            author: expect.any(String),
            body: expect.any(String),
          })
        );
      });
    });
    test('400: "bad request" - for an invalid article_id', async () => {
      const { body } = await request(app)
        .get("/api/articles/not_an_article_id/comments")
        .expect(400);
      expect(body.msg).toBe("Bad request! (PSQL 22P02)");
    });
    test('404: "article not found" - for a valid but non-existent article_id', async () => {
      const { body } = await request(app)
        .get("/api/articles/9999/comments")
        .expect(404);
      expect(body.msg).toBe("article not found");
    });
    test("200: empty array for article with no comments", async () => {
      const { body } = await request(app)
        .get("/api/articles/2/comments")
        .expect(200);
      expect(body.comments).toHaveLength(0);
    });
  });
  describe("POST /api/articles/:article_id/comments", () => {
    test("201: responds with the posted comment (username and body of comment", async () => {
      const { body } = await request(app)
        .post("/api/articles/1/comments")
        .send({ username: "lurker", body: "this is my comment for article 1" })
        .expect(201);
      expect(body.comment).toEqual(
        expect.objectContaining({
          author: expect.any(String),
          body: expect.any(String),
          created_at: expect.any(String),
        })
      );
    });
    test('400: "bad request" - for invalid comment request - username and/or comment body are empty strings', async () => {
      const { body } = await request(app)
        .post("/api/articles/1/comments")
        .send({ username: "", body: "" })
        .expect(400);
      expect(body.msg).toBe("invalid comment request");
    });
    test('400: "bad request" - for invalid comment request - username and/or comment body are not strings', async () => {
      const { body } = await request(app)
        .post("/api/articles/1/comments")
        .send({ username: 5, body: 7 })
        .expect(400);
      expect(body.msg).toBe("invalid comment request");
    });
    test('400: "bad request" - for invalid comment request - more than 2 properties are passed on comment request', async () => {
      const { body } = await request(app)
        .post("/api/articles/1/comments")
        .send({
          username: "lurker",
          body: "not a valid comment request",
          another_key: "not allowed",
        })
        .expect(400);
      expect(body.msg).toBe("invalid comment request");
    });
    test('400: "bad request" - username or body are left off the comment request', async () => {
      const { body } = await request(app)
        .post("/api/articles/1/comments")
        .send({
          body: "not a valid comment request",
          another_key: "not allowed",
        })
        .expect(400);
      expect(body.msg).toBe("invalid comment request");
    });
    test('400: "bad request" - for trying to post a comment to an invalid article_id', async () => {
      const { body } = await request(app)
        .post("/api/articles/not_an_id/comments")
        .send({
          username: "lurker",
          body: "my comment for invalid article!!",
        })
        .expect(400);
      expect(body.msg).toBe("Bad request! (PSQL 22P02)");
    });
    test('404: "article not found" - for trying to post a comment to a valid but non-existent article_id', async () => {
      const { body } = await request(app)
        .post("/api/articles/9999/comments")
        .send({
          username: "lurker",
          body: "my comment for non-existent article!!",
        })
        .expect(404);
      expect(body.msg).toBe("article not found");
    });
    test('404: "user not found" - for trying to post a comment from a non-existent username', async () => {
      const { body } = await request(app)
        .post("/api/articles/1/comments")
        .send({
          username: "not_a_user",
          body: "comment from a non-user",
        })
        .expect(404);
      expect(body.msg).toBe("username not found");
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
