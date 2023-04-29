const usersDB = {
  users: require("../models/users.json"),
  setUsers: function (data) {
    this.users = data;
  },
};

const jwt = require("jsonwebtoken");
require("dotenv").config();

const handleRefreshToken = (req, res) => {
  const cookies = req.cookies;

  if (!cookies?.jwt)
    return res.status(401).json({
      message: "There is no Refresh token",
    });

  const refreshToken = cookies.jwt;
  const foundUser = usersDB.users.find(
    (user) => user.refreshToken === refreshToken
  );
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
      { expiresIn: "30s" }
    );
    res.json({
      accessToken,
    });
  });
};

module.exports = { handleRefreshToken };
