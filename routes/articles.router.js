const express = require("express");

const {
  getArticleById,
  patchArticleWithVotes,
  getArticles,
} = require("../controllers/articles.controllers");

const articlesRouter = express.Router();

articlesRouter.route("/").get(getArticles);

articlesRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(patchArticleWithVotes);

module.exports = articlesRouter;
