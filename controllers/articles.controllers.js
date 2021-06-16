const {
  selectArticleById,
  addVotesToArticle,
} = require("../models/articles.models");

function getArticleById(req, res, next) {
  const { article_id } = req.params;

  selectArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article: article });
    })
    .catch(next);
}

function patchArticleWithVotes(req, res, next) {
  const { article_id } = req.params;
  const newVote = req.body.inc_votes;
  const numberOfPropsOnRequestBody = Object.keys(req.body).length;

  addVotesToArticle(article_id, newVote, numberOfPropsOnRequestBody)
    .then((article) => {
      res.status(200).send({ article: article });
    })
    .catch(next);
}

module.exports = { getArticleById, patchArticleWithVotes };
