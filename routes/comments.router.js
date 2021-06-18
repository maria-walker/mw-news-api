const express = require("express");

const { getCommentsByArticle } = require("../controllers/comments.controllers");

const commentsRouter = express.Router();

commentsRouter.route("/").get(getCommentsByArticle);
//.post(postComment)

module.exports = commentsRouter;
