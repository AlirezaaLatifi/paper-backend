const fs = require("fs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const handleRefreshToken = (req, res) => {
  const users = JSON.parse(
    fs.readFileSync(`${__dirname}/${process.env.USERS_DB}`, "utf8")
  );
  const cookies = req.cookies;

  if (!cookies?.jwt)
    return res.status(401).json({
      message: "There is no Refresh token",
    });

  console.log("users", users);
  console.log("reqjwt", cookies.jwt);

  const refreshToken = cookies.jwt;
  const foundUser = users.find((user) => user.refreshToken === refreshToken);
  console.log("founduser", foundUser);

  if (!foundUser)
    return res.status(403).json({
      message: "no user with given refresh token.",
    });

  // evaluate jwt
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, payload) => {
    if (err || foundUser.username !== payload.username)
      return res.sendStatus(403);
    const accessToken = jwt.sign(
      { username: payload.username },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "2h" }
    );
    res.json({
      accessToken,
    });
  });
};

module.exports = { handleRefreshToken };
