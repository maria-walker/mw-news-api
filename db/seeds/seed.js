const db = require("../connection.js");
const format = require("pg-format");
const {
  formatTopics,
  formatArticles,
  formatUsers,
  formatComments,
} = require("../utils/data-manipulation.js");

const seed = async (data) => {
  // 1. create tables

  const { articleData, commentData, topicData, userData } = data;

  await db.query(`DROP TABLE IF EXISTS comments;`);
  await db.query(`DROP TABLE IF EXISTS articles;`);
  await db.query(`DROP TABLE IF EXISTS users;`);
  await db.query(`DROP TABLE IF EXISTS topics;`);

  await db.query(`CREATE TABLE topics (
    slug VARCHAR(255) PRIMARY KEY NOT NULL,
    description VARCHAR(255) NOT NULL);`);

  await db.query(`CREATE TABLE users (
      username VARCHAR(255) PRIMARY KEY NOT NULL,
      avatar_url VARCHAR(255) NOT NULL,
      name VARCHAR(255) NOT NULL);`);

  await db.query(`CREATE TABLE articles (
        article_id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        body TEXT NOT NULL,
        votes INT DEFAULT 0,
        topic VARCHAR(255) NOT NULL REFERENCES topics(slug),
        author VARCHAR(255) NOT NULL REFERENCES users(username),
        created_at TIMESTAMP DEFAULT current_timestamp);`);

  await db.query(`CREATE TABLE comments (
          comment_id SERIAL PRIMARY KEY,
          author VARCHAR(255) NOT NULL REFERENCES users(username),
          article_id INT NOT NULL REFERENCES articles(article_id),
          votes INT DEFAULT 0,
          created_at TIMESTAMP DEFAULT current_timestamp,
          body TEXT NOT NULL);`);

  const topicValues = formatTopics(topicData);

  // 2. insert data

  const topicsInsertStr = format(
    `INSERT INTO topics (slug, description) VALUES %L RETURNING *;`,
    topicValues
  );

  await db.query(topicsInsertStr);

  const userValues = formatUsers(userData);

  const usersInsertStr = format(
    `
  INSERT INTO users (username, avatar_url, name) VALUES %L RETURNING *;`,
    userValues
  );

  await db.query(usersInsertStr);

  const articleValues = formatArticles(articleData);

  const articlesInsertStr = format(
    `
  INSERT INTO articles (title, body, votes, topic, author, created_at) VALUES %L RETURNING *;`,
    articleValues
  );

  const articleResult = await db.query(articlesInsertStr);

  const commentValues = formatComments(commentData, articleResult.rows);

  const commentsInsertStr = format(
    `
  INSERT INTO comments (author, article_id, votes, created_at, body) VALUES %L RETURNING *;`,
    commentValues
  );

  await db.query(commentsInsertStr);
};

module.exports = seed;
