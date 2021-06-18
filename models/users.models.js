const db = require("../db/connection");

exports.selectUserByUsername = async (username) => {
  let queryStr = `SELECT * FROM users WHERE username = $1;`;

  const userResult = await db.query(queryStr, [username]);

  if (userResult.rows.length === 0) {
    return Promise.reject({ status: 404, msg: "user not found" });
  }

  return userResult.rows[0];
};
