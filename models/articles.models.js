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

  // console.log(
  //   `article ${article_id} with comment count >>`,
  //   articleWithCommentCount
  // );

  articleWithCommentCount.comment_count =
    +articleWithCommentCount.comment_count;

  return articleWithCommentCount;
};

exports.addVotesToArticle = async (article_id, newVote) => {
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

  // console.log(
  //   `article ${article_id} with comment count >>`,
  //   articleWithCommentCount
  // );

  articleWithCommentCount.comment_count =
    +articleWithCommentCount.comment_count;

  console.log("old votes >>", articleWithCommentCount.comment_count);

  if (newVote) {
    articleWithCommentCount.votes += newVote;
  }

  console.log(
    `article ${article_id} with comment count and new vote equal to ${articleWithCommentCount.votes}, notw that ${newVote} has been added >>`,
    articleWithCommentCount
  );

  return articleWithCommentCount;
};
