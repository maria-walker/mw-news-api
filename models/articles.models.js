const db = require("../db/connection");

exports.selectArticleById = async (article_id) => {
  let query_values = [];
  let queryStr = `SELECT articles.*, COUNT (comment_id) AS comment_count
  FROM articles
  LEFT JOIN comments ON articles.article_id = comments.article_id
  `;

  if (article_id) {
    queryStr += ` WHERE articles.article_id = $1`;
    query_values.push(article_id);
  }

  queryStr += `GROUP BY articles.article_id`;

  const articleResult = await db.query(queryStr, query_values);

  if (articleResult.rows.length === 0) {
    return Promise.reject({ status: 404, msg: "article not found" });
  }

  const articleWithCommentCount = articleResult.rows[0];

  articleWithCommentCount.comment_count =
    +articleWithCommentCount.comment_count;

  return articleWithCommentCount;
};

exports.addVotesToArticle = async (
  article_id,
  newVote,
  numberOfPropsOnRequestBody
) => {
  const article = await exports.selectArticleById(article_id);

  if (newVote === undefined || numberOfPropsOnRequestBody > 1) {
    return Promise.reject({ status: 400, msg: "invalid request body" });
  }

  const updatedVotes = article.votes + newVote;

  await db.query(`UPDATE articles SET votes = $1 WHERE article_id = $2;`, [
    updatedVotes,
    article_id,
  ]);

  article.votes += newVote;

  return article;
};
