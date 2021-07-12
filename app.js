const express = require("express");
const cors = require("cors");
const {
  handle500ServerErrors,
  handleCustomErrors,
  handlePSQL400Errors,
  send404,
} = require("./errors/errors");

const apiRouter = require("./routes/api.router");

const app = express();

app.use(cors());

app.use(express.json());

app.use("/api", apiRouter);

app.all("*", send404);

app.use(handleCustomErrors);
app.use(handlePSQL400Errors);
app.use(handle500ServerErrors);

module.exports = app;
