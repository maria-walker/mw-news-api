const db = require("../db/connection");

exports.selectTopics = async () => {
  let queryStr = `SELECT * FROM topics;`;

  const topicsResult = await db.query(queryStr);
  //console.log("topics in model", topicsResult.rows);
  return topicsResult.rows;
};
