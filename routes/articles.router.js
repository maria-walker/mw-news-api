const express = require("express");

const {
  getArticleById,
  patchArticleWithVotes,
} = require("../controllers/articles.controllers");

const articlesRouter = express.Router();

articlesRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(patchArticleWithVotes);

module.exports = articlesRouter;
