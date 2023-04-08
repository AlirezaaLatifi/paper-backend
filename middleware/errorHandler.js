const logEvents = require("../helpers/logEvents");

function errorHandler(err, req, res, next) {
  logEvents(`${err.name}: ${err.message}`, "errLog.txt");
  console.error(err.stack);
  res.status(500).json({ error: err.message });
}

module.exports = errorHandler;
