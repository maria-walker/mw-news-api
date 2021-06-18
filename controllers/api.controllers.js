const getEndpoints = (req, res, next) => {
  res.status(200).send(endpoints);
};

const endpoints = {
  "GET /api": {
    description:
      "serves up a json representation of all the available endpoints of the api",
  },
  "GET /api/topics": {
    description: "serves an array of all topics",
    queries: [],
    exampleResponse: {
      topics: [{ slug: "football", description: "Footie!" }],
    },
  },
  "GET /api/articles": {
    description: "serves an array of all articles",
    queries: ["topic", "sort_by", "order"],
    exampleResponse: {
      articles: [
        {
          author: "weegembump",
          title: "Seafood substitutions are increasing",
          article_id: 5,
          created_at: 1527695953341,
          votes: 0,
          comment_count: 2,
        },
      ],
    },
  },
  "GET /api/articles/:article_id": {
    description: "serves the article matching provided article_id",
    queries: [],
    exampleResponse: {
      article: {
        author: "weegembump",
        title: "Seafood substitutions are increasing",
        article_id: 5,
        body: "Text from the article..",
        created_at: 1527695953341,
        votes: 0,
        comment_count: 2,
      },
    },
  },
  "PATCH /api/articles/:article_id": {
    description:
      "adds votes to the vote count for the article matching provided article_id (deducts votes if negative amount is submitted",
    queries: [],
    exampleRequest: { inc_votes: 100 },
    exampleResponse: {
      article: {
        author: "weegembump",
        title: "Seafood substitutions are increasing",
        article_id: 5,
        body: "Text from the article..",
        created_at: 1527695953341,
        votes: 100,
        comment_count: 2,
      },
    },
  },
  "GET /api/articles/:article_id/comments": {
    description: "serves comments for the article matching provided article_id",
    queries: [],
    exampleResponse: {
      comments: [
        {
          comment_id: 5,
          votes: 0,
          created_at: 1527695953341,
          author: "weegembump",
          body: "Text from the article..",
        },
      ],
    },
  },
  "POST /api/articles/:article_id/comments": {
    description: "posts a comment for the article matching provided article_id",
    queries: [],
    exampleRequest: { username: "maria", comment: "my comment..." },
    exampleResponse: {
      comment: {
        author: "maria",
        body: "my comment...",
        created_at: 1527695953341,
      },
    },
  },
};

module.exports = { getEndpoints, endpoints };
