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
  //checking whether the comment request is valid
  if (
    !username ||
    !body ||
    !areRequestKeysValid ||
    typeof username !== "string" ||
    typeof body !== "string"
  ) {
    //console.log("something went wrong");
    return Promise.reject({ status: 400, msg: "invalid comment request" });
  }

  //checking whether the article exists
  const checkArticleExists = await db.query(
    `SELECT * FROM articles WHERE article_id = $1`,
    [article_id]
  );

  if (checkArticleExists.rows.length === 0) {
    return Promise.reject({ status: 404, msg: "article not found" });
  }

  //checking whether the user exists
  const checkUsernameExists = await db.query(
    `SELECT * FROM users WHERE username = $1`,
    [username]
  );

  if (checkUsernameExists.rows.length === 0) {
    return Promise.reject({ status: 404, msg: "username not found" });
  }
  //**this is to test that the comment count for the article has gone up by 1 after the comment has been posted (I couldn't find a way to test this in the test file so I'm checking here in the model)**

  // const numberOfComments = await db.query(
  //   `SELECT COUNT(article_id)::INT from Comments WHERE article_id = ${article_id} GROUP BY article_id;`
  // );

  const newComment = await db.query(
    `INSERT INTO comments (author, body, article_id) VALUES ($1, $2, $3) RETURNING author, body, created_at;`,
    [username, body, article_id]
  );

  // const newNumberOfComments = await db.query(
  //   `SELECT COUNT(article_id)::INT from Comments WHERE article_id = ${article_id} GROUP BY article_id;`
  // );
  // console.log(
  //   `number of comments has increased by ${
  //     newNumberOfComments.rows[0].count - numberOfComments.rows[0].count
  //   }`
  // );

  return newComment.rows[0];
};
