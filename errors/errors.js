const handleCustomErrors = (err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
};

const handlePSQL400Errors = (err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Bad request! (PSQL 22P02)" });
  } else {
    next(err);
  }
};

const handle500ServerErrors = (err, req, res, next) => {
  console.log(err, "<< unhandled error");
  res.status(500).send({ msg: "Internal server error!" });
};

const send404 = (req, res, next) => {
  res.status(404).send({ msg: "route not found" });
};

module.exports = {
  handleCustomErrors,
  handlePSQL400Errors,
  handle500ServerErrors,
  send404,
};
