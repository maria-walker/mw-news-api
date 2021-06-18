const {
  selectArticleById,
  addVotesToArticle,
  fetchArticles,
} = require("../models/articles.models");

function getArticleById(req, res, next) {
  const { article_id } = req.params;

  selectArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
}

function patchArticleWithVotes(req, res, next) {
  const { article_id } = req.params;
  const newVote = req.body.inc_votes;
  const numberOfPropsOnRequestBody = Object.keys(req.body).length;

  addVotesToArticle(article_id, newVote, numberOfPropsOnRequestBody)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
}

function getArticles(req, res, next) {
  //sort_by
  //order
  //topic

  const { sort_by, order, topic } = req.query;

  fetchArticles(sort_by, order, topic)
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch(next);
}

module.exports = { getArticleById, patchArticleWithVotes, getArticles };
