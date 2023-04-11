const usersDB = {
  users: require("../models/users.json"),
  setUsers: function (data) {
    this.users = data;
  },
};

const bcrypt = require("bcrypt");

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
    return res.status(401).json({ message: "user not found." });
  }
  // evaluating password
  const isPassMatch = await bcrypt.compare(pass, foundUser.pass);
  if (isPassMatch) {
    // will create JWTs here
    res.json({ message: `user ${username} is logged in.` });
  } else {
    res.status(401).json({ message: "password is incorrect!" });
  }
}

module.exports = { handleLogin };
