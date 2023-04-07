const logEvents = require("../helpers/logEvents");

function reqLogger(req, res, next) {
  logEvents(`${req.method}\t${req.headers.origin}\t${req.url}`, "reqLogs.txt");
  next();
}

module.exports = reqLogger;
