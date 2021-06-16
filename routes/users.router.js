const express = require("express");

const { getUserByUsername } = require("../controllers/users.controllers");

const usersRouter = express.Router();

usersRouter.route("/:username").get(getUserByUsername);

module.exports = usersRouter;
