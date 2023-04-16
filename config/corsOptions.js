const whiteList = require("./whitList");

const corsOptions = {
  origin: function (reqOrigin, callback) {
    if (whiteList.indexOf(reqOrigin) !== -1 || !reqOrigin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

module.exports = corsOptions;
