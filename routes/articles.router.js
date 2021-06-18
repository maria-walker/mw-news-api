const express = require("express");

const {
  getArticleById,
  patchArticleWithVotes,
  getArticles,
} = require("../controllers/articles.controllers");

const {
  getCommentsByArticle,
  postComment,
} = require("../controllers/comments.controllers");

const articlesRouter = express.Router();

articlesRouter.route("/").get(getArticles);

articlesRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(patchArticleWithVotes);

articlesRouter
  .route("/:article_id/comments")
  .get(getCommentsByArticle)
  .post(postComment);

module.exports = articlesRouter;
