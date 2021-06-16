const db = require("../db/connection");

exports.selectUserByUsername = async (username) => {
  let query_values = [];
  let queryStr = `SELECT * FROM users`;

  if (username) {
    queryStr += ` WHERE username = $1`;
    query_values.push(username);
  }

  queryStr += ";";

  const userResult = await db.query(queryStr, query_values);

  if (userResult.rows.length === 0) {
    return Promise.reject({ status: 404, msg: "user not found" });
  }
  //console.log("user in model", userResult.rows[0]);
  return userResult.rows[0];
};
