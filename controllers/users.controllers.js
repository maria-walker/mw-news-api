const { selectUserByUsername } = require("../models/users.models");

function getUserByUsername(req, res, next) {
  const { username } = req.params;

  selectUserByUsername(username)
    .then((user) => {
      //console.log("user in controller", user);
      res.status(200).send({ user: user });
    })
    .catch(next);
}

module.exports = { getUserByUsername };
