const { selectUserByUsername } = require("../models/users.models");

function getUserByUsername(req, res, next) {
  const { username } = req.params;

  selectUserByUsername(username)
    .then((user) => {
      res.status(200).send({ user });
    })
    .catch(next);
}

module.exports = { getUserByUsername };
