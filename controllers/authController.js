const usersDB = {
  users: require("../models/users.json"),
  setUsers: function (data) {
    this.users = data;
  },
};

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const fsPromises = require("fs").promises;
const path = require("path");

async function handleLogin(req, res) {
  const { username, pass } = req.body;
  // check for empty inputs
  if (!username || !pass) {
    return res
      .status(400)
      .json({ message: "username and password are required." });
  }
  // check for existance
  const foundUser = usersDB.users.find((user) => user.username === username);
  if (!foundUser) {
    return res.status(401).json({ message: "user not found." }); //Unauthorized
  }
  // evaluating password
  const isPassMatch = await bcrypt.compare(pass, foundUser.pass);
  if (isPassMatch) {
    // create jwt
    const accessToken = jwt.sign(
      { usename: foundUser.username },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "50s" }
    );
    const refreshToken = jwt.sign(
      { username: foundUser.username },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "5d" }
    );

    // update database
    const otherUsers = usersDB.users.filter(
      (user) => user.username !== foundUser.username
    );
    const currentUser = { ...foundUser, refreshToken };
    usersDB.setUsers([...otherUsers, currentUser]);
    await fsPromises.writeFile(
      path.join(__dirname, "..", "models", "users.json"),
      JSON.stringify(usersDB.users)
    );

    // TODO: add secure:ture and sameSite:'None' in production at the  below cookie's option
    // send response
    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.json({ accessToken });
  } else {
    res.sendStatus(401); //Unauthorized
  }
}

module.exports = { handleLogin };
