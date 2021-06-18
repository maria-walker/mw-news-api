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
