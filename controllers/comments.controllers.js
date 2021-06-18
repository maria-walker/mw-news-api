const {
  selectCommentsByArticle,
  submitComment,
} = require("../models/comments.models");

function getCommentsByArticle(req, res, next) {
  const { article_id } = req.params;

  selectCommentsByArticle(article_id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch(next);
}

function postComment(req, res, next) {
  const { article_id } = req.params;
  const { username, body } = req.body;
  const areRequestKeysValid =
    Object.keys(req.body).includes("username") &&
    Object.keys(req.body).includes("body") &&
    Object.keys(req.body).length === 2;

  submitComment(article_id, username, body, areRequestKeysValid)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch(next);
}

module.exports = { getCommentsByArticle, postComment };
