const { selectTopics } = require("../models/topics.models");

function getTopics(req, res, next) {
  selectTopics()
    .then((topics) => {
      //console.log("topics in controller", topics);
      res.status(200).send({ topics: topics });
    })
    .catch(next);
}

module.exports = { getTopics };
