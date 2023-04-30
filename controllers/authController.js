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
      .status(400) // bad request
      .json({ message: "username and password are required" });
  }
  // check for user existance
  const foundUser = usersDB.users.find((user) => user.username === username);
  if (!foundUser) {
    return res
      .status(401) //Unauthorized
      .json({
        message: "user not found.",
      });
  }
  // evaluate password
  const isPassMatch = await bcrypt.compare(pass, foundUser.pass);
  if (isPassMatch) {
    // create jwt
    const accessToken = jwt.sign(
      { usename: foundUser.username },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "2h" }
    );
    const refreshToken = jwt.sign(
      { username: foundUser.username },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "5d" }
    );

    // update database by adding refresh token to the currentUser
    const otherUsers = usersDB.users.filter(
      (user) => user.username !== foundUser.username
    );
    const currentUser = { ...foundUser, refreshToken };
    usersDB.setUsers([...otherUsers, currentUser].sort((a, b) => a.id - b.id));
    await fsPromises.writeFile(
      path.join(__dirname, "..", "models", "users.json"),
      JSON.stringify(usersDB.users)
    );

    // send response
    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      secure: true,
      sameSite: "None",
    });

    res.json({
      accessToken,
    });
  } else {
    res
      .status(401) //Unauthorized
      .json({
        message: "wrong password.",
      });
  }
}

module.exports = { handleLogin };
