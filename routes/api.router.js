const express = require("express");

const { getEndpoints } = require("../controllers/api.controllers");

const topicsRouter = require("./topics.router.js");
const usersRouter = require("./users.router.js");
const articlesRouter = require("./articles.router.js");

const apiRouter = express.Router();

apiRouter.get("/", getEndpoints);
apiRouter.use("/topics", topicsRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/articles", articlesRouter);

module.exports = apiRouter;
