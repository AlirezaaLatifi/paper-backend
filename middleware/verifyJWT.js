const jwt = require("jsonwebtoken");
require("dotenv").config();

function verifyJWT(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.sendStatus(401);
  const reqToken = authHeader.split(" ")[1];
  jwt.verify(reqToken, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
    if (err) return res.sendStatus(403); //invalid token
    console.log(`payload: ${payload}`);
    req.user = payload.username;
    next();
  });
}

module.exports = verifyJWT;
