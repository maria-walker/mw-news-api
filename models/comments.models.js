const db = require("../db/connection");

exports.selectCommentsByArticle = async (article_id) => {
  let queryStr = `SELECT * FROM comments WHERE article_id = $1;`;

  const commentsResult = await db.query(queryStr, [article_id]);

  if (commentsResult.rows.length === 0) {
    const articleResult = await db.query(
      `SELECT * FROM articles WHERE article_id = $1`,
      [article_id]
    );

    if (articleResult.rows.length === 0) {
      return Promise.reject({ status: 404, msg: "article not found" });
    }
  }

  return commentsResult.rows;
};

exports.submitComment = async (
  article_id,
  username,
  body,
  areRequestKeysValid
) => {
  if (
    !username ||
    !body ||
    !areRequestKeysValid ||
    typeof username !== "string" ||
    typeof body !== "string"
  ) {
    return Promise.reject({ status: 400, msg: "invalid comment request" });
  }

  const checkArticleExists = await db.query(
    `SELECT * FROM articles WHERE article_id = $1`,
    [article_id]
  );

  if (checkArticleExists.rows.length === 0) {
    return Promise.reject({ status: 404, msg: "article not found" });
  }

  const checkUsernameExists = await db.query(
    `SELECT * FROM users WHERE username = $1`,
    [username]
  );

  if (checkUsernameExists.rows.length === 0) {
    return Promise.reject({ status: 404, msg: "username not found" });
  }

  const newComment = await db.query(
    `INSERT INTO comments (author, body, article_id) VALUES ($1, $2, $3) RETURNING author, body, created_at;`,
    [username, body, article_id]
  );

  return newComment.rows[0];
};
