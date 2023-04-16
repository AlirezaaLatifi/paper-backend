const whiteList = require("../config/whitList");

const credentials = (req, res, next) => {
  const reqOrigin = req.headers.origin;
  if (whiteList.includes(reqOrigin)) {
    res.header("Access-Control-Allow-Credentials", true);
  }
  next();
};

module.exports = credentials;
