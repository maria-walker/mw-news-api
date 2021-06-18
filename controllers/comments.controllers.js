const { selectCommentsByArticle } = require("../models/comments.models");

function getCommentsByArticle(req, res, next) {
  const { article_id } = req.params;

  selectCommentsByArticle(article_id)
    .then((comments) => {
      res.status(200).send({ comments: comments });
    })
    .catch(next);
}

module.exports = { getCommentsByArticle };
