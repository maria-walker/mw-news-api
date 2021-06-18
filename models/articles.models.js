const db = require("../db/connection");

exports.fetchArticles = async (sort_by, order, topic) => {
  let query_values = [];
  let queryStr = `SELECT articles.author,
  articles.title,
  articles.article_id,
  articles.topic,
  articles.created_at, articles.votes, COUNT (comment_id)::INT AS comment_count
  FROM articles
  LEFT JOIN comments ON articles.article_id = comments.article_id
  `;

  if (topic) {
    queryStr += ` WHERE topic = $1`;
    query_values.push(topic);
  }

  queryStr += ` GROUP BY articles.article_id`;

  if (
    sort_by &&
    ![
      "author",
      "title",
      "article_id",
      "topic",
      "created_at",
      "votes",
      "comment_count",
    ].includes(sort_by)
  ) {
    return Promise.reject({
      status: 400,
      msg: "Invalid sort query: column doesn't exist",
    });
  }

  if (order && !["asc", "desc"].includes(order)) {
    return Promise.reject({ status: 400, msg: "Invalid order query" });
  }

  if (sort_by) {
    queryStr += ` ORDER BY ${sort_by} `;
  } else {
    queryStr += ` ORDER BY articles.created_at `;
  }

  if (order) {
    queryStr += ` ${order} `;
  } else {
    queryStr += ` DESC`;
  }

  queryStr += `;`;

  const allArticles = await db.query(queryStr, query_values);

  if (topic && allArticles.rows.length === 0) {
    const topicResult = await db.query(`SELECT * FROM topics WHERE slug = $1`, [
      topic,
    ]);
    if (topicResult.rows.length === 0) {
      return Promise.reject({ status: 404, msg: "Topic not found" });
    }
  }

  return allArticles.rows;
};

exports.selectArticleById = async (article_id) => {
  let queryStr = `SELECT articles.*, COUNT (comment_id) AS comment_count
  FROM articles
  LEFT JOIN comments ON articles.article_id = comments.article_id WHERE articles.article_id = $1 GROUP BY articles.article_id`;

  const articleResult = await db.query(queryStr, [article_id]);

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

  if (!newVote || numberOfPropsOnRequestBody > 1) {
    return Promise.reject({ status: 400, msg: "invalid request body" });
  }

  const updatedVotes = article.votes + newVote;

  await db.query(
    `UPDATE articles SET votes = $1 WHERE article_id = $2 RETURNING *;`,
    [updatedVotes, article_id]
  );

  article.votes += newVote;

  return article;
};
