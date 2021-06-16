const express = require("express");
const {
  handle500ServerErrors,
  handleCustomErrors,
  handlePSQL400Errors,
  send404,
} = require("./errors/errors");
//const { getTopics } = require("./controllers/topics.controllers");
const apiRouter = require("./routes/api.router");

//const {errors} = require('./errors/errors')

const app = express();

//standard middleware

app.use(express.json());

app.use("/api", apiRouter);

//app.get("/api/topics", getTopics);

app.all("*", send404);

// //error-handling middleware

app.use(handleCustomErrors);
app.use(handlePSQL400Errors);
app.use(handle500ServerErrors);

module.exports = app;
